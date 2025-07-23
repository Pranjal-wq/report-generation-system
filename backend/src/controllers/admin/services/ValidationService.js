import { getDB } from '../../../config/mongodb.js';
import { ObjectId } from 'mongodb';
import { ApplicationError } from '../../../errorHandle/error.js';

/**
 * Service class for common validation functions used across services
 */
export class ValidationService {
    constructor() {
        this.departments = "Departments";
        this.admin = "Admin";
        this.faculty = "Users";
        this.students = "Student";
        this.subjects = "Subject";
    }

    /**
     * Validate and convert ID string to ObjectId
     * @param {string} id - ID to validate and convert
     * @param {string} [entityName='entity'] - Name of entity for error message
     * @returns {ObjectId} - MongoDB ObjectId
     * @throws {ApplicationError} - If ID format is invalid
     */
    validateObjectId(id, entityName = 'entity') {
        try {
            return new ObjectId(id);
        } catch (error) {
            throw new ApplicationError(`Invalid ${entityName} ID format`, 400);
        }
    }

    /**
     * Validate session format (YYYY-YY or YYYY-YYYY)
     * @param {string} session - Session string to validate
     * @returns {boolean} - True if valid, throws error if invalid
     * @throws {ApplicationError} - If session format is invalid
     */
    validateSessionFormat(session) {
        const sessionRegex = /^\d{4}-\d{2,4}$/;
        if (!sessionRegex.test(session)) {
            throw new ApplicationError("Session format should be YYYY-YY or YYYY-YYYY", 400);
        }
        return true;
    }

    /**
     * Validate batch format (YYYY-YY or YYYY-YYYY)
     * @param {string} batch - Batch string to validate
     * @returns {boolean} - True if valid, throws error if invalid
     * @throws {ApplicationError} - If batch format is invalid
     */
    validateBatchFormat(batch) {
        const batchRegex = /^\d{4}-\d{2,4}$/;
        if (!batchRegex.test(batch)) {
            throw new ApplicationError("Batch format should be YYYY-YY or YYYY-YYYY", 400);
        }
        return true;
    }

    /**
     * Validate course duration
     * @param {number} duration - Duration to validate
     * @returns {boolean} - True if valid, throws error if invalid
     * @throws {ApplicationError} - If duration is invalid
     */
    validateDuration(duration) {
        if (typeof duration !== 'number' || duration < 1 || duration > 5) {
            throw new ApplicationError("Duration must be a number between 1 and 5 years", 400);
        }
        return true;
    }

    /**
     * Validate course type
     * @param {string} courseType - Course type to validate
     * @returns {boolean} - True if valid, throws error if invalid
     * @throws {ApplicationError} - If course type is invalid
     */
    validateCourseType(courseType) {
        if (!['UG', 'PG', 'DD'].includes(courseType)) {
            throw new ApplicationError("Course type must be UG, PG, or DD", 400);
        }
        return true;
    }

    /**
     * Validate that a department exists by ID
     * @param {string|ObjectId} departmentId - Department ID
     * @returns {object} - Department document if exists
     * @throws {ApplicationError} - If department doesn't exist
     */
    async validateDepartmentExists(departmentId) {
        const db = await getDB();
        const deptId = departmentId instanceof ObjectId ? departmentId : this.validateObjectId(departmentId, 'department');

        const department = await db.collection(this.departments).findOne({ _id: deptId });

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        return department;
    }

    /**
     * Validate that a department exists by name
     * @param {string} departmentName - Department name
     * @returns {object} - Department document if exists
     * @throws {ApplicationError} - If department doesn't exist
     */
    async validateDepartmentExistsByName(departmentName) {
        const db = await getDB();

        const department = await db.collection(this.departments).findOne({ department: departmentName });

        if (!department) {
            throw new ApplicationError(`Department '${departmentName}' not found`, 404);
        }

        return department;
    }

    /**
     * Validate that a department exists by code (cn)
     * @param {string} departmentCode - Department code (cn)
     * @returns {object} - Department document if exists
     * @throws {ApplicationError} - If department doesn't exist
     */
    async validateDepartmentExistsByCode(departmentCode) {
        const db = await getDB();

        const department = await db.collection(this.departments).findOne({ cn: departmentCode });

        if (!department) {
            throw new ApplicationError(`Department with code '${departmentCode}' not found`, 404);
        }

        return department;
    }

    /**
     * Validate department data for creation or update
     * @param {object} departmentData - Department data
     * @param {string} [existingDepartmentId=null] - ID of existing department for updates
     * @returns {boolean} - True if valid
     * @throws {ApplicationError} - If validation fails
     */
    async validateDepartmentData(departmentData, existingDepartmentId = null) {
        const db = await getDB();
        const { department, cn } = departmentData;

        if (!department || !cn) {
            throw new ApplicationError("Department name and code (cn) are required", 400);
        }

        // Check for duplicate department name or code
        const duplicateQuery = {
            $or: [{ department }, { cn }]
        };

        if (existingDepartmentId) {
            // For updates, exclude the current department from duplicate check
            const deptId = existingDepartmentId instanceof ObjectId
                ? existingDepartmentId
                : this.validateObjectId(existingDepartmentId, 'department');

            duplicateQuery._id = { $ne: deptId };
        }

        const duplicate = await db.collection(this.departments).findOne(duplicateQuery);

        if (duplicate) {
            const field = duplicate.department === department ? 'name' : 'code';
            throw new ApplicationError(`Department with same ${field} already exists`, 400);
        }

        return true;
    }

    /**
     * Validate that a branch exists in a department
     * @param {object} department - Department document
     * @param {string} branchShortForm - Branch short form
     * @returns {object} - Branch object if exists
     * @throws {ApplicationError} - If branch doesn't exist
     */
    validateBranchExists(department, branchShortForm) {
        const branch = department.branches?.find(b => b.shortForm === branchShortForm);

        if (!branch) {
            throw new ApplicationError(`Branch ${branchShortForm} not found in this department`, 404);
        }

        return branch;
    }

    /**
     * Validate that a session exists for a branch
     * @param {object} branch - Branch object
     * @param {string} session - Session to validate
     * @returns {boolean} - True if session exists
     * @throws {ApplicationError} - If session doesn't exist
     */
    validateSessionExists(branch, session) {
        this.validateSessionFormat(session);

        if (!branch.session || !branch.session.includes(session)) {
            throw new ApplicationError(`Session ${session} is not enabled for branch ${branch.shortForm}`, 404);
        }

        return true;
    }

    /**
     * Validate that a student exists by scholar number
     * @param {string} scholarNumber - Scholar number
     * @returns {object} - Student document if exists
     * @throws {ApplicationError} - If student doesn't exist
     */
    async validateStudentExists(scholarNumber) {
        const db = await getDB();

        const student = await db.collection(this.students).findOne({ scholarNumber });

        if (!student) {
            throw new ApplicationError(`Student with scholar number ${scholarNumber} not found`, 404);
        }

        return student;
    }

    /**
     * Validate that a faculty exists by ID
     * @param {string|ObjectId} facultyId - Faculty ID
     * @returns {object} - Faculty document if exists
     * @throws {ApplicationError} - If faculty doesn't exist
     */
    async validateFacultyExists(facultyId) {
        const db = await getDB();
        const facId = facultyId instanceof ObjectId ? facultyId : this.validateObjectId(facultyId, 'faculty');

        const faculty = await db.collection(this.faculty).findOne({ _id: facId });

        if (!faculty) {
            throw new ApplicationError("Faculty not found", 404);
        }

        return faculty;
    }

    /**
     * Validate that a faculty exists by employee code
     * @param {string} employeeCode - Employee code
     * @returns {object} - Faculty document if exists
     * @throws {ApplicationError} - If faculty doesn't exist
     */
    async validateFacultyExistsByCode(employeeCode) {
        const db = await getDB();

        const faculty = await db.collection(this.faculty).findOne({ employeeCode });

        if (!faculty) {
            throw new ApplicationError(`Faculty with employee code ${employeeCode} not found`, 404);
        }

        return faculty;
    }

    /**
     * Validate that a subject exists by subject code
     * @param {string} subjectCode - Subject code
     * @returns {object} - Subject document if exists
     * @throws {ApplicationError} - If subject doesn't exist
     */
    async validateSubjectExists(subjectCode) {
        const db = await getDB();

        const subject = await db.collection(this.subjects).findOne({ subjectCode });

        if (!subject) {
            throw new ApplicationError(`Subject with code ${subjectCode} not found`, 404);
        }

        return subject;
    }

    /**
     * Check if an entity with a specific field value exists
     * @param {string} collection - Collection to check
     * @param {string} field - Field to check
     * @param {any} value - Value to check for
     * @param {object} [excludeId=null] - ID to exclude from check
     * @returns {boolean} - True if entity exists
     */
    async checkEntityExists(collection, field, value, excludeId = null) {
        const db = await getDB();

        const query = { [field]: value };

        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const exists = await db.collection(collection).findOne(query);

        return !!exists;
    }

    /**
     * Format a results object for bulk operations
     * @param {array} successful - Array of successful operations
     * @param {array} failed - Array of failed operations
     * @param {string} entityName - Name of entity for messages
     * @returns {object} - Formatted results object with status and message
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

export default ValidationService;