import { getDB } from '../../../config/mongodb.js';
import { ObjectId } from 'mongodb';
import { ApplicationError } from '../../../errorHandle/error.js';

/**
 * Service class for department-related operations
 */
class DepartmentService {
    constructor() {
        this.departmentsCollection = "Departments";
    }

    /**
     * Get all departments
     * @returns {Array} - Array of departments
     */
    async getAllDepartments() {
        const db = await getDB();
        return await db.collection(this.departmentsCollection)
            .find()
            .project({ department: 1, cn: 1 })
            .toArray();
    }

    /**
     * Get department by ID
     * @param {string} departmentId - Department ID
     * @returns {Object} - Department object
     */
    async getDepartmentById(departmentId) {
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
            { _id: departmentObjectId }
        );

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        return department;
    }

    /**
     * Create a new department
     * @param {Object} departmentData - Department data
     * @returns {Object} - Newly created department
     */
    async createDepartment(departmentData) {
        const db = await getDB();

        const { department, shortName, cn } = departmentData;
        const departmentCode = cn || shortName;

        if (!department || !departmentCode) {
            throw new ApplicationError("Department name and code (cn) are required", 400);
        }

        // Check if department with same name or code already exists
        const existingDepartment = await db.collection(this.departmentsCollection).findOne({
            $or: [{ department }, { cn: departmentCode }]
        });

        if (existingDepartment) {
            const conflictField = existingDepartment.department === department ? 'name' : 'code';
            throw new ApplicationError(`Department with same ${conflictField} already exists`, 400);
        }

        const newDepartment = {
            department,
            cn: departmentCode,
            branches: [],
            courses: [],
            createdAt: new Date()
        };

        const result = await db.collection(this.departmentsCollection).insertOne(newDepartment);

        if (!result.acknowledged) {
            throw new ApplicationError("Failed to create department", 500);
        }

        return {
            _id: result.insertedId,
            ...newDepartment
        };
    }

    /**
     * Update a department
     * @param {string} departmentId - Department ID
     * @param {Object} updateData - Department update data
     * @returns {Object} - Updated department
     */
    async updateDepartment(departmentId, updateData) {
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

        const { department, shortName, cn } = updateData;
        const departmentCode = cn || shortName;

        if (!department && !departmentCode) {
            throw new ApplicationError("No update data provided", 400);
        }

        // Prepare update data
        const updateFields = {};
        if (department) updateFields.department = department;
        if (departmentCode) updateFields.cn = departmentCode;

        // Check if the updated name or code conflicts with existing departments
        if (department || departmentCode) {
            const orConditions = [];
            if (department) orConditions.push({ department });
            if (departmentCode) orConditions.push({ cn: departmentCode });

            const existingDepartment = await db.collection(this.departmentsCollection).findOne({
                _id: { $ne: departmentObjectId },
                $or: orConditions
            });

            if (existingDepartment) {
                let conflictField = '';
                if (department && existingDepartment.department === department) {
                    conflictField = 'name';
                } else if (departmentCode && existingDepartment.cn === departmentCode) {
                    conflictField = 'code';
                }
                throw new ApplicationError(`Department with same ${conflictField} already exists`, 400);
            }
        }

        // Update the department
        const result = await db.collection(this.departmentsCollection).updateOne(
            { _id: departmentObjectId },
            { $set: { ...updateFields, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            throw new ApplicationError("Department not found", 404);
        }

        if (result.modifiedCount === 0) {
            throw new ApplicationError("No changes made to department", 200);
        }

        // Fetch the updated department
        const updatedDepartment = await db.collection(this.departmentsCollection).findOne(
            { _id: departmentObjectId }
        );

        return updatedDepartment;
    }

    /**
     * Delete a department
     * @param {string} departmentId - Department ID
     * @returns {Object} - Result of the operation
     */
    async deleteDepartment(departmentId) {
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

        // Check if the department exists
        const department = await db.collection(this.departmentsCollection).findOne(
            { _id: departmentObjectId }
        );

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Delete the department regardless of whether it has branches
        const result = await db.collection(this.departmentsCollection).deleteOne(
            { _id: departmentObjectId }
        );

        if (result.deletedCount === 0) {
            throw new ApplicationError("Failed to delete department", 500);
        }

        return {
            result,
            message: "Department deleted successfully",
            hadBranches: department.branches && department.branches.length > 0
        };
    }

    /**
     * Add branch to a department
     * @param {string} departmentId - Department ID
     * @param {Object} branchData - Branch data
     * @returns {Object} - Result of the operation
     */
    async addBranch(departmentId, branchData) {
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

        const { program, course, shortForm, duration } = branchData;

        if (!program || !course || !shortForm || !duration) {
            throw new ApplicationError("Branch program, course, shortForm, and duration are required", 400);
        }

        // Check if the department exists
        const department = await db.collection(this.departmentsCollection).findOne(
            { _id: departmentObjectId }
        );

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Check if branch with same short form already exists in this department
        if (department.branches && department.branches.some(b => b.shortForm === shortForm)) {
            throw new ApplicationError(`Branch with short form ${shortForm} already exists in this department`, 400);
        }

        // Create the branch object
        const newBranch = {
            program,
            course,
            shortForm,
            duration,
            session: branchData.session || []
        };

        // Add the branch to the department
        const result = await db.collection(this.departmentsCollection).updateOne(
            { _id: departmentObjectId },
            { $push: { branches: newBranch } }
        );

        // Update the department's courses if needed
        let courseType = "UG"; // Default is Undergraduate
        if (course.includes('M.Tech') || course.startsWith('M.') || course === 'MBA') {
            courseType = "PG"; // Postgraduate
        } else if (course.includes('B.Tech-M.Tech') || course.includes('Dual')) {
            courseType = "DD"; // Dual Degree
        }

        // Check if this course type already exists in this department
        const courseExists = department.courses && department.courses.some(c => c.name === course);

        if (!courseExists) {
            await db.collection(this.departmentsCollection).updateOne(
                { _id: departmentObjectId },
                { $push: { courses: { name: course, type: courseType, duration: Number(duration) } } }
            );
        }

        if (result.modifiedCount === 0) {
            throw new ApplicationError("Failed to add branch", 500);
        }

        return {
            result,
            message: `Branch ${program} (${shortForm}) added to department successfully`
        };
    }

    /**
     * Update a branch in a department
     * @param {string} departmentId - Department ID
     * @param {string} branchShortForm - Branch short form
     * @param {Object} updateData - Branch update data
     * @returns {Object} - Result of the operation
     */
    async updateBranch(departmentId, branchShortForm, updateData) {
        const db = await getDB();

        if (!departmentId || !branchShortForm) {
            throw new ApplicationError("Department ID and branch short form are required", 400);
        }

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        const { program, course, shortForm, duration } = updateData;

        if (!program && !course && !shortForm && !duration) {
            throw new ApplicationError("No update data provided", 400);
        }

        // Check if the department exists
        const department = await db.collection(this.departmentsCollection).findOne(
            { _id: departmentObjectId }
        );

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Find the branch in the department
        const branchIndex = department.branches?.findIndex(b => b.shortForm === branchShortForm);
        if (branchIndex === -1 || branchIndex === undefined) {
            throw new ApplicationError("Branch not found in this department", 404);
        }

        // If shortForm is being updated, check if it conflicts with existing branches
        if (shortForm && shortForm !== branchShortForm) {
            if (department.branches.some(b => b.shortForm === shortForm)) {
                throw new ApplicationError(`Branch with short form ${shortForm} already exists in this department`, 400);
            }
        }

        // Prepare update data
        const updateFields = {};
        if (program) updateFields[`branches.${branchIndex}.program`] = program;
        if (course) updateFields[`branches.${branchIndex}.course`] = course;
        if (shortForm) updateFields[`branches.${branchIndex}.shortForm`] = shortForm;
        if (duration) updateFields[`branches.${branchIndex}.duration`] = duration;

        // Update the branch
        const result = await db.collection(this.departmentsCollection).updateOne(
            { _id: departmentObjectId },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            throw new ApplicationError("Branch not found in department", 404);
        }

        if (result.modifiedCount === 0) {
            throw new ApplicationError("No changes made to branch", 200);
        }

        return {
            result,
            message: `Branch ${branchShortForm} updated successfully`
        };
    }

    /**
     * Delete a branch from a department
     * @param {string} departmentId - Department ID
     * @param {string} branchShortForm - Branch short form
     * @returns {Object} - Result of the operation
     */
    async deleteBranch(departmentId, branchShortForm) {
        const db = await getDB();

        if (!departmentId || !branchShortForm) {
            throw new ApplicationError("Department ID and branch short form are required", 400);
        }

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        // Check if the department exists
        const department = await db.collection(this.departmentsCollection).findOne(
            { _id: departmentObjectId }
        );

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Find the branch in the department
        const branchIndex = department.branches?.findIndex(b => b.shortForm === branchShortForm);
        if (branchIndex === -1 || branchIndex === undefined) {
            throw new ApplicationError("Branch not found in this department", 404);
        }

        // Before deleting the branch, check if it has any associated data like students, subjects, timetables...
        // This check should be implemented with appropriate collections

        // Delete the branch from the department
        const result = await db.collection(this.departmentsCollection).updateOne(
            { _id: departmentObjectId },
            { $pull: { branches: { shortForm: branchShortForm } } }
        );

        if (result.modifiedCount === 0) {
            throw new ApplicationError("Failed to delete branch", 500);
        }

        return {
            result,
            message: `Branch ${branchShortForm} deleted successfully`
        };
    }

    /**
     * Delete a session from a branch
     * @param {string} departmentId - Department ID
     * @param {string} branchShortForm - Branch short form
     * @param {string} session - Session to delete
     * @returns {Object} - Result of the operation
     */
    async deleteSession(departmentId, branchShortForm, session) {
        const db = await getDB();

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
        const department = await db.collection(this.departmentsCollection).findOne(
            { _id: departmentObjectId }
        );

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Find the branch in the department
        const branchIndex = department.branches?.findIndex(b => b.shortForm === branchShortForm);
        if (branchIndex === -1 || branchIndex === undefined) {
            throw new ApplicationError("Branch not found in this department", 404);
        }

        // Check if the session exists in the branch
        if (!department.branches[branchIndex].session.includes(session)) {
            throw new ApplicationError("Session not found in this branch", 404);
        }

        // Delete the session from the branch
        const updatePath = `branches.${branchIndex}.session`;
        const result = await db.collection(this.departmentsCollection).updateOne(
            { _id: departmentObjectId },
            { $pull: { [updatePath]: session } }
        );

        if (result.modifiedCount === 0) {
            throw new ApplicationError("Failed to delete session", 500);
        }

        return {
            result,
            message: `Session ${session} deleted successfully from branch ${branchShortForm}`
        };
    }

    /**
     * Delete a course from a department
     * @param {string} departmentId - Department ID
     * @param {string} courseName - Course name to delete
     * @returns {Object} - Result of the operation
     */
    async deleteCourse(departmentId, courseName) {
        const db = await getDB();

        if (!departmentId || !courseName) {
            throw new ApplicationError("Department ID and course name are required", 400);
        }

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        // Check if the department exists
        const department = await db.collection(this.departmentsCollection).findOne(
            { _id: departmentObjectId }
        );

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Check if the course exists in the department
        const courseIndex = department.courses?.findIndex(c => c.name === courseName);
        if (courseIndex === -1 || courseIndex === undefined) {
            throw new ApplicationError("Course not found in this department", 404);
        }

        // Find all branches that are related to this course
        const relatedBranches = department.branches?.filter(branch => branch.course === courseName) || [];

        // First, remove the course from the department
        const courseResult = await db.collection(this.departmentsCollection).updateOne(
            { _id: departmentObjectId },
            { $pull: { courses: { name: courseName } } }
        );

        // If there are related branches, delete them too
        if (relatedBranches.length > 0) {
            const branchShortForms = relatedBranches.map(branch => branch.shortForm);

            // Remove all branches related to this course
            await db.collection(this.departmentsCollection).updateOne(
                { _id: departmentObjectId },
                { $pull: { branches: { course: courseName } } }
            );

            return {
                courseResult,
                message: `Course ${courseName} deleted successfully along with ${relatedBranches.length} related branches: ${branchShortForms.join(', ')}`
            };
        }

        return {
            courseResult,
            message: `Course ${courseName} deleted successfully`
        };
    }

    /**
     * Create multiple departments in bulk
     * @param {Array} departmentsData - Array of department objects
     * @returns {Object} - Result containing successful and failed operations
     */
    async bulkCreateDepartments(departmentsData) {
        const db = await getDB();

        if (!Array.isArray(departmentsData) || departmentsData.length === 0) {
            throw new ApplicationError("Departments data must be a non-empty array", 400);
        }

        // Processing results
        const results = {
            successful: [],
            failed: []
        };

        // Process each department entry
        for (const departmentData of departmentsData) {
            try {
                const { department, cn } = departmentData;

                if (!department || !cn) {
                    results.failed.push({
                        departmentData,
                        error: "Department name and code (cn) are required"
                    });
                    continue;
                }

                // Check if department with same name or code already exists
                const existingDepartment = await db.collection(this.departmentsCollection).findOne({
                    $or: [{ department }, { cn }]
                });

                if (existingDepartment) {
                    const conflictField = existingDepartment.department === department ? 'name' : 'code';
                    results.failed.push({
                        departmentData,
                        error: `Department with same ${conflictField} already exists`
                    });
                    continue;
                }

                const newDepartment = {
                    department,
                    cn,
                    branches: [],
                    courses: [],
                    createdAt: new Date()
                };

                const result = await db.collection(this.departmentsCollection).insertOne(newDepartment);

                if (!result.acknowledged) {
                    results.failed.push({
                        departmentData,
                        error: "Failed to create department"
                    });
                    continue;
                }

                results.successful.push({
                    _id: result.insertedId,
                    department,
                    cn
                });

            } catch (error) {
                results.failed.push({
                    departmentData,
                    error: error.message
                });
            }
        }

        return this.formatBulkResults(results.successful, results.failed, "departments");
    }

    /**
     * Format results of bulk operations
     * @param {Array} successful - Array of successful operations
     * @param {Array} failed - Array of failed operations
     * @param {String} entityName - Name of entity type
     * @returns {Object} - Formatted results
     */
    formatBulkResults(successful, failed, entityName) {
        if (successful.length === 0 && failed.length > 0) {
            return {
                status: "error",
                message: `Failed to process ${entityName}`,
                results: { successful, failed }
            };
        }

        return {
            status: "success",
            message: `Successfully processed ${successful.length} ${entityName}, with ${failed.length} failures`,
            results: { successful, failed }
        };
    }
}

export default DepartmentService;