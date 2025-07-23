import { getDB } from '../../../config/mongodb.js';
import { ObjectId } from 'mongodb';
import { ApplicationError } from '../../../errorHandle/error.js';

/**
 * Service class for branch-related operations
 */
export default class BranchService {
    constructor() {
        this.departmentsCollection = "Departments";
    }

    /**
     * Get all branches across all departments
     * @returns {Array} - Flattened array of all branches
     */
    async getAllBranches() {
        const db = await getDB();

        const departments = await db.collection(this.departmentsCollection).find().toArray();

        // Flatten all branches and add department information
        const allBranches = [];
        for (const dept of departments) {
            if (dept.branches && Array.isArray(dept.branches)) {
                for (const branch of dept.branches) {
                    allBranches.push({
                        ...branch,
                        departmentId: dept._id,
                        departmentName: dept.department
                    });
                }
            }
        }

        return allBranches;
    }

    /**
     * Get branches for a specific department
     * @param {string} departmentId - Department ID
     * @returns {Array} - Array of branches
     */
    async getBranchesByDepartment(departmentId) {
        const db = await getDB();

        if (!departmentId) {
            throw new ApplicationError("Department ID is required", 400);
        }

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        const department = await db.collection(this.departmentsCollection).findOne(
            { _id: departmentObjectId },
            { projection: { branches: 1, department: 1 } }
        );

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        return department.branches || [];
    }

    /**
     * Get branch by short form
     * @param {string} departmentId - Department ID
     * @param {string} shortForm - Branch short form
     * @returns {Object} - Branch object
     */
    async getBranchByShortForm(departmentId, shortForm) {
        const branches = await this.getBranchesByDepartment(departmentId);

        if (!shortForm) {
            throw new ApplicationError("Branch short form is required", 400);
        }

        const branch = branches.find(b => b.shortForm === shortForm);

        if (!branch) {
            throw new ApplicationError("Branch not found in department", 404);
        }

        return branch;
    }

    /**
     * Add session to a branch
     * @param {Object} sessionData - Data for adding a session
     * @returns {Object} - Result of the operation
     */
    async addSession(sessionData) {
        const db = await getDB();
        const { departmentId, branchShortForm, session } = sessionData;

        if (!departmentId || !branchShortForm || !session) {
            throw new ApplicationError("Department ID, branch short form, and session are required", 400);
        }

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        // Check if the department exists
        const department = await db.collection(this.departmentsCollection).findOne({ _id: departmentObjectId });
        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Find the branch in the department
        const branchIndex = department.branches?.findIndex(b => b.shortForm === branchShortForm);
        if (branchIndex === -1 || branchIndex === undefined) {
            throw new ApplicationError("Branch not found in this department", 404);
        }

        // Check if session already exists in branch
        if (department.branches[branchIndex].session?.includes(session)) {
            throw new ApplicationError(`Session ${session} already exists in this branch`, 400);
        }

        // Add the session to the branch
        const result = await db.collection(this.departmentsCollection).updateOne(
            { _id: departmentObjectId, "branches.shortForm": branchShortForm },
            { $push: { "branches.$.session": session } }
        );

        if (result.modifiedCount === 0) {
            throw new ApplicationError("Failed to add session", 500);
        }

        return {
            result,
            message: `Session ${session} added to branch ${branchShortForm} successfully`
        };
    }

    /**
     * Update a session in a branch
     * @param {Object} updateData - Data for updating a session
     * @returns {Object} - Result of the operation
     */
    async updateSession(updateData) {
        const db = await getDB();
        const { departmentId, branchShortForm, oldSession, newSession } = updateData;

        if (!departmentId || !branchShortForm || !oldSession || !newSession) {
            throw new ApplicationError("Department ID, branch short form, old session, and new session are required", 400);
        }

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        // Check if the department exists
        const department = await db.collection(this.departmentsCollection).findOne({ _id: departmentObjectId });
        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Find the branch in the department
        const branchIndex = department.branches?.findIndex(b => b.shortForm === branchShortForm);
        if (branchIndex === -1 || branchIndex === undefined) {
            throw new ApplicationError("Branch not found in this department", 404);
        }

        // Check if old session exists
        if (!department.branches[branchIndex].session?.includes(oldSession)) {
            throw new ApplicationError(`Session ${oldSession} does not exist in this branch`, 400);
        }

        // Check if new session already exists
        if (department.branches[branchIndex].session?.includes(newSession)) {
            throw new ApplicationError(`Session ${newSession} already exists in this branch`, 400);
        }

        // Update the session in the branch
        const result = await db.collection(this.departmentsCollection).updateOne(
            {
                _id: departmentObjectId,
                "branches.shortForm": branchShortForm,
                "branches.session": oldSession
            },
            {
                $set: { "branches.$.session.$[elem]": newSession }
            },
            {
                arrayFilters: [{ elem: oldSession }]
            }
        );

        if (result.modifiedCount === 0) {
            throw new ApplicationError("Failed to update session", 500);
        }

        return {
            result,
            message: `Session updated from ${oldSession} to ${newSession} in branch ${branchShortForm}`
        };
    }

    /**
     * Remove a session from a branch
     * @param {Object} sessionData - Data for removing a session
     * @returns {Object} - Result of the operation
     */
    async removeSession(sessionData) {
        const db = await getDB();
        const { departmentId, branchShortForm, session } = sessionData;

        if (!departmentId || !branchShortForm || !session) {
            throw new ApplicationError("Department ID, branch short form, and session are required", 400);
        }

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        // Check if the department exists
        const department = await db.collection(this.departmentsCollection).findOne({ _id: departmentObjectId });
        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Find the branch in the department
        const branchIndex = department.branches?.findIndex(b => b.shortForm === branchShortForm);
        if (branchIndex === -1 || branchIndex === undefined) {
            throw new ApplicationError("Branch not found in this department", 404);
        }

        // Check if session exists in branch
        if (!department.branches[branchIndex].session?.includes(session)) {
            throw new ApplicationError(`Session ${session} does not exist in this branch`, 400);
        }

        // Remove the session from the branch
        const result = await db.collection(this.departmentsCollection).updateOne(
            { _id: departmentObjectId, "branches.shortForm": branchShortForm },
            { $pull: { "branches.$.session": session } }
        );

        if (result.modifiedCount === 0) {
            throw new ApplicationError("Failed to remove session", 500);
        }

        return {
            result,
            message: `Session ${session} removed from branch ${branchShortForm} successfully`
        };
    }

    /**
     * Get branch approval requests
     * @param {string} status - Optional status filter (pending, approved, rejected)
     * @returns {Array} - Array of branch approval requests
     */
    async getBranchApprovalRequests(status = null) {
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
        return await db.collection("BranchApprovalRequests").find(filter)
            .sort({ createdAt: -1 })
            .toArray();
    }

    /**
     * Process (approve/reject) a branch approval request
     * @param {Object} requestData - Request data including ID and action
     * @param {string} processedBy - ID or code of the user processing the request
     * @returns {Object} - Result of the operation
     */
    async processBranchRequest(requestData, processedBy = 'admin') {
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

        // Find the branch request
        const branchRequest = await db.collection("BranchApprovalRequests").findOne({
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
            return await this._approveBranchRequest(branchRequest, processedBy);
        } else {
            return await this._rejectBranchRequest(branchRequest, reason, processedBy);
        }
    }

    /**
     * Approve a branch request
     * @private
     */
    async _approveBranchRequest(branchRequest, processedBy) {
        const db = await getDB();

        const { departmentId, name, shortForm, session } = branchRequest.branch;

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            // Update request status to rejected with reason
            await db.collection("BranchApprovalRequests").updateOne(
                { _id: branchRequest._id },
                {
                    $set: {
                        status: 'rejected',
                        rejectionReason: 'Invalid department ID format',
                        processedAt: new Date(),
                        processedBy: processedBy
                    }
                }
            );

            throw new ApplicationError("Invalid department ID format", 400);
        }

        // Check if the department exists
        const department = await db.collection(this.departmentsCollection).findOne({ _id: departmentObjectId });
        if (!department) {
            // Update request status to rejected with reason
            await db.collection("BranchApprovalRequests").updateOne(
                { _id: branchRequest._id },
                {
                    $set: {
                        status: 'rejected',
                        rejectionReason: 'Department not found',
                        processedAt: new Date(),
                        processedBy: processedBy
                    }
                }
            );

            throw new ApplicationError("Department not found", 404);
        }

        // Check if branch with the same short form already exists in this department
        if (department.branches && department.branches.some(b => b.shortForm === shortForm)) {
            // Update request status to rejected with reason
            await db.collection("BranchApprovalRequests").updateOne(
                { _id: branchRequest._id },
                {
                    $set: {
                        status: 'rejected',
                        rejectionReason: `Branch with short form ${shortForm} already exists in this department`,
                        processedAt: new Date(),
                        processedBy: processedBy
                    }
                }
            );

            throw new ApplicationError(`Branch with short form ${shortForm} already exists in this department`, 400);
        }

        // Create the branch object
        const newBranch = {
            name,
            shortForm,
            session: session ? [session] : []
        };

        // Add the branch to the department
        const insertResult = await db.collection(this.departmentsCollection).updateOne(
            { _id: departmentObjectId },
            { $push: { branches: newBranch } }
        );

        if (insertResult.modifiedCount === 0) {
            // Update request status to rejected with reason
            await db.collection("BranchApprovalRequests").updateOne(
                { _id: branchRequest._id },
                {
                    $set: {
                        status: 'rejected',
                        rejectionReason: 'Failed to add branch',
                        processedAt: new Date(),
                        processedBy: processedBy
                    }
                }
            );

            throw new ApplicationError("Failed to add branch", 500);
        }

        // Update request status to approved
        const requestResult = await db.collection("BranchApprovalRequests").updateOne(
            { _id: branchRequest._id },
            {
                $set: {
                    status: 'approved',
                    processedAt: new Date(),
                    processedBy: processedBy
                }
            }
        );

        return {
            branchResult: insertResult,
            requestResult,
            message: "Branch request approved and branch added successfully"
        };
    }

    /**
     * Reject a branch request
     * @private
     */
    async _rejectBranchRequest(branchRequest, reason, processedBy) {
        const db = await getDB();

        // Reject the request
        const result = await db.collection("BranchApprovalRequests").updateOne(
            { _id: branchRequest._id },
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
            message: "Branch request rejected successfully"
        };
    }
}