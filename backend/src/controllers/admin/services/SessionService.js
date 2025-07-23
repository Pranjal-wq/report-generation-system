import { getDB } from '../../../config/mongodb.js';
import { ObjectId } from 'mongodb';
import { ApplicationError } from '../../../errorHandle/error.js';

/**
 * Service class for session-related operations
 */
export default class SessionService {
    constructor() {
        this.departmentsCollection = "Departments";
        this.configCollection = "Config";
    }

    /**
     * Add or enable sessions (supports both single and bulk operations)
     * @param {Object} sessionData - Data for adding sessions
     * @returns {Object} - Result of the operation
     */
    async addSession(sessionData) {
        const db = await getDB();
        const { departmentId, branchShortForm, session, branchSessions } = sessionData;

        // Determine if this is a bulk or single operation based on the data
        const isBulkOperation = branchSessions && Array.isArray(branchSessions) && branchSessions.length > 0;
        const isSingleOperation = departmentId && branchShortForm && session;

        if (!isBulkOperation && !isSingleOperation) {
            throw new ApplicationError("Either provide departmentId, branchShortForm, session for a single operation, or departmentId and branchSessions array for bulk operations", 400);
        }

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        // Find the department
        const department = await db.collection(this.departmentsCollection).findOne({ _id: departmentObjectId });
        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Handle single session operation
        if (isSingleOperation) {
            return await this._addSingleSession(department, departmentObjectId, branchShortForm, session);
        }

        // Handle bulk operation
        if (isBulkOperation) {
            return await this._addBulkSessions(department, departmentObjectId, branchSessions);
        }
    }

    /**
     * Add a single session to a branch
     * @private
     */
    async _addSingleSession(department, departmentObjectId, branchShortForm, session) {
        const db = await getDB();

        // Check session format (e.g., "2022-26")
        const sessionRegex = /^\d{4}-\d{2,4}$/;
        if (!sessionRegex.test(session)) {
            throw new ApplicationError("Session format should be YYYY-YY or YYYY-YYYY", 400);
        }

        // Find the branch index
        const branchIndex = department.branches?.findIndex(b => b.shortForm === branchShortForm);
        if (branchIndex === -1 || branchIndex === undefined) {
            throw new ApplicationError("Branch not found in this department", 404);
        }

        // Check if session already exists
        if (department.branches[branchIndex].session.includes(session)) {
            throw new ApplicationError("Session already exists for this branch", 400);
        }

        // Update session array
        const updatePath = `branches.${branchIndex}.session`;
        const result = await db.collection(this.departmentsCollection).updateOne(
            { _id: departmentObjectId },
            { $addToSet: { [updatePath]: session } }
        );

        if (result.modifiedCount === 0) {
            throw new ApplicationError("Failed to add session", 500);
        }

        return {
            result,
            message: "Session added successfully"
        };
    }

    /**
     * Add multiple sessions in bulk
     * @private
     */
    async _addBulkSessions(department, departmentObjectId, branchSessions) {
        const db = await getDB();
        const results = {
            successful: [],
            failed: []
        };

        // Process each branch-session entry
        for (const entry of branchSessions) {
            try {
                const { branchShortForm, sessions } = entry;

                if (!branchShortForm || !sessions || !Array.isArray(sessions) || sessions.length === 0) {
                    results.failed.push({
                        branchShortForm: branchShortForm || 'unknown',
                        error: "Branch short form and sessions array are required"
                    });
                    continue;
                }

                // Find the branch index
                const branchIndex = department.branches?.findIndex(b => b.shortForm === branchShortForm);
                if (branchIndex === -1 || branchIndex === undefined) {
                    results.failed.push({
                        branchShortForm,
                        error: "Branch not found in this department"
                    });
                    continue;
                }

                const branchSuccessful = [];
                const branchFailed = [];

                // Process each session for this branch
                for (const session of sessions) {
                    try {
                        // Check session format (e.g., "2022-26")
                        const sessionRegex = /^\d{4}-\d{2,4}$/;
                        if (!sessionRegex.test(session)) {
                            branchFailed.push({
                                session,
                                error: "Session format should be YYYY-YY or YYYY-YYYY"
                            });
                            continue;
                        }

                        // Check if session already exists
                        if (department.branches[branchIndex].session.includes(session)) {
                            branchFailed.push({
                                session,
                                error: "Session already exists for this branch"
                            });
                            continue;
                        }

                        // Update session array
                        const updatePath = `branches.${branchIndex}.session`;
                        const result = await db.collection(this.departmentsCollection).updateOne(
                            { _id: departmentObjectId },
                            { $addToSet: { [updatePath]: session } }
                        );

                        if (result.modifiedCount === 0) {
                            branchFailed.push({
                                session,
                                error: "Failed to add session"
                            });
                            continue;
                        }

                        branchSuccessful.push(session);
                    } catch (error) {
                        branchFailed.push({
                            session,
                            error: error.message
                        });
                    }
                }

                // Add results for this branch
                if (branchSuccessful.length > 0) {
                    results.successful.push({
                        branchShortForm,
                        sessionsAdded: branchSuccessful
                    });
                }

                if (branchFailed.length > 0) {
                    results.failed.push({
                        branchShortForm,
                        sessions: branchFailed
                    });
                }

            } catch (error) {
                results.failed.push({
                    branchShortForm: entry.branchShortForm || 'unknown',
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * Enable a semester (even or odd)
     * @param {string} semesterType - "even" or "odd"
     * @returns {Object} - Result of the operation
     */
    async enableSemester(semesterType) {
        const db = await getDB();

        if (!semesterType || !['even', 'odd'].includes(semesterType.toLowerCase())) {
            throw new ApplicationError("Valid semester type (even or odd) is required", 400);
        }

        // Check if a config collection exists, if not create one
        const configCollectionExists = await db.listCollections({ name: this.configCollection }).toArray();
        if (configCollectionExists.length === 0) {
            await db.createCollection(this.configCollection);
        }

        // Update or insert the active semester configuration
        const result = await db.collection(this.configCollection).updateOne(
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
            result,
            message: `${semesterType.toUpperCase()} semester enabled successfully`
        };
    }

    /**
     * Get the active semester configuration
     * @returns {Object} - Active semester data
     */
    async getActiveSemester() {
        const db = await getDB();

        const activeSemester = await db.collection(this.configCollection).findOne({ configType: 'activeSemester' });

        return activeSemester ? activeSemester.semesterType : null;
    }

    /**
     * Get session approval requests
     * @param {string} status - Optional status filter (pending, approved, rejected)
     * @returns {Array} - Array of session approval requests
     */
    async getSessionApprovalRequests(status = null) {
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
        return await db.collection("SessionApprovalRequests").find(filter)
            .sort({ createdAt: -1 })
            .toArray();
    }

    /**
     * Process (approve/reject) a session approval request
     * @param {Object} requestData - Request data including ID and action
     * @param {string} processedBy - ID or code of the user processing the request
     * @returns {Object} - Result of the operation
     */
    async processSessionRequest(requestData, processedBy = 'admin') {
        const db = await getDB();
        const { requestId, action, reason } = requestData;

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
        const sessionRequest = await db.collection("SessionApprovalRequests").findOne({
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
            return await this._approveSessionRequest(sessionRequest, processedBy);
        } else {
            return await this._rejectSessionRequest(sessionRequest, reason, processedBy);
        }
    }

    /**
     * Approve a session request
     * @private
     */
    async _approveSessionRequest(sessionRequest, processedBy) {
        const db = await getDB();

        // Get department object ID from request
        let departmentObjectId = sessionRequest.departmentId;

        // Find the department
        const department = await db.collection(this.departmentsCollection).findOne({
            _id: departmentObjectId
        });

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Find the branch index
        const branchIndex = department.branches?.findIndex(b =>
            b.shortForm === sessionRequest.branchShortForm
        );

        if (branchIndex === -1 || branchIndex === undefined) {
            throw new ApplicationError("Branch not found in this department", 404);
        }

        // Check if session already exists (double-check)
        if (department.branches[branchIndex].session.includes(sessionRequest.session)) {
            // Update request status to approved since it already exists
            await db.collection("SessionApprovalRequests").updateOne(
                { _id: sessionRequest._id },
                {
                    $set: {
                        status: 'approved',
                        processedAt: new Date(),
                        processedBy: processedBy
                    }
                }
            );

            return {
                message: "Session already exists and has been marked as approved"
            };
        }

        // Update session array in the department
        const updatePath = `branches.${branchIndex}.session`;
        const updateResult = await db.collection(this.departmentsCollection).updateOne(
            { _id: departmentObjectId },
            { $addToSet: { [updatePath]: sessionRequest.session } }
        );

        if (updateResult.modifiedCount === 0) {
            throw new ApplicationError("Failed to add session to department", 500);
        }

        // Update request status to approved
        await db.collection("SessionApprovalRequests").updateOne(
            { _id: sessionRequest._id },
            {
                $set: {
                    status: 'approved',
                    processedAt: new Date(),
                    processedBy: processedBy
                }
            }
        );

        return {
            result: updateResult,
            message: "Session request approved and session added successfully"
        };
    }

    /**
     * Reject a session request
     * @private
     */
    async _rejectSessionRequest(sessionRequest, reason, processedBy) {
        const db = await getDB();

        // Reject the request
        const result = await db.collection("SessionApprovalRequests").updateOne(
            { _id: sessionRequest._id },
            {
                $set: {
                    status: 'rejected',
                    rejectionReason: reason,
                    processedAt: new Date(),
                    processedBy: processedBy
                }
            }
        );

        return {
            result,
            message: "Session request rejected successfully"
        };
    }

    /**
     * Validate session format
     * @param {string} session - Session string to validate
     * @returns {boolean} - Whether the session is valid
     */
    validateSessionFormat(session) {
        const sessionRegex = /^\d{4}-\d{2,4}$/;
        return sessionRegex.test(session);
    }

    /**
     * Check if a session exists for a branch
     * @param {string} departmentId - Department ID
     * @param {string} branchShortForm - Branch short form
     * @param {string} session - Session to check
     * @returns {boolean} - Whether the session exists for the branch
     */
    async checkSessionExists(departmentId, branchShortForm, session) {
        const db = await getDB();

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        // Find the department
        const department = await db.collection(this.departmentsCollection).findOne({
            _id: departmentObjectId,
            "branches": {
                $elemMatch: {
                    "shortForm": branchShortForm,
                    "session": session
                }
            }
        });

        return !!department;
    }
}