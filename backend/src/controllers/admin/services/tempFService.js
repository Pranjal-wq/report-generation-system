import { getDB } from '../../../config/mongodb.js';
import { ObjectId } from 'mongodb';
import { ApplicationError } from '../../../errorHandle/error.js';

/**
 * Service class for faculty-related operations
 */
export default class FacultyService {
    constructor() {
        this.facultyCollection = "Faculty";
        this.departmentsCollection = "Departments";
    }

    /**
     * Add faculty members (supports both single and bulk operations)
     * @param {Object} facultyData - Data for adding faculty members
     * @returns {Object} - Result of the operation
     */
    async addFaculty(facultyData) {
        const db = await getDB();
        const { empCode, name, department, email, faculties } = facultyData;

        // Determine if this is a bulk or single operation based on the data
        const isBulkOperation = faculties && Array.isArray(faculties) && faculties.length > 0;
        const isSingleOperation = empCode && name && department;

        if (!isBulkOperation && !isSingleOperation) {
            throw new ApplicationError("Either provide faculty details for a single faculty, or an array of faculties for bulk operations", 400);
        }

        // Handle single faculty operation
        if (isSingleOperation) {
            return await this._addSingleFaculty({ empCode, name, department, email });
        }

        // Handle bulk operation
        if (isBulkOperation) {
            return await this._addMultipleFaculties(faculties);
        }
    }

    /**
     * Add a single faculty member
     * @private
     */
    async _addSingleFaculty(facultyData) {
        const db = await getDB();
        const { empCode, name, department, email } = facultyData;

        // Validate required fields
        if (!empCode || !name || !department) {
            throw new ApplicationError("Employee code, name, and department are required", 400);
        }

        // Check if faculty with this employee code already exists
        const existingFaculty = await db.collection(this.facultyCollection).findOne({ empCode });
        if (existingFaculty) {
            throw new ApplicationError(`Faculty with employee code ${empCode} already exists`, 400);
        }

        // Find if the department exists
        const departmentExists = await db.collection(this.departmentsCollection).findOne({ department });
        if (!departmentExists) {
            throw new ApplicationError(`Department ${department} does not exist`, 404);
        }

        // Create the faculty object
        const newFaculty = {
            empCode,
            name,
            department,
            email: email || null, // Optional email
            createdAt: new Date()
        };

        // Insert the faculty into the database
        const result = await db.collection(this.facultyCollection).insertOne(newFaculty);

        return {
            result,
            faculty: {
                ...newFaculty,
                _id: result.insertedId
            }
        };
    }

    /**
     * Add multiple faculty members
     * @private
     */
    async _addMultipleFaculties(faculties) {
        const db = await getDB();
        const results = {
            successful: [],
            failed: []
        };

        // Process each faculty entry
        for (const faculty of faculties) {
            try {
                const { empCode, name, department, email } = faculty;

                // Validate required fields for each faculty
                if (!empCode || !name || !department) {
                    results.failed.push({
                        empCode: empCode || 'unknown',
                        error: "Employee code, name, and department are required"
                    });
                    continue;
                }

                // Try to add the faculty using the single faculty method
                const addResult = await this._addSingleFaculty(faculty);

                // Add to successful results
                results.successful.push({
                    empCode,
                    name,
                    _id: addResult.faculty._id
                });

            } catch (error) {
                results.failed.push({
                    empCode: faculty.empCode || 'unknown',
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * Update a faculty member or multiple faculty members
     * @param {Object} updateData - Data for updating faculty members
     * @returns {Object} - Result of the operation
     */
    async updateFaculty(updateData) {
        const db = await getDB();
        const { empCode, name, email, department, facultyUpdates } = updateData;

        // Determine if this is a bulk or single operation based on the request body
        const isBulkOperation = facultyUpdates && Array.isArray(facultyUpdates) && facultyUpdates.length > 0;
        const isSingleOperation = empCode && (name !== undefined || email !== undefined || department !== undefined);

        if (!isBulkOperation && !isSingleOperation) {
            throw new ApplicationError("Either provide faculty details for a single update, or an array of faculty updates for bulk operations", 400);
        }

        // Handle single faculty update
        if (isSingleOperation) {
            return await this._updateSingleFaculty(empCode, { name, email, department });
        }

        // Handle bulk operation
        if (isBulkOperation) {
            return await this._updateMultipleFaculties(facultyUpdates);
        }
    }

    /**
     * Update a single faculty member
     * @private
     */
    async _updateSingleFaculty(empCode, updateFields) {
        const db = await getDB();

        // Validate that we have empCode to identify the faculty
        if (!empCode) {
            throw new ApplicationError("Employee code is required to identify the faculty", 400);
        }

        // Find if the faculty exists
        const existingFaculty = await db.collection(this.facultyCollection).findOne({ empCode });

        if (!existingFaculty) {
            throw new ApplicationError("Faculty not found", 404);
        }

        // Build the update object with only the fields that are provided
        const updates = {};
        const { name, email, department } = updateFields;

        if (name !== undefined) updates.name = name;
        if (email !== undefined) updates.email = email;

        // If department is being changed, validate it exists
        if (department !== undefined && department !== existingFaculty.department) {
            const departmentExists = await db.collection(this.departmentsCollection).findOne({ department });
            if (!departmentExists) {
                throw new ApplicationError(`Department ${department} does not exist`, 404);
            }
            updates.department = department;
        }

        // If there are no updates, return early
        if (Object.keys(updates).length === 0) {
            return {
                matchedCount: 1,
                modifiedCount: 0,
                message: "No updates were provided",
                updatedFields: []
            };
        }

        // Add updatedAt timestamp
        updates.updatedAt = new Date();

        // Update the faculty in the database
        const result = await db.collection(this.facultyCollection).updateOne(
            { _id: existingFaculty._id },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            throw new ApplicationError("Failed to update faculty", 500);
        }

        return {
            ...result,
            updatedFields: Object.keys(updates).filter(key => key !== 'updatedAt')
        };
    }

    /**
     * Update multiple faculty members
     * @private
     */
    async _updateMultipleFaculties(facultyUpdates) {
        const results = {
            successful: [],
            failed: []
        };

        // Process each faculty update
        for (const facultyUpdate of facultyUpdates) {
            try {
                const { empCode, name, email, department } = facultyUpdate;

                // Use the single update method to update this faculty
                const updateResult = await this._updateSingleFaculty(
                    empCode,
                    { name, email, department }
                );

                // Add to successful results
                results.successful.push({
                    empCode,
                    updatedFields: updateResult.updatedFields
                });
            } catch (error) {
                const identifier = facultyUpdate.empCode || 'unknown';
                results.failed.push({
                    identifier,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * Get faculty members, optionally filtered by department
     * @param {string} department - Optional department filter
     * @returns {Array} - Array of faculty members
     */
    async getFaculties(department = null) {
        const db = await getDB();

        const filter = department ? { department } : {};

        return await db.collection(this.facultyCollection).find(filter).toArray();
    }

    /**
     * Get faculty suggestions for search bar autocomplete
     * @param {Object} queryParams - Query parameters
     * @returns {Array} - Array of matching faculty members
     */
    async getFacultySuggestions(queryParams) {
        const db = await getDB();
        const { query, department } = queryParams;

        if (!query || typeof query !== 'string') {
            return [];
        }

        // Create a case-insensitive regex pattern for the search term
        const searchPattern = new RegExp(query, 'i');

        // Build the search filter
        let filter = {
            $or: [
                { name: searchPattern },
                { empCode: searchPattern }
            ]
        };

        // Add optional department filter if provided
        if (department) filter.department = department;

        // Search for faculty that match the filter
        return await db.collection(this.facultyCollection).find(filter)
            .project({
                _id: 1,
                name: 1,
                empCode: 1,
                department: 1,
                email: 1
            })
            .limit(10) // Limit to 10 suggestions
            .toArray();
    }

    /**
     * Get a faculty member by employee code
     * @param {string} empCode - Employee code
     * @returns {Object|null} - Faculty object or null
     */
    async getFacultyByEmpCode(empCode) {
        const db = await getDB();

        if (!empCode) {
            throw new ApplicationError("Employee code is required", 400);
        }

        const faculty = await db.collection(this.facultyCollection).findOne({ empCode });

        if (!faculty) {
            throw new ApplicationError("Faculty not found", 404);
        }

        return faculty;
    }

    /**
     * Assign subjects to faculty for teaching
     * @param {Object} assignmentData - Data for assigning subjects
     * @returns {Object} - Result of the operation
     */
    async assignSubjects(assignmentData) {
        const db = await getDB();
        const { empCode, subjectCodes } = assignmentData;

        if (!empCode || !subjectCodes || !Array.isArray(subjectCodes) || subjectCodes.length === 0) {
            throw new ApplicationError("Employee code and subject codes array are required", 400);
        }

        // Check if faculty exists
        const faculty = await db.collection(this.facultyCollection).findOne({ empCode });
        if (!faculty) {
            throw new ApplicationError("Faculty not found", 404);
        }

        // Create or update subjects array for faculty
        const updateResult = await db.collection(this.facultyCollection).updateOne(
            { empCode },
            { $addToSet: { subjects: { $each: subjectCodes } } }
        );

        return {
            result: updateResult,
            message: `Successfully assigned ${subjectCodes.length} subject(s) to faculty ${faculty.name}`
        };
    }

    /**
     * Get faculty approval requests
     * @param {string} status - Optional status filter (pending, approved, rejected)
     * @returns {Array} - Array of faculty approval requests
     */
    async getFacultyApprovalRequests(status = null) {
        const db = await getDB();

        // Build filter based on optional status parameter
        let filter = {};
        if (status) {
            if (!['pending', 'approved', 'rejected'].includes(status)) {
                throw new ApplicationError("Status must be 'pending', 'approved', or 'rejected'", 400);
            }
            filter.status = status;
        }

        // Get the faculty approval requests
        return await db.collection("FacultyApprovalRequests").find(filter)
            .sort({ createdAt: -1 })
            .toArray();
    }

    /**
     * Process (approve/reject) faculty approval request
     * @param {Object} requestData - Request data including ID and action
     * @param {string} processedBy - ID or code of the user processing the request
     * @returns {Object} - Result of the operation
     */
    async processFacultyRequest(requestData, processedBy = 'admin') {
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

        // Find the faculty request
        const facultyRequest = await db.collection("FacultyApprovalRequests").findOne({
            _id: requestObjectId
        });

        if (!facultyRequest) {
            throw new ApplicationError("Faculty request not found", 404);
        }

        // Check if request is already processed
        if (facultyRequest.status !== 'pending') {
            throw new ApplicationError(`This faculty request has already been ${facultyRequest.status}`, 400);
        }

        // Process based on action
        if (action === 'approve') {
            return await this._approveFacultyRequest(facultyRequest, processedBy);
        } else {
            return await this._rejectFacultyRequest(facultyRequest, reason, processedBy);
        }
    }

    /**
     * Approve a faculty request
     * @private
     */
    async _approveFacultyRequest(facultyRequest, processedBy) {
        const db = await getDB();

        const { empCode, name, department, email } = facultyRequest.faculty;

        // Double-check to see if faculty already exists
        const facultyExists = await db.collection(this.facultyCollection).findOne({ empCode });
        if (facultyExists) {
            // Update request status to rejected with reason
            await db.collection("FacultyApprovalRequests").updateOne(
                { _id: facultyRequest._id },
                {
                    $set: {
                        status: 'rejected',
                        rejectionReason: 'Faculty with same employee code already exists',
                        processedAt: new Date(),
                        processedBy: processedBy
                    }
                }
            );

            throw new ApplicationError(`Faculty with employee code ${empCode} already exists`, 400);
        }

        // Find if the department exists
        const departmentExists = await db.collection(this.departmentsCollection).findOne({ department });
        if (!departmentExists) {
            // Update request status to rejected with reason
            await db.collection("FacultyApprovalRequests").updateOne(
                { _id: facultyRequest._id },
                {
                    $set: {
                        status: 'rejected',
                        rejectionReason: `Department ${department} does not exist`,
                        processedAt: new Date(),
                        processedBy: processedBy
                    }
                }
            );

            throw new ApplicationError(`Department ${department} does not exist`, 404);
        }

        // Create the faculty object
        const newFaculty = {
            empCode,
            name,
            department,
            email: email || null,
            createdAt: new Date()
        };

        // Insert the faculty into the database
        const insertResult = await db.collection(this.facultyCollection).insertOne(newFaculty);

        // Update request status to approved
        const requestResult = await db.collection("FacultyApprovalRequests").updateOne(
            { _id: facultyRequest._id },
            {
                $set: {
                    status: 'approved',
                    processedAt: new Date(),
                    processedBy: processedBy
                }
            }
        );

        return {
            facultyResult: insertResult,
            requestResult,
            message: "Faculty request approved and faculty added successfully"
        };
    }

    /**
     * Reject a faculty request
     * @private
     */
    async _rejectFacultyRequest(facultyRequest, reason, processedBy) {
        const db = await getDB();

        // Reject the request
        const result = await db.collection("FacultyApprovalRequests").updateOne(
            { _id: facultyRequest._id },
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
            message: "Faculty request rejected successfully"
        };
    }
}