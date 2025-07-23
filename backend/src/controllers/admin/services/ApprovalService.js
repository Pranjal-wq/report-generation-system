import { getDB } from '../../../config/mongodb.js';
import { ObjectId } from 'mongodb';
import { ApplicationError } from '../../../errorHandle/error.js';

/**
 * Service class for handling approval-related operations
 */
class ApprovalService {
    constructor() {
        this.sessionRequests = "SessionApprovalRequests";
        this.branchRequests = "BranchApprovalRequests";
        this.departments = "Departments";
    }

    /**
     * Get session approval requests with optional status filter
     * @param {string} status - Optional status filter (pending, approved, rejected)
     * @returns {object} - List of session approval requests
     */
    async getSessionApprovalRequests(status) {
        const db = await getDB();

        // Build filter based on optional status parameter
        let filter = {};
        if (status) {
            if (!['pending', 'approved', 'rejected'].includes(status)) {
                throw new ApplicationError("Status must be 'pending', 'approved', or 'rejected'", 400);
            }
            filter.status = status;
        }

        // Get the session approval requests with department info
        const requests = await db.collection(this.sessionRequests).find(filter)
            .sort({ createdAt: -1 })
            .toArray();

        return {
            status: "success",
            count: requests.length,
            requests
        };
    }

    /**
     * Process (approve or reject) a session request
     * @param {object} params - Parameters for processing the request
     * @returns {object} - Result of the operation
     */
    async processSessionRequest({
        requestId,
        action,
        reason,
        processedBy
    }) {
        const db = await getDB();

        if (!requestId || !action) {
            throw new ApplicationError("Request ID and action are required", 400);
        }

        // Validate action
        if (!['approve', 'reject'].includes(action)) {
            throw new ApplicationError("Action must be either 'approve' or 'reject'", 400);
        }

        // If action is reject, reason is required
        if (action === 'reject' && !reason) {
            throw new ApplicationError("Reason is required when rejecting a request", 400);
        }

        let requestObjectId;
        try {
            requestObjectId = new ObjectId(requestId);
        } catch (error) {
            throw new ApplicationError("Invalid request ID format", 400);
        }

        // Find the session request
        const sessionRequest = await db.collection(this.sessionRequests).findOne({
            _id: requestObjectId
        });

        if (!sessionRequest) {
            throw new ApplicationError("Session request not found", 404);
        }

        // Check if request is already processed
        if (sessionRequest.status !== 'pending') {
            throw new ApplicationError(`This session request has already been ${sessionRequest.status}`, 400);
        }

        // Process based on action
        if (action === 'approve') {
            try {
                // Get department object ID from request
                let departmentObjectId = sessionRequest.departmentId;

                // Find the department
                const department = await db.collection(this.departments).findOne({
                    _id: departmentObjectId
                });

                if (!department) {
                    // Mark as rejected with proper reason
                    await this.markSessionRequestRejected(
                        requestObjectId,
                        "Department not found",
                        processedBy
                    );
                    throw new ApplicationError("Department not found", 404);
                }

                // Find the branch index
                const branchIndex = department.branches?.findIndex(b =>
                    b.shortForm === sessionRequest.branchShortForm
                );

                if (branchIndex === -1 || branchIndex === undefined) {
                    // Mark as rejected with proper reason
                    await this.markSessionRequestRejected(
                        requestObjectId,
                        "Branch not found in this department",
                        processedBy
                    );
                    throw new ApplicationError("Branch not found in this department", 404);
                }

                // Check if session already exists (double-check)
                if (department.branches[branchIndex].session.includes(sessionRequest.session)) {
                    // Update request status to approved since it already exists
                    await db.collection(this.sessionRequests).updateOne(
                        { _id: requestObjectId },
                        {
                            $set: {
                                status: 'approved',
                                processedAt: new Date(),
                                processedBy: processedBy || 'admin'
                            }
                        }
                    );

                    return {
                        status: "success",
                        message: "Session already exists and has been marked as approved"
                    };
                }

                // Update session array in the department
                const updatePath = `branches.${branchIndex}.session`;
                const updateResult = await db.collection(this.departments).updateOne(
                    { _id: departmentObjectId },
                    { $addToSet: { [updatePath]: sessionRequest.session } }
                );

                if (updateResult.modifiedCount === 0) {
                    // Mark as rejected with proper reason
                    await this.markSessionRequestRejected(
                        requestObjectId,
                        "Failed to add session to department",
                        processedBy
                    );
                    throw new ApplicationError("Failed to add session to department", 500);
                }

                // Update request status to approved
                await db.collection(this.sessionRequests).updateOne(
                    { _id: requestObjectId },
                    {
                        $set: {
                            status: 'approved',
                            processedAt: new Date(),
                            processedBy: processedBy || 'admin'
                        }
                    }
                );

                return {
                    status: "success",
                    message: "Session request approved and session added successfully"
                };
            } catch (error) {
                // If we haven't already marked it as rejected, do so now
                if (!error.handled) {
                    await this.markSessionRequestRejected(
                        requestObjectId,
                        error.message || "Unknown error during approval process",
                        processedBy
                    );
                }
                throw error;
            }
        } else {
            // Reject the request
            await db.collection(this.sessionRequests).updateOne(
                { _id: requestObjectId },
                {
                    $set: {
                        status: 'rejected',
                        rejectionReason: reason,
                        processedAt: new Date(),
                        processedBy: processedBy || 'admin'
                    }
                }
            );

            return {
                status: "success",
                message: "Session request rejected successfully"
            };
        }
    }

    /**
     * Helper method to mark a session request as rejected with a specific reason
     * @param {ObjectId} requestId - The request ID
     * @param {string} reason - The rejection reason
     * @param {string} processedBy - Who processed the request
     * @private
     */
    async markSessionRequestRejected(requestId, reason, processedBy) {
        const db = await getDB();
        await db.collection(this.sessionRequests).updateOne(
            { _id: requestId },
            {
                $set: {
                    status: 'rejected',
                    rejectionReason: reason,
                    processedAt: new Date(),
                    processedBy: processedBy || 'admin'
                }
            }
        );
        // Mark the error as handled so we don't try to reject it again
        const error = new ApplicationError(reason, 400);
        error.handled = true;
        return error;
    }

    /**
     * Get branch approval requests with optional status filter
     * @param {string} status - Optional status filter (pending, approved, rejected)
     * @returns {object} - List of branch approval requests
     */
    async getBranchApprovalRequests(status) {
        const db = await getDB();

        // Build filter based on optional status parameter
        let filter = {};
        if (status) {
            if (!['pending', 'approved', 'rejected'].includes(status)) {
                throw new ApplicationError("Status must be 'pending', 'approved', or 'rejected'", 400);
            }
            filter.status = status;
        }

        // Get the branch approval requests
        const requests = await db.collection(this.branchRequests).find(filter)
            .sort({ createdAt: -1 })
            .toArray();

        return {
            status: "success",
            count: requests.length,
            requests
        };
    }

    /**
     * Process (approve or reject) a branch request
     * @param {object} params - Parameters for processing the request
     * @returns {object} - Result of the operation
     */
    async processBranchRequest({
        requestId,
        action,
        reason,
        processedBy
    }) {
        const db = await getDB();

        if (!requestId || !action) {
            throw new ApplicationError("Request ID and action are required", 400);
        }

        // Validate action
        if (!['approve', 'reject'].includes(action)) {
            throw new ApplicationError("Action must be either 'approve' or 'reject'", 400);
        }

        // If action is reject, reason is required
        if (action === 'reject' && !reason) {
            throw new ApplicationError("Reason is required when rejecting a request", 400);
        }

        let requestObjectId;
        try {
            requestObjectId = new ObjectId(requestId);
        } catch (error) {
            throw new ApplicationError("Invalid request ID format", 400);
        }

        // Find the branch request
        const branchRequest = await db.collection(this.branchRequests).findOne({
            _id: requestObjectId
        });

        if (!branchRequest) {
            throw new ApplicationError("Branch request not found", 404);
        }

        // Check if request is already processed
        if (branchRequest.status !== 'pending') {
            throw new ApplicationError(`This branch request has already been ${branchRequest.status}`, 400);
        }

        // Process based on action
        if (action === 'approve') {
            try {
                // Get department object ID from request
                let departmentObjectId = branchRequest.departmentId;

                // Find the department
                const department = await db.collection(this.departments).findOne({
                    _id: departmentObjectId
                });

                if (!department) {
                    // Mark as rejected with proper reason
                    await this.markRequestRejected(
                        requestObjectId,
                        "Department not found",
                        processedBy
                    );
                    throw new ApplicationError("Department not found", 404);
                }

                // Double-check to see if branch already exists
                const branchExists = department.branches?.some(b =>
                    b.program === branchRequest.branch.program ||
                    b.shortForm === branchRequest.branch.shortForm
                );

                if (branchExists) {
                    // Update request status to rejected with reason
                    await this.markRequestRejected(
                        requestObjectId,
                        "Branch with same program name or shortform already exists",
                        processedBy
                    );
                    throw new ApplicationError("Branch with same program or shortform already exists", 400);
                }

                // Add branch to department
                const updateResult = await db.collection(this.departments).updateOne(
                    { _id: departmentObjectId },
                    { $push: { branches: branchRequest.branch } }
                );

                if (updateResult.modifiedCount === 0) {
                    // Mark as rejected with proper reason
                    await this.markRequestRejected(
                        requestObjectId,
                        "Failed to add branch to department",
                        processedBy
                    );
                    throw new ApplicationError("Failed to add branch to department", 500);
                }

                // Determine course types based on course field
                const courseName = branchRequest.branch.course;
                let courseType;

                // Determine course type
                if (courseName.includes('B.Tech-M.Tech') || courseName.includes('B.Tech.-M.Tech.')) {
                    courseType = 'DD'; // Dual Degree
                } else if (courseName.startsWith('B.') || courseName === 'BTech' || courseName === 'B.Tech') {
                    courseType = 'UG'; // Undergraduate
                } else {
                    courseType = 'PG'; // Postgraduate (M.Tech, MBA, MCA, M.Sc, etc.)
                }

                // Check if this course already exists in courses array
                const courseExists = department.courses?.some(c => c.name === courseName);

                // Add course if it doesn't exist
                if (!courseExists) {
                    try {
                        const newCourse = {
                            name: courseName,
                            type: courseType,
                            duration: branchRequest.branch.duration
                        };

                        await db.collection(this.departments).updateOne(
                            { _id: departmentObjectId },
                            { $push: { courses: newCourse } }
                        );
                    } catch (error) {
                        // If course update fails, log it but don't reject the whole request
                        console.error("Failed to add course to department:", error);
                    }
                }

                // Update request status to approved
                await db.collection(this.branchRequests).updateOne(
                    { _id: requestObjectId },
                    {
                        $set: {
                            status: 'approved',
                            processedAt: new Date(),
                            processedBy: processedBy || 'admin'
                        }
                    }
                );

                return {
                    status: "success",
                    message: "Branch request approved and branch added successfully"
                };
            } catch (error) {
                // If we haven't already marked it as rejected, do so now
                if (!error.handled) {
                    await this.markRequestRejected(
                        requestObjectId,
                        error.message || "Unknown error during approval process",
                        processedBy
                    );
                }
                throw error;
            }
        } else {
            // Reject the request
            await db.collection(this.branchRequests).updateOne(
                { _id: requestObjectId },
                {
                    $set: {
                        status: 'rejected',
                        rejectionReason: reason,
                        processedAt: new Date(),
                        processedBy: processedBy || 'admin'
                    }
                }
            );

            return {
                status: "success",
                message: "Branch request rejected successfully"
            };
        }
    }

    /**
     * Helper method to mark a branch request as rejected with a specific reason
     * @param {ObjectId} requestId - The request ID
     * @param {string} reason - The rejection reason
     * @param {string} processedBy - Who processed the request
     * @private
     */
    async markRequestRejected(requestId, reason, processedBy) {
        const db = await getDB();
        await db.collection(this.branchRequests).updateOne(
            { _id: requestId },
            {
                $set: {
                    status: 'rejected',
                    rejectionReason: reason,
                    processedAt: new Date(),
                    processedBy: processedBy || 'admin'
                }
            }
        );
        // Mark the error as handled so we don't try to reject it again
        const error = new ApplicationError(reason, 400);
        error.handled = true;
        return error;
    }

    /**
     * Create a session approval request
     * @param {object} params - Parameters for the session request
     * @returns {object} - Result of the creation
     */
    async createSessionRequest({
        departmentId,
        branchShortForm,
        session,
        requestedBy,
        notes
    }) {
        const db = await getDB();

        // Validate required fields
        if (!departmentId || !branchShortForm || !session) {
            throw new ApplicationError("Department ID, branch short form, and session are required", 400);
        }

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        // Check session format (e.g., "2022-26")
        const sessionRegex = /^\d{4}-\d{2,4}$/;
        if (!sessionRegex.test(session)) {
            throw new ApplicationError("Session format should be YYYY-YY or YYYY-YYYY", 400);
        }

        // Find the department
        const department = await db.collection(this.departments).findOne({ _id: departmentObjectId });
        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Find the branch
        const branch = department.branches?.find(b => b.shortForm === branchShortForm);
        if (!branch) {
            throw new ApplicationError("Branch not found in this department", 404);
        }

        // Check if session already exists
        if (branch.session.includes(session)) {
            throw new ApplicationError("Session already exists for this branch", 400);
        }

        // Check if there's already a pending request for this session
        const existingRequest = await db.collection(this.sessionRequests).findOne({
            departmentId: departmentObjectId,
            branchShortForm,
            session,
            status: 'pending'
        });

        if (existingRequest) {
            throw new ApplicationError("A pending request already exists for this session", 400);
        }

        // Create a new session request
        const newRequest = {
            departmentId: departmentObjectId,
            departmentName: department.department,
            branchShortForm,
            branchProgram: branch.program,
            session,
            status: 'pending',
            requestedBy: requestedBy || 'unknown',
            notes: notes || '',
            createdAt: new Date()
        };

        const result = await db.collection(this.sessionRequests).insertOne(newRequest);

        return {
            status: "success",
            message: "Session approval request submitted successfully",
            requestId: result.insertedId
        };
    }

    /**
     * Create a branch approval request
     * @param {object} params - Parameters for the branch request
     * @returns {object} - Result of the creation
     */
    async createBranchRequest({
        departmentId,
        branch,
        requestedBy,
        notes
    }) {
        const db = await getDB();

        // Validate required fields
        if (!departmentId || !branch || !branch.program || !branch.course || !branch.shortForm || !branch.duration) {
            throw new ApplicationError("Department ID and branch details (program, course, shortForm, duration) are required", 400);
        }

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        // Validate duration
        if (typeof branch.duration !== 'number' || branch.duration < 1 || branch.duration > 5) {
            throw new ApplicationError("Duration must be a number between 1 and 5 years", 400);
        }

        // Find the department
        const department = await db.collection(this.departments).findOne({ _id: departmentObjectId });
        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Check if branch already exists
        const branchExists = department.branches?.some(b =>
            b.program === branch.program || b.shortForm === branch.shortForm
        );

        if (branchExists) {
            throw new ApplicationError(`Branch with program ${branch.program} or shortform ${branch.shortForm} already exists`, 400);
        }

        // Make sure branch has session array
        if (!branch.session) {
            branch.session = [];
        }

        // Check if there's already a pending request for this branch
        const existingRequest = await db.collection(this.branchRequests).findOne({
            departmentId: departmentObjectId,
            'branch.program': branch.program,
            'branch.shortForm': branch.shortForm,
            status: 'pending'
        });

        if (existingRequest) {
            throw new ApplicationError("A pending request already exists for this branch", 400);
        }

        // Create a new branch request
        const newRequest = {
            departmentId: departmentObjectId,
            departmentName: department.department,
            branch,
            status: 'pending',
            requestedBy: requestedBy || 'unknown',
            notes: notes || '',
            createdAt: new Date()
        };

        const result = await db.collection(this.branchRequests).insertOne(newRequest);

        return {
            status: "success",
            message: "Branch approval request submitted successfully",
            requestId: result.insertedId
        };
    }

    /**
     * Configure semester activation (odd/even)
     * @param {string} semesterType - Type of semester (odd/even)
     * @returns {object} - Result of the operation
     */
    async enableSemester(semesterType) {
        const db = await getDB();

        if (!semesterType || !['even', 'odd'].includes(semesterType.toLowerCase())) {
            throw new ApplicationError("Valid semester type (even or odd) is required", 400);
        }

        // Check if a config collection exists, if not create one
        const configCollectionExists = await db.listCollections({ name: 'Config' }).toArray();
        if (configCollectionExists.length === 0) {
            await db.createCollection('Config');
        }

        // Update or insert the active semester configuration
        await db.collection('Config').updateOne(
            { configType: 'activeSemester' },
            {
                $set: {
                    configType: 'activeSemester',
                    semesterType: semesterType.toLowerCase(),
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        );

        return {
            status: "success",
            message: `${semesterType.toUpperCase()} semester enabled successfully`
        };
    }

    /**
     * Get currently active semester
     * @returns {object} - Active semester information
     */
    async getActiveSemester() {
        const db = await getDB();

        const activeSemester = await db.collection('Config').findOne({ configType: 'activeSemester' });

        if (!activeSemester) {
            return {
                status: "success",
                message: "No semester is currently enabled",
                activeSemester: null
            };
        }

        return {
            status: "success",
            activeSemester: activeSemester.semesterType
        };
    }

    /**
     * Update readStatus for session approval request to 'viewed'
     * @param {string} requestId - The ID of the session request to mark as viewed
     * @returns {object} - Result of the operation
     */
    async updateSessionRequestReadStatus(requestId) {
        const db = await getDB();

        if (!requestId) {
            throw new ApplicationError("Request ID is required", 400);
        }

        let requestObjectId;
        try {
            requestObjectId = new ObjectId(requestId);
        } catch (error) {
            throw new ApplicationError("Invalid request ID format", 400);
        }

        // Find the session request
        const sessionRequest = await db.collection(this.sessionRequests).findOne({
            _id: requestObjectId
        });

        if (!sessionRequest) {
            throw new ApplicationError("Session request not found", 404);
        }

        // Update the readStatus to 'viewed'
        await db.collection(this.sessionRequests).updateOne(
            { _id: requestObjectId },
            {
                $set: {
                    readStatus: 'viewed',
                    updatedAt: new Date()
                }
            }
        );

        return {
            status: "success",
            message: "Session request marked as viewed"
        };
    }

    /**
     * Update readStatus for branch approval request to 'viewed'
     * @param {string} requestId - The ID of the branch request to mark as viewed
     * @returns {object} - Result of the operation
     */
    async updateBranchRequestReadStatus(requestId) {
        const db = await getDB();

        if (!requestId) {
            throw new ApplicationError("Request ID is required", 400);
        }

        let requestObjectId;
        try {
            requestObjectId = new ObjectId(requestId);
        } catch (error) {
            throw new ApplicationError("Invalid request ID format", 400);
        }

        // Find the branch request
        const branchRequest = await db.collection(this.branchRequests).findOne({
            _id: requestObjectId
        });

        if (!branchRequest) {
            throw new ApplicationError("Branch request not found", 404);
        }

        // Update the readStatus to 'viewed'
        await db.collection(this.branchRequests).updateOne(
            { _id: requestObjectId },
            {
                $set: {
                    readStatus: 'viewed',
                    updatedAt: new Date()
                }
            }
        );

        return {
            status: "success",
            message: "Branch request marked as viewed"
        };
    }

    /**
     * Bulk update readStatus for multiple session requests to 'viewed'
     * @param {Array} requestIds - Array of session request IDs to mark as viewed
     * @returns {object} - Result of the operation
     */
    async bulkUpdateSessionRequestsReadStatus(requestIds) {
        const db = await getDB();

        if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
            throw new ApplicationError("Array of request IDs is required", 400);
        }

        const objectIds = [];
        for (const id of requestIds) {
            try {
                objectIds.push(new ObjectId(id));
            } catch (error) {
                console.warn(`Invalid ID format: ${id}`);
                // Continue with valid IDs
            }
        }

        if (objectIds.length === 0) {
            throw new ApplicationError("No valid request IDs provided", 400);
        }

        // Update readStatus to 'viewed' for all valid IDs
        const result = await db.collection(this.sessionRequests).updateMany(
            { _id: { $in: objectIds } },
            {
                $set: {
                    readStatus: 'viewed',
                    updatedAt: new Date()
                }
            }
        );

        return {
            status: "success",
            message: `${result.modifiedCount} session requests marked as viewed`
        };
    }

    /**
     * Bulk update readStatus for multiple branch requests to 'viewed'
     * @param {Array} requestIds - Array of branch request IDs to mark as viewed
     * @returns {object} - Result of the operation
     */
    async bulkUpdateBranchRequestsReadStatus(requestIds) {
        const db = await getDB();

        if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
            throw new ApplicationError("Array of request IDs is required", 400);
        }

        const objectIds = [];
        for (const id of requestIds) {
            try {
                objectIds.push(new ObjectId(id));
            } catch (error) {
                console.warn(`Invalid ID format: ${id}`);
                // Continue with valid IDs
            }
        }

        if (objectIds.length === 0) {
            throw new ApplicationError("No valid request IDs provided", 400);
        }

        // Update readStatus to 'viewed' for all valid IDs
        const result = await db.collection(this.branchRequests).updateMany(
            { _id: { $in: objectIds } },
            {
                $set: {
                    readStatus: 'viewed',
                    updatedAt: new Date()
                }
            }
        );

        return {
            status: "success",
            message: `${result.modifiedCount} branch requests marked as viewed`
        };
    }
}

export default ApprovalService;