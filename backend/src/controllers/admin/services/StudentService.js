import { getDB } from '../../../config/mongodb.js';
import { ObjectId } from 'mongodb';
import { ApplicationError } from '../../../errorHandle/error.js';

/**
 * Service class for student-related operations
 */
export default class StudentService {
    constructor() {
        this.studentsCollection = "Students";
        this.departmentsCollection = "Departments";
    }

    /**
     * Add students (supports both single and bulk operations)
     * @param {Object} studentData - Data for adding students
     * @returns {Object} - Result of the operation
     */
    async addStudent(studentData) {
        const db = await getDB();
        const { rollNo, name, department, batch, semester, branch, session, students } = studentData;

        // Determine if this is a bulk or single operation based on the data
        const isBulkOperation = students && Array.isArray(students) && students.length > 0;
        const isSingleOperation = rollNo && name && department && branch && session;

        if (!isBulkOperation && !isSingleOperation) {
            throw new ApplicationError("Either provide student details for a single student, or an array of students for bulk operations", 400);
        }

        // Handle single student operation
        if (isSingleOperation) {
            return await this._addSingleStudent({
                rollNo, name, department, batch, semester, branch, session
            });
        }

        // Handle bulk operation
        if (isBulkOperation) {
            return await this._addMultipleStudents(students);
        }
    }

    /**
     * Add a single student
     * @private
     */
    async _addSingleStudent(studentData) {
        const db = await getDB();
        const { rollNo, name, department, batch, semester, branch, session } = studentData;

        // Validate required fields
        if (!rollNo || !name || !department || !branch || !session) {
            throw new ApplicationError("Roll number, name, department, branch, and session are required", 400);
        }

        // Check if student with this roll number already exists
        const existingStudent = await db.collection(this.studentsCollection).findOne({ rollNo });
        if (existingStudent) {
            throw new ApplicationError(`Student with roll number ${rollNo} already exists`, 400);
        }

        // Find if the department and branch combination exists
        const departmentExists = await db.collection(this.departmentsCollection).findOne({
            department,
            "branches": { $elemMatch: { "shortForm": branch, "session": session } }
        });

        if (!departmentExists) {
            throw new ApplicationError(`Department ${department} with branch ${branch} and session ${session} does not exist`, 404);
        }

        // Create the student object
        const newStudent = {
            rollNo,
            name,
            department,
            branch,
            session,
            batch: batch || 1, // Default to 1 if not provided
            semester: semester || 1, // Default to 1 if not provided
            createdAt: new Date()
        };

        // Insert the student into the database
        const result = await db.collection(this.studentsCollection).insertOne(newStudent);

        return {
            result,
            student: {
                ...newStudent,
                _id: result.insertedId
            }
        };
    }

    /**
     * Add multiple students
     * @private
     */
    async _addMultipleStudents(students) {
        const db = await getDB();
        const results = {
            successful: [],
            failed: []
        };

        // Process each student entry
        for (const student of students) {
            try {
                const { rollNo, name, department, batch, semester, branch, session } = student;

                // Validate required fields for each student
                if (!rollNo || !name || !department || !branch || !session) {
                    results.failed.push({
                        rollNo: rollNo || 'unknown',
                        error: "Roll number, name, department, branch, and session are required"
                    });
                    continue;
                }

                // Try to add the student using the single student method
                const addResult = await this._addSingleStudent(student);

                // Add to successful results
                results.successful.push({
                    rollNo,
                    name,
                    _id: addResult.student._id
                });

            } catch (error) {
                results.failed.push({
                    rollNo: student.rollNo || 'unknown',
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * Update a student or multiple students
     * @param {Object} updateData - Data for updating students
     * @returns {Object} - Result of the operation
     */
    async updateStudent(updateData) {
        const db = await getDB();
        const { rollNo, name, batch, semester, studentUpdates } = updateData;

        // Determine if this is a bulk or single operation based on the request body
        const isBulkOperation = studentUpdates && Array.isArray(studentUpdates) && studentUpdates.length > 0;
        const isSingleOperation = rollNo && (name !== undefined || batch !== undefined || semester !== undefined);

        if (!isBulkOperation && !isSingleOperation) {
            throw new ApplicationError("Either provide student details for a single update, or an array of student updates for bulk operations", 400);
        }

        // Handle single student update
        if (isSingleOperation) {
            return await this._updateSingleStudent(rollNo, { name, batch, semester });
        }

        // Handle bulk operation
        if (isBulkOperation) {
            return await this._updateMultipleStudents(studentUpdates);
        }
    }

    /**
     * Update a single student
     * @private
     */
    async _updateSingleStudent(rollNo, updateFields) {
        const db = await getDB();

        // Validate that we have rollNo to identify the student
        if (!rollNo) {
            throw new ApplicationError("Roll number is required to identify the student", 400);
        }

        // Find if the student exists
        const existingStudent = await db.collection(this.studentsCollection).findOne({ rollNo });

        if (!existingStudent) {
            throw new ApplicationError("Student not found", 404);
        }

        // Build the update object with only the fields that are provided
        const updates = {};
        const { name, batch, semester } = updateFields;

        if (name !== undefined) updates.name = name;
        if (batch !== undefined) {
            if (typeof batch !== 'number' || batch < 1 || batch > 4) {
                throw new ApplicationError("Batch must be a number between 1 and 4", 400);
            }
            updates.batch = batch;
        }
        if (semester !== undefined) {
            if (typeof semester !== 'number' || semester < 1 || semester > 8) {
                throw new ApplicationError("Semester must be a number between 1 and 8", 400);
            }
            updates.semester = semester;
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

        // Update the student in the database
        const result = await db.collection(this.studentsCollection).updateOne(
            { _id: existingStudent._id },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            throw new ApplicationError("Failed to update student", 500);
        }

        return {
            ...result,
            updatedFields: Object.keys(updates).filter(key => key !== 'updatedAt')
        };
    }

    /**
     * Update multiple students
     * @private
     */
    async _updateMultipleStudents(studentUpdates) {
        const results = {
            successful: [],
            failed: []
        };

        // Process each student update
        for (const studentUpdate of studentUpdates) {
            try {
                const { rollNo, name, batch, semester } = studentUpdate;

                // Use the single update method to update this student
                const updateResult = await this._updateSingleStudent(
                    rollNo,
                    { name, batch, semester }
                );

                // Add to successful results
                results.successful.push({
                    rollNo,
                    updatedFields: updateResult.updatedFields
                });
            } catch (error) {
                const identifier = studentUpdate.rollNo || 'unknown';
                results.failed.push({
                    identifier,
                    error: error.message
                });
            }
        }

        return results;
    }

    /**
     * Get students by batch or session
     * @param {Object} queryParams - Query parameters for filtering students
     * @returns {Array} - Array of students
     */
    async getStudents(queryParams) {
        const db = await getDB();
        const { department, branch, session, batch, semester } = queryParams;

        // Build filter based on provided parameters
        const filter = {};
        if (department) filter.department = department;
        if (branch) filter.branch = branch;
        if (session) filter.session = session;
        if (batch) filter.batch = parseInt(batch, 10);
        if (semester) filter.semester = parseInt(semester, 10);

        return await db.collection(this.studentsCollection).find(filter).toArray();
    }

    /**
     * Get student suggestions for search bar autocomplete
     * @param {Object} queryParams - Query parameters
     * @returns {Array} - Array of matching students
     */
    async getStudentSuggestions(queryParams) {
        const db = await getDB();
        const { query, department, branch, session, batch } = queryParams;

        if (!query || typeof query !== 'string') {
            return [];
        }

        // Create a case-insensitive regex pattern for the search term
        const searchPattern = new RegExp(query, 'i');

        // Build the search filter
        let filter = {
            $or: [
                { name: searchPattern },
                { rollNo: searchPattern }
            ]
        };

        // Add optional filters if provided
        if (department) filter.department = department;
        if (branch) filter.branch = branch;
        if (session) filter.session = session;
        if (batch) filter.batch = parseInt(batch, 10);

        // Search for students that match the filter
        return await db.collection(this.studentsCollection).find(filter)
            .project({
                _id: 1,
                name: 1,
                rollNo: 1,
                department: 1,
                branch: 1,
                session: 1,
                batch: 1,
                semester: 1
            })
            .limit(10) // Limit to 10 suggestions
            .toArray();
    }

    /**
     * Get a student by roll number
     * @param {string} rollNo - Roll number
     * @returns {Object|null} - Student object or null
     */
    async getStudentByRollNo(rollNo) {
        const db = await getDB();

        if (!rollNo) {
            throw new ApplicationError("Roll number is required", 400);
        }

        const student = await db.collection(this.studentsCollection).findOne({ rollNo });

        if (!student) {
            throw new ApplicationError("Student not found", 404);
        }

        return student;
    }

    /**
     * Get student details for attendance reporting
     * @param {string} department - Department name
     * @param {string} branch - Branch short form
     * @param {string} session - Session (e.g., "2022-26")
     * @param {number} semester - Semester number
     * @returns {Array} - Array of students with attendance details
     */
    async getStudentsForAttendance(department, branch, session, semester) {
        const db = await getDB();

        // Validate required parameters
        if (!department || !branch || !session || !semester) {
            throw new ApplicationError("Department, branch, session, and semester are required", 400);
        }

        // Convert semester to number
        semester = parseInt(semester, 10);

        // Query students with the given parameters
        const students = await db.collection(this.studentsCollection).find({
            department,
            branch,
            session,
            semester
        }).toArray();

        return students;
    }

    /**
     * Promote students to the next semester
     * @param {Object} promotionData - Data for promoting students
     * @returns {Object} - Result of the operation
     */
    async promoteStudents(promotionData) {
        const db = await getDB();
        const { department, branch, session, currentSemester } = promotionData;

        // Validate required parameters
        if (!department || !branch || !session || !currentSemester) {
            throw new ApplicationError("Department, branch, session, and current semester are required", 400);
        }

        // Convert semester to number
        const semester = parseInt(currentSemester, 10);

        // Check if semester is valid (1-7, since we can't promote from 8th semester)
        if (semester < 1 || semester > 7) {
            throw new ApplicationError("Current semester must be between 1 and 7", 400);
        }

        // Calculate next semester
        const nextSemester = semester + 1;

        // Update all students matching the criteria
        const result = await db.collection(this.studentsCollection).updateMany(
            {
                department,
                branch,
                session,
                semester
            },
            {
                $set: {
                    semester: nextSemester,
                    updatedAt: new Date()
                }
            }
        );

        return {
            result,
            message: `${result.modifiedCount} students promoted from semester ${semester} to ${nextSemester}`
        };
    }
}