import { getDB } from '../../config/mongodb.js'
import { ObjectId } from 'mongodb'
import { ApplicationError } from '../../errorHandle/error.js'
import DepartmentService from './services/DepartmentService.js'
import BranchService from './services/BranchService.js'
import SessionService from './services/SessionService.js'
import SubjectService from './services/SubjectService.js'
import StudentService from './services/StudentService.js'
import FacultyService from './services/FacultyService.js'
import TimetableService from './services/TimetableService.js'

import ApprovalService from './services/ApprovalService.js'
import DashboardController from './services/DashboardController.js'
import { ConfigService } from './services/configService.js'

export class AdminController {
    constructor() {
        // Collection names
        this.departments = "Departments";
        this.admin = "Admin";
        this.faculty = "Users";
        this.attendance = "Attendance";
        this.electiveStudents = "ElectiveStudents"; this.subjects = "Subject";
        this.students = "Student";

        this.sessionRequests = "SessionApprovalRequests";
        this.branchRequests = "BranchApprovalRequests";

        // Initialize services
        this.departmentService = new DepartmentService();
        this.branchService = new BranchService();
        this.sessionService = new SessionService();   
        this.subjectService = new SubjectService();
        this.studentService = new StudentService();
        this.facultyService = new FacultyService();
        this.timetableService = new TimetableService();
       
        this.approvalService = new ApprovalService();
        this.dashboardController = new DashboardController();
        this.configService = new ConfigService();
    }


    async createFaculty(req, res) {
        const facultyData = req.body.facultyData;
        console.log(req.body);
        if (!facultyData) {
            console.log("Please Provide the Faculty Data")
            throw new ApplicationError("Please Provide Faculty Data", 400);
        }
        try {
            //Pass down the faculty Data to the create Faculty 
            const result = await this.facultyService.addFaculty(facultyData);
            return res.status(200).json({ result: result });
        } catch (error) {
            console.log("Error in creating faculty:", error);

            if (error instanceof ApplicationError) {
                return res.status(error.code).json({
                    status: "error",
                    message: error.message,
                    data: {}
                });
            }
            throw new ApplicationError("Something Went Wrong", 500);
        }
    }

    async getFaculty(req, res) {
        const filter = req.body;
        try {
            // Sanitize the Filter object 
            const result = await this.facultyService.getFaculty(filter);
            if (!result) {
                return res.status(404).json({ 
                    status: "error",
                    message: "No Faculty Data found",
                    data: {} 
                });
            }
            return res.status(200).json({ 
                status: "success",
                data: result 
            });
        } catch (error) {
            console.log("Error in getting faculty:", error);

            if (error instanceof ApplicationError) {
                return res.status(error.code).json({
                    status: "error",
                    message: error.message,
                    data: {}
                });
            }
            throw new ApplicationError("Something Went Wrong", 500);
        }
    }
    async updateFaculty(req,res){
        const facultyData = req.body;
        try {
            // Validate input
            if (!facultyData || !facultyData.id || !facultyData.toModify) {
                throw new ApplicationError("Faculty ID and modification data are required", 400);
            }
            // Call the service to update faculty
            const result = await this.facultyService.updateFaculty(facultyData);
            return res.status(200).json({
                status: "success",
                message: "Faculty updated successfully",
                data: result
            });
        } catch (error) {
            console.log("Error in updating faculty:", error);
            if (error instanceof ApplicationError) {
                return res.status(error.code).json({
                    status: "error",
                    message: error.message,
                    data: {}
                });
            }
            throw new ApplicationError("Something Went Wrong", 500);
        }
    }

    async getDepartments(req, res) {
        const db = await getDB();
        const departmentId = req.params.departmentId;

        if (departmentId) {
            let department;
            try {
                department = await db.collection(this.departments).findOne({
                    _id: new ObjectId(departmentId)
                });
            } catch (error) {
                throw new ApplicationError("Invalid department ID format", 400);
            }

            if (!department) {
                throw new ApplicationError("Department not found", 404);
            }

            if (department.branches && Array.isArray(department.branches)) {
                department.branches = department.branches.map(branch => {
                    if (!branch.session) {
                        branch.session = [];
                    }
                    return branch;
                });
            }

            return res.status(200).json({
                status: "success",
                department: department
            });
        }

        const departments = await db.collection(this.departments).find({}).toArray();

        departments.forEach(dept => {
            if (dept.branches && Array.isArray(dept.branches)) {
                dept.branches = dept.branches.map(branch => {
                    if (!branch.session) {
                        branch.session = [];
                    }
                    return branch;
                });
            }
        });

        return res.status(200).json({
            status: "success",
            departments: departments
        });
    }

    async updateDepartment(req, res) {
        const db = await getDB();
        const { departmentId, department, cn, departments } = req.body;
        const { departmentId: paramDepartmentId } = req.params;

        const isBulkOperation = departments && Array.isArray(departments) && departments.length > 0;
        const isSingleOperation = (departmentId || paramDepartmentId) && (department || cn);

        if (!isBulkOperation && !isSingleOperation) {
            throw new ApplicationError("Either provide department details for a single update, or an array of department updates for bulk operations", 400);
        }

        if (isSingleOperation) {
            const singleDeptId = departmentId || paramDepartmentId;

            if (!singleDeptId) {
                throw new ApplicationError("Department ID is required", 400);
            }

            let departmentObjectId;
            try {
                departmentObjectId = new ObjectId(singleDeptId);
            } catch (error) {
                throw new ApplicationError("Invalid department ID format", 400);
            }

            const existingDepartment = await db.collection(this.departments).findOne({
                _id: departmentObjectId
            });

            if (!existingDepartment) {
                throw new ApplicationError("Department not found", 404);
            }

            const updates = {};

            if (department !== undefined && department !== existingDepartment.department) {
                const departmentNameExists = await db.collection(this.departments).findOne({
                    department: department,
                    _id: { $ne: departmentObjectId }
                });

                if (departmentNameExists) {
                    throw new ApplicationError(`Department with name '${department}' already exists`, 400);
                }

                updates.department = department;
            }

            if (cn !== undefined && cn !== existingDepartment.cn) {
                const codeNameExists = await db.collection(this.departments).findOne({
                    cn: cn,
                    _id: { $ne: departmentObjectId }
                });

                if (codeNameExists) {
                    throw new ApplicationError(`Department with code '${cn}' already exists`, 400);
                }

                updates.cn = cn;
            }

            if (Object.keys(updates).length === 0) {
                return res.status(200).json({
                    status: "success",
                    message: "No updates were provided"
                });
            }

            updates.updatedAt = new Date();

            const result = await db.collection(this.departments).updateOne(
                { _id: departmentObjectId },
                { $set: updates }
            );

            if (result.matchedCount === 0) {
                throw new ApplicationError("Failed to update department", 500);
            }

            return res.status(200).json({
                status: "success",
                message: "Department updated successfully",
                updatedFields: Object.keys(updates).filter(key => key !== 'updatedAt')
            });
        }

        if (isBulkOperation) {
            const results = {
                successful: [],
                failed: []
            };

            for (const deptUpdate of departments) {
                try {
                    const { departmentId, department, cn } = deptUpdate;

                    if (!departmentId) {
                        results.failed.push({
                            department: department || cn || 'unknown',
                            error: "Department ID is required for updates"
                        });
                        continue;
                    }

                    let departmentObjectId;
                    try {
                        departmentObjectId = new ObjectId(departmentId);
                    } catch (error) {
                        results.failed.push({
                            department: department || cn || 'unknown',
                            error: "Invalid department ID format"
                        });
                        continue;
                    }

                    const existingDepartment = await db.collection(this.departments).findOne({
                        _id: departmentObjectId
                    });

                    if (!existingDepartment) {
                        results.failed.push({
                            departmentId,
                            error: "Department not found"
                        });
                        continue;
                    }

                    const updates = {};

                    if (department !== undefined && department !== existingDepartment.department) {
                        const departmentNameExists = await db.collection(this.departments).findOne({
                            department: department,
                            _id: { $ne: departmentObjectId }
                        });

                        if (departmentNameExists) {
                            results.failed.push({
                                departmentId,
                                error: `Department with name '${department}' already exists`
                            });
                            continue;
                        }

                        updates.department = department;
                    }

                    if (cn !== undefined && cn !== existingDepartment.cn) {
                        const codeNameExists = await db.collection(this.departments).findOne({
                            cn: cn,
                            _id: { $ne: departmentObjectId }
                        });

                        if (codeNameExists) {
                            results.failed.push({
                                departmentId,
                                error: `Department with code '${cn}' already exists`
                            });
                            continue;
                        }

                        updates.cn = cn;
                    }

                    if (Object.keys(updates).length === 0) {
                        results.failed.push({
                            departmentId,
                            error: "No valid updates were provided"
                        });
                        continue;
                    }

                    updates.updatedAt = new Date();

                    const result = await db.collection(this.departments).updateOne(
                        { _id: departmentObjectId },
                        { $set: updates }
                    );

                    if (result.matchedCount === 0) {
                        results.failed.push({
                            departmentId,
                            error: "Failed to update department"
                        });
                        continue;
                    }

                    results.successful.push({
                        departmentId,
                        updatedFields: Object.keys(updates).filter(key => key !== 'updatedAt')
                    });

                } catch (error) {
                    results.failed.push({
                        departmentId: deptUpdate.departmentId || 'unknown',
                        error: error.message
                    });
                }
            }

            if (results.successful.length === 0 && results.failed.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: "Failed to update departments",
                    results
                });
            }

            return res.status(200).json({
                status: "success",
                message: `Successfully updated ${results.successful.length} departments, with ${results.failed.length} failures`,
                results
            });
        }
    }

    async addDepartment(req, res) {
        const departmentData = req.body;
        // Map property names to match the service expectations if needed
        if (departmentData.cn && !departmentData.shortName) {
            departmentData.shortName = departmentData.cn;
        }
        const result = await this.departmentService.createDepartment(departmentData);
        return res.status(201).json({
            status: "success",
            message: "Department created successfully",
            data: result
        });
    }

    async bulkCreateDepartments(req, res) {
        const { departments } = req.body;
        const result = await this.departmentService.bulkCreateDepartments(departments);
        return res.status(201).json(result);
    }

    async addBranch(req, res) {
        const db = await getDB();
        const { departmentId, branches } = req.body;

        if (!departmentId || !branches || !Array.isArray(branches) || branches.length === 0) {
            throw new ApplicationError("Department ID and branches array are required", 400);
        }

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        const department = await db.collection(this.departments).findOne({ _id: departmentObjectId });

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        for (const branch of branches) {
            if (!branch.program || !branch.course || !branch.shortForm || !branch.duration) {
                throw new ApplicationError("Each branch must have program name, course, shortForm, and duration", 400);
            }

            if (typeof branch.duration !== 'number' || branch.duration < 1 || branch.duration > 5) {
                throw new ApplicationError("Duration must be a number between 1 and 5 years", 400);
            }

            const branchExists = department.branches?.some(b =>
                b.program === branch.program || b.shortForm === branch.shortForm
            );

            if (branchExists) {
                throw new ApplicationError(`Branch ${branch.program} or shortform ${branch.shortForm} already exists`, 400);
            }

            if (!branch.session) {
                branch.session = [];
            }
        }

        const coursesToAdd = [];
        branches.forEach(branch => {
            const courseName = branch.course;
            let courseType;

            if (courseName.includes('B.Tech-M.Tech') || courseName.includes('B.Tech.-M.Tech.')) {
                courseType = 'DD';
            } else if (courseName.startsWith('B.') || courseName === 'BTech' || courseName === 'B.Tech') {
                courseType = 'UG';
            } else {
                courseType = 'PG';
            }

            const courseExists = coursesToAdd.some(c => c.name === courseName);
            if (!courseExists) {
                coursesToAdd.push({
                    name: courseName,
                    type: courseType,
                    duration: branch.duration
                });
            }
        });

        const branchResult = await db.collection(this.departments).updateOne(
            { _id: departmentObjectId },
            {
                $push: { branches: { $each: branches } }
            }
        );

        const courseResult = await db.collection(this.departments).updateOne(
            { _id: departmentObjectId },
            {
                $addToSet: { courses: { $each: coursesToAdd } }
            }
        );

        if (branchResult.modifiedCount === 0 && courseResult.modifiedCount === 0) {
            throw new ApplicationError("Failed to add branches and courses", 500);
        }

        return res.status(200).json({
            status: "success",
            message: "Branches and courses added successfully"
        });
    }

    async addSession(req, res) {
        const db = await getDB();
        const { departmentId, branchShortForm, session, branchSessions } = req.body;

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

        const department = await db.collection(this.departments).findOne({ _id: departmentObjectId });
        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        if (isSingleOperation) {
            const sessionRegex = /^\d{4}-\d{2,4}$/;
            if (!sessionRegex.test(session)) {
                throw new ApplicationError("Session format should be YYYY-YY or YYYY-YYYY", 400);
            }

            const branchIndex = department.branches?.findIndex(b => b.shortForm === branchShortForm);
            if (branchIndex === -1 || branchIndex === undefined) {
                throw new ApplicationError("Branch not found in this department", 404);
            }

            if (department.branches[branchIndex].session.includes(session)) {
                throw new ApplicationError("Session already exists for this branch", 400);
            }

            const updatePath = `branches.${branchIndex}.session`;
            const result = await db.collection(this.departments).updateOne(
                { _id: departmentObjectId },
                { $addToSet: { [updatePath]: session } }
            );

            if (result.modifiedCount === 0) {
                throw new ApplicationError("Failed to add session", 500);
            }

            return res.status(200).json({
                status: "success",
                message: "Session added successfully"
            });
        }

        if (isBulkOperation) {
            const results = {
                successful: [],
                failed: []
            };

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

                    for (const session of sessions) {
                        const sessionRegex = /^\d{4}-\d{2,4}$/;
                        if (!sessionRegex.test(session)) {
                            branchFailed.push({
                                session,
                                error: "Session format should be YYYY-YY or YYYY-YYYY"
                            });
                            continue;
                        }

                        if (department.branches[branchIndex].session.includes(session)) {
                            branchFailed.push({
                                session,
                                error: "Session already exists for this branch"
                            });
                            continue;
                        }

                        const updatePath = `branches.${branchIndex}.session`;
                        const result = await db.collection(this.departments).updateOne(
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
                    }

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

            if (results.successful.length === 0 && results.failed.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: "Failed to add sessions",
                    results
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Sessions processed successfully",
                results
            });
        }
    }

    async addSingleSession(req, res) {
        const db = await getDB();
        const { departmentId, branchShortForm, session } = req.body;

        if (!departmentId || !branchShortForm || !session) {
            throw new ApplicationError("Department ID, branch short form, and session are required", 400);
        }

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        const sessionRegex = /^\d{4}-\d{2,4}$/;
        if (!sessionRegex.test(session)) {
            throw new ApplicationError("Session format should be YYYY-YY or YYYY-YYYY", 400);
        }

        const department = await db.collection(this.departments).findOne({ _id: departmentObjectId });

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        const branchIndex = department.branches?.findIndex(b => b.shortForm === branchShortForm);
        if (branchIndex === -1 || branchIndex === undefined) {
            throw new ApplicationError("Branch not found in this department", 404);
        }

        if (department.branches[branchIndex].session.includes(session)) {
            throw new ApplicationError("Session already exists for this branch", 400);
        }

        const updatePath = `branches.${branchIndex}.session`;
        const result = await db.collection(this.departments).updateOne(
            { _id: departmentObjectId },
            { $addToSet: { [updatePath]: session } }
        );

        if (result.modifiedCount === 0) {
            throw new ApplicationError("Failed to add session", 500);
        }

        return res.status(200).json({
            status: "success",
            message: "Session added successfully"
        });
    }

    async addCourseType(req, res) {
        const db = await getDB();
        const { departmentId, courseName, courseType, duration } = req.body;

        if (!departmentId || !courseName || !courseType || !duration) {
            throw new ApplicationError("Department ID, course name, course type, and duration are required", 400);
        }

        // if (!['UG', 'PG', 'DD'].includes(courseType)) {
        //     throw new ApplicationError("Course type must be UG, PG, or DD", 400);
        // }

        if (typeof duration !== 'number' || duration < 1 || duration > 5) {
            throw new ApplicationError("Duration must be a number between 1 and 5 years", 400);
        }

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        const department = await db.collection(this.departments).findOne({ _id: departmentObjectId });

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        const courseExists = department.courses?.some(course => course.name === courseName);
        if (courseExists) {
            throw new ApplicationError(`Course ${courseName} already exists in this department`, 400);
        }

        const newCourse = {
            name: courseName,
            type: courseType,
            duration: duration
        };

        const result = await db.collection(this.departments).updateOne(
            { _id: departmentObjectId },
            { $push: { courses: newCourse } }
        );

        if (result.modifiedCount === 0) {
            throw new ApplicationError("Failed to add course", 500);
        }

        return res.status(201).json({
            status: "success",
            message: "Course type added successfully",
            course: newCourse
        });
    }     /**
     * Enable/Update active semester
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response with update result
     */
    async enableSemester(req, res) {
        const { semesterType, startDate, endDate } = req.body;

        if (!semesterType) {
            throw new ApplicationError("Semester type is required", 400);
        }

        const semesterData = {};
        if (startDate) semesterData.startDate = startDate;
        if (endDate) semesterData.endDate = endDate;

        const result = await this.configService.updateActiveSemester(semesterType, semesterData);
        return res.status(200).json(result);
    }

    /**
     * Get active semester configuration
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response with active semester data
     */
    async getActiveSemester(req, res) {
        const result = await this.configService.getActiveSemester();
        return res.status(200).json(result);
    }

    /**
     * Get complete semester configuration
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response with complete semester config
     */
    async getSemesterConfig(req, res) {
        const result = await this.configService.getSemesterConfig();
        return res.status(200).json(result);
    }

    /**
     * Update academic year
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response with update result
     */
    async updateAcademicYear(req, res) {
        const { academicYear } = req.body;

        if (!academicYear) {
            throw new ApplicationError("Academic year is required", 400);
        }

        const result = await this.configService.updateAcademicYear(academicYear);
        return res.status(200).json(result);
    }

    /**
     * Update semester dates
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response with update result
     */
    async updateSemesterDates(req, res) {
        const { semesterType, startDate, endDate } = req.body;

        if (!semesterType) {
            throw new ApplicationError("Semester type is required", 400);
        }

        if (!startDate && !endDate) {
            throw new ApplicationError("At least one date (startDate or endDate) is required", 400);
        }

        const dateData = {};
        if (startDate) dateData.startDate = startDate;
        if (endDate) dateData.endDate = endDate;

        const result = await this.configService.updateSemesterDates(semesterType, dateData);
        return res.status(200).json(result);
    }

    /**
     * Update institute name
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response with update result
     */
    async updateInstitute(req, res) {
        const { instituteName } = req.body;

        if (!instituteName) {
            throw new ApplicationError("Institute name is required", 400);
        }

        const result = await this.configService.updateInstitute(instituteName);
        return res.status(200).json(result);
    }

    async getDepartmentWiseSubjects(req, res) {
        const result = await this.timetableService.getDepartmentWiseSubjects();
        res.status(200).json({
            status: "success",
            data: result
        });
    }

    async addSubject(req, res) {
        const subjectData = req.body; // Expects an array of subjects or a single subject object
        try {
            if (!subjectData) {
                throw new ApplicationError("Subject data is required", 400);
            }
            // The service expects an array, so if it's a single object, wrap it.
            const dataToProcess = Array.isArray(subjectData) ? subjectData : [subjectData];
            const result = await this.subjectService.addSubject(dataToProcess);
            
            if (result.errors && result.errors.length > 0 && result.success && result.success.length === 0) {
                return res.status(400).json({
                    status: "error",
                    message: "Failed to add subject(s)",
                    details: result.errors
                });
            }
            if (result.errors && result.errors.length > 0) {
                return res.status(207).json({ // Multi-Status for partial success
                    status: "partial success",
                    message: "Some subjects were added, while others had errors.",
                    data: result
                });
            }
            return res.status(201).json({
                status: "success",
                message: "Subject(s) added successfully",
                data: result.success
            });
        } catch (error) {
            if (error instanceof ApplicationError) {
                return res.status(error.code).json({
                    status: "error",
                    message: error.message
                });
            }
            console.error("Error in AdminController addSubject:", error);
            return res.status(500).json({
                status: "error",
                message: "Something went wrong while adding subject(s)."
            });
        }
    }

    async getSubjects(req, res) {
        const filter = req.query; // department, subjectCode, subjectName, isElective
        try {
            const subjects = await this.subjectService.getSubject(filter);
            if (!subjects || subjects.length === 0) {
                return res.status(404).json({
                    status: "success",
                    message: "No subjects found matching the criteria",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                data: subjects
            });
        } catch (error) {
            if (error instanceof ApplicationError) {
                return res.status(error.code).json({
                    status: "error",
                    message: error.message
                });
            }
            console.error("Error in AdminController getSubjects:", error);
            return res.status(500).json({
                status: "error",
                message: "Something went wrong while fetching subjects."
            });
        }
    }
    
    async updateSubject(req, res) {
        const subjectUpdateData = req.body; // Expects { id, toModify }
        try {
            if (!subjectUpdateData || !subjectUpdateData.id || !subjectUpdateData.toModify) {
                throw new ApplicationError("Subject ID and modification data are required", 400);
            }
            const result = await this.subjectService.updateSubject(subjectUpdateData);
            if (result.modified) {
                return res.status(200).json({
                    status: "success",
                    message: "Subject updated successfully",
                    data: result
                });
            } else {
                // This might happen if the data sent was the same as existing data,
                // or if the subject wasn't found (though service should throw 404 for that).
                return res.status(200).json({ 
                    status: "success",
                    message: "Subject found, but no changes were made or required.",
                    data: result
                });
            }
        } catch (error) {
            if (error instanceof ApplicationError) {
                return res.status(error.code).json({
                    status: "error",
                    message: error.message
                });
            }
            console.error("Error in AdminController updateSubject:", error);
            return res.status(500).json({
                status: "error",
                message: "Something went wrong while updating the subject."
            });
        }
    }

    // async getSubjectSuggestions(req, res) {
    //     const { query, department, isElective } = req.query;

    //     if (!query || typeof query !== 'string') {
    //         return res.status(200).json({
    //             status: "success",
    //             suggestions: []
    //         });
    //     }

    //     try {
    //         const filter = { subjectName: query }; // Service handles regex for subjectName
    //         if (department) filter.department = department;
    //         if (isElective !== undefined) filter.isElective = isElective;
            
    //         // Using existing getSubject, which might return more fields than needed for suggestions.
    //         // For true suggestions, you might want to project specific fields and limit results in the service.
    //         const subjects = await this.subjectService.getSubject(filter);
            
    //         // Limit results if not already limited by service (SubjectService.getSubject doesn't limit by default)
    //         const suggestions = subjects.slice(0, 10).map(sub => ({
    //             _id: sub._id,
    //             subjectCode: sub.subjectCode,
    //             subjectName: sub.subjectName,
    //             department: sub.department,
    //             isElective: sub.isElective
    //         }));

    //         return res.status(200).json({
    //             status: "success",
    //             suggestions
    //         });
    //     } catch (error) {
    //         if (error instanceof ApplicationError) {
    //             return res.status(error.code).json({
    //                 status: "error",
    //                 message: error.message
    //             });
    //         }
    //         console.error("Error in AdminController getSubjectSuggestions:", error);
    //         return res.status(500).json({
    //             status: "error",
    //             message: "Something went wrong while fetching subject suggestions."
    //         });
    //     }
    // }

    // async addStudent(req, res) {
    //     const db = await getDB();
    //     const { scholarNumber, StudentName, branch, section, batch, department, students } = req.body;

    //     const isBulkOperation = students && Array.isArray(students) && students.length > 0;
    //     const isSingleOperation = scholarNumber && StudentName && branch && section && batch;

    //     if (!isBulkOperation && !isSingleOperation) {
    //         throw new ApplicationError("Either provide student details for a single student, or an array of students for bulk operations", 400);
    //     }

    //     if (isSingleOperation) {
    //         const existingStudent = await db.collection(this.students).findOne({ scholarNumber });
    //         if (existingStudent) {
    //             throw new ApplicationError(`Student with scholar number ${scholarNumber} already exists`, 400);
    //         }

    //         const batchRegex = /^\d{4}-\d{2,4}$/;
    //         if (!batchRegex.test(batch)) {
    //             throw new ApplicationError("Batch format should be YYYY-YY or YYYY-YYYY", 400);
    //         }

    //         const branchExists = await db.collection(this.departments).findOne({
    //             "branches.shortForm": branch
    //         });

    //         if (!branchExists) {
    //             throw new ApplicationError(`Branch ${branch} does not exist`, 404);
    //         }

    //         const branchWithSession = await db.collection(this.departments).findOne({
    //             "branches": {
    //                 $elemMatch: {
    //                     "shortForm": branch,
    //                     "session": batch
    //                 }
    //             }
    //         });

    //         if (!branchWithSession) {
    //             throw new ApplicationError(`Batch ${batch} is not enabled for branch ${branch}`, 404);
    //         }

    //         const newStudent = {
    //             scholarNumber,
    //             StudentName,
    //             branch,
    //             section,
    //             batch,
    //             department: department || "",
    //             createdAt: new Date()
    //         };

    //         const result = await db.collection(this.students).insertOne(newStudent);

    //         return res.status(201).json({
    //             status: "success",
    //             message: "Student added successfully",
    //             student: {
    //                 ...newStudent,
    //                 _id: result.insertedId
    //             }
    //         });
    //     }

    //     if (isBulkOperation) {
    //         const results = {
    //             successful: [],
    //             failed: []
    //         };

    //         for (const student of students) {
    //             try {
    //                 const { scholarNumber, StudentName, branch, section, batch, department } = student;

    //                 if (!scholarNumber || !StudentName || !branch || !section || !batch) {
    //                     results.failed.push({
    //                         scholarNumber: scholarNumber || 'unknown',
    //                         error: "Scholar number, student name, branch, section, and batch are required"
    //                     });
    //                     continue;
    //                 }

    //                 const existingStudent = await db.collection(this.students).findOne({ scholarNumber });
    //                 if (existingStudent) {
    //                     results.failed.push({
    //                         scholarNumber,
    //                         error: `Student with scholar number ${scholarNumber} already exists`
    //                     });
    //                     continue;
    //                 }

    //                 const batchRegex = /^\d{4}-\d{2,4}$/;
    //                 if (!batchRegex.test(batch)) {
    //                     results.failed.push({
    //                         scholarNumber,
    //                         error: "Batch format should be YYYY-YY or YYYY-YYYY"
    //                     });
    //                     continue;
    //                 }

    //                 const branchExists = await db.collection(this.departments).findOne({
    //                     "branches.shortForm": branch
    //                 });

    //                 if (!branchExists) {
    //                     results.failed.push({
    //                         scholarNumber,
    //                         error: `Branch ${branch} does not exist`
    //                     });
    //                     continue;
    //                 }

    //                 const branchWithSession = await db.collection(this.departments).findOne({
    //                     "branches": {
    //                         $elemMatch: {
    //                             "shortForm": branch,
    //                             "session": batch
    //                         }
    //                     }
    //                 });

    //                 if (!branchWithSession) {
    //                     results.failed.push({
    //                         scholarNumber,
    //                         error: `Batch ${batch} is not enabled for branch ${branch}`

    //                     });
    //                     continue;
    //                 }

    //                 const newStudent = {
    //                     scholarNumber,
    //                     StudentName,
    //                     branch,
    //                     section,
    //                     batch,
    //                     department: department || "",
    //                     createdAt: new Date()
    //                 };

    //                 const result = await db.collection(this.students).insertOne(newStudent);

    //                 results.successful.push({
    //                     scholarNumber,
    //                     StudentName,
    //                     _id: result.insertedId
    //                 });

    //             } catch (error) {
    //                 results.failed.push({
    //                     scholarNumber: student.scholarNumber || 'unknown',
    //                     error: error.message
    //                 });
    //             }
    //         }

    //         if (results.successful.length === 0 && results.failed.length > 0) {
    //             return res.status(400).json({
    //                 status: "error",
    //                 message: "Failed to add students",
    //                 results
    //             });
    //         }

    //         return res.status(201).json({
    //             status: "success",
    //             message: `Successfully added ${results.successful.length} students, with ${results.failed.length} failures`,
    //             results
    //         });
    //     }
    // }

    // async bulkAddStudents(req, res) {
    //     const db = await getDB();
    //     const { students } = req.body;

    //     if (!students || !Array.isArray(students) || students.length === 0) {
    //         throw new ApplicationError("Students array is required", 400);
    //     }

    //     const results = {
    //         successful: [],
    //         failed: []
    //     };

    //     for (const student of students) {
    //         try {
    //             const { scholarNumber, StudentName, branch, section, batch, department } = student;

    //             if (!scholarNumber || !StudentName || !branch || !section || !batch) {
    //                 results.failed.push({
    //                     scholarNumber: scholarNumber || 'unknown',
    //                     error: "Scholar number, student name, branch, section, and batch are required"
    //                 });
    //                 continue;
    //             }

    //             const existingStudent = await db.collection(this.students).findOne({ scholarNumber });
    //             if (existingStudent) {
    //                 results.failed.push({
    //                     scholarNumber,
    //                     error: `Student with scholar number ${scholarNumber} already exists`
    //                 });
    //                 continue;
    //             }

    //             const batchRegex = /^\d{4}-\d{2,4}$/;
    //             if (!batchRegex.test(batch)) {
    //                 results.failed.push({
    //                     scholarNumber,
    //                     error: "Batch format should be YYYY-YY or YYYY-YYYY"
    //                 });
    //                 continue;
    //             }

    //             const branchExists = await db.collection(this.departments).findOne({
    //                 "branches.shortForm": branch
    //             });

    //             if (!branchExists) {
    //                 results.failed.push({
    //                     scholarNumber,
    //                     error: `Branch ${branch} does not exist`
    //                 });
    //                 continue;
    //             }

    //             const branchWithSession = await db.collection(this.departments).findOne({
    //                 "branches": {
    //                     $elemMatch: {
    //                         "shortForm": branch,
    //                         "session": batch
    //                     }
    //                 }
    //             });

    //             if (!branchWithSession) {
    //                 results.failed.push({
    //                     scholarNumber,
    //                     error: `Batch ${batch} is not enabled for branch ${branch}`
    //                 });
    //                 continue;
    //             }

    //             const newStudent = {
    //                 scholarNumber,
    //                 StudentName,
    //                 branch,
    //                 section,
    //                 batch,
    //                 department: department || "",
    //                 createdAt: new Date()
    //             };

    //             const result = await db.collection(this.students).insertOne(newStudent);

    //             results.successful.push({
    //                 scholarNumber,
    //                 StudentName,
    //                 _id: result.insertedId
    //             });

    //         } catch (error) {
    //             results.failed.push({
    //                 scholarNumber: student.scholarNumber || 'unknown',
    //                 error: error.message
    //             });
    //         }
    //     }

    //     if (results.successful.length === 0 && results.failed.length > 0) {
    //         return res.status(400).json({
    //             status: "error",
    //             message: "Failed to add students",
    //             results
    //         });
    //     }

    //     return res.status(201).json({
    //         status: "success",
    //         message: `Successfully added ${results.successful.length} students, with ${results.failed.length} failures`,
    //         results
    //     });
    // }

    // async updateStudent(req, res) {
    //     const db = await getDB();
    //     const {
    //         scholarNumber,
    //         StudentName,
    //         branch,
    //         section,
    //         batch,
    //         department,
    //         studentUpdates
    //     } = req.body;

    //     const isBulkOperation = studentUpdates && Array.isArray(studentUpdates) && studentUpdates.length > 0;
    //     const isSingleOperation = scholarNumber && (StudentName || branch || section || batch || department);

    //     if (!isBulkOperation && !isSingleOperation) {
    //         throw new ApplicationError("Either provide student details for a single update, or an array of student updates for bulk operations", 400);
    //     }

    //     if (isSingleOperation) {
    //         if (!scholarNumber) {
    //             throw new ApplicationError("Scholar number is required to identify the student", 400);
    //         }

    //         const existingStudent = await db.collection(this.students).findOne({ scholarNumber });

    //         if (!existingStudent) {
    //             throw new ApplicationError("Student not found", 404);
    //         }

    //         const updates = {};

    //         if (StudentName !== undefined) updates.StudentName = StudentName;

    //         if (section !== undefined) updates.section = section;

    //         if (branch !== undefined && branch !== existingStudent.branch) {
    //             const branchExists = await db.collection(this.departments).findOne({
    //                 "branches.shortForm": branch
    //             });

    //             if (!branchExists) {
    //                 throw new ApplicationError(`Branch ${branch} does not exist`, 404);
    //             }
    //             updates.branch = branch;
    //         }

    //         if (batch !== undefined && batch !== existingStudent.batch) {
    //             const batchRegex = /^\d{4}-\d{2,4}$/;
    //             if (!batchRegex.test(batch)) {
    //                 throw new ApplicationError("Batch format should be YYYY-YY or YYYY-YYYY", 400);
    //             }

    //             const branchToCheck = branch || existingStudent.branch;

    //             const branchWithSession = await db.collection(this.departments).findOne({
    //                 "branches": {
    //                     $elemMatch: {
    //                         "shortForm": branchToCheck,
    //                         "session": batch
    //                     }
    //                 }
    //             });

    //             if (!branchWithSession) {
    //                 throw new ApplicationError(`Batch ${batch} is not enabled for branch ${branchToCheck}`, 404);
    //             }

    //             updates.batch = batch;
    //         }

    //         if (department !== undefined) updates.department = department;

    //         if (Object.keys(updates).length === 0) {
    //             return res.status(200).json({
    //                 status: "success",
    //                 message: "No updates were provided"
    //             });
    //         }

    //         updates.updatedAt = new Date();

    //         const result = await db.collection(this.students).updateOne(
    //             { _id: existingStudent._id },
    //             { $set: updates }
    //         );

    //         if (result.matchedCount === 0) {
    //             throw new ApplicationError("Failed to update student", 500);
    //         }

    //         return res.status(200).json({
    //             status: "success",
    //             message: "Student updated successfully",
    //             updatedFields: Object.keys(updates).filter(key => key !== 'updatedAt')
    //         });
    //     }

    //     if (isBulkOperation) {
    //         const results = {
    //             successful: [],
    //             failed: []
    //         };

    //         for (const studentUpdate of studentUpdates) {
    //             try {
    //                 const { scholarNumber, StudentName, branch, section, batch, department } = studentUpdate;

    //                 if (!scholarNumber) {
    //                     results.failed.push({
    //                         identifier: 'unknown',
    //                         error: "Scholar number is required to identify the student"
    //                     });
    //                     continue;
    //                 }

    //                 const existingStudent = await db.collection(this.students).findOne({ scholarNumber });

    //                 if (!existingStudent) {
    //                     results.failed.push({
    //                         scholarNumber,
    //                         error: "Student not found"
    //                     });
    //                     continue;
    //                 }

    //                 const updates = {};

    //                 if (StudentName !== undefined) updates.StudentName = StudentName;

    //                 if (section !== undefined) updates.section = section;

    //                 if (branch !== undefined && branch !== existingStudent.branch) {
    //                     const branchExists = await db.collection(this.departments).findOne({
    //                         "branches.shortForm": branch
    //                     });

    //                     if (!branchExists) {
    //                         results.failed.push({
    //                             scholarNumber,
    //                             error: `Branch ${branch} does not exist`
    //                         });
    //                         continue;
    //                     }
    //                     updates.branch = branch;
    //                 }

    //                 if (batch !== undefined && batch !== existingStudent.batch) {
    //                     const batchRegex = /^\d{4}-\d{2,4}$/;
    //                     if (!batchRegex.test(batch)) {
    //                         results.failed.push({
    //                             scholarNumber,
    //                             error: "Batch format should be YYYY-YY or YYYY-YYYY"
    //                         });
    //                         continue;
    //                     }

    //                     const branchToCheck = branch || existingStudent.branch;

    //                     const branchWithSession = await db.collection(this.departments).findOne({
    //                         "branches": {
    //                             $elemMatch: {
    //                                 "shortForm": branchToCheck,
    //                                 "session": batch
    //                             }
    //                         }
    //                     });

    //                     if (!branchWithSession) {
    //                         results.failed.push({
    //                             scholarNumber,
    //                             error: `Batch ${batch} is not enabled for branch ${branchToCheck}`
    //                         });
    //                         continue;
    //                     }

    //                     updates.batch = batch;
    //                 }

    //                 if (department !== undefined) updates.department = department;

    //                 if (Object.keys(updates).length === 0) {
    //                     results.failed.push({
    //                         scholarNumber,
    //                         error: "No updates were provided"
    //                     });
    //                     continue;
    //                 }

    //                 updates.updatedAt = new Date();

    //                 const result = await db.collection(this.students).updateOne(
    //                     { _id: existingStudent._id },
    //                     { $set: updates }
    //                 );

    //                 if (result.matchedCount === 0) {
    //                     results.failed.push({
    //                         scholarNumber,
    //                         error: "Failed to update student"
    //                     });
    //                     continue;
    //                 }

    //                 results.successful.push({
    //                     scholarNumber,
    //                     updatedFields: Object.keys(updates).filter(key => key !== 'updatedAt')
    //                 });

    //             } catch (error) {
    //                 const identifier = studentUpdate.scholarNumber || 'unknown';
    //                 results.failed.push({
    //                     identifier,
    //                     error: error.message
    //                 });
    //             }
    //         }

    //         if (results.successful.length === 0 && results.failed.length > 0) {
    //             return res.status(400).json({
    //                 status: "error",
    //                 message: "Failed to update students",
    //                 results
    //             });
    //         }

    //         return res.status(200).json({
    //             status: "success",
    //             message: `Successfully updated ${results.successful.length} students, with ${results.failed.length} failures`,
    //             results
    //         });
    //     }
    // }

    async getDepartmentSuggestions(req, res) {
        const db = await getDB();
        const { query } = req.query;

        if (!query || typeof query !== 'string') {
            return res.status(200).json({
                status: "success",
                suggestions: []
            });
        }

        const searchPattern = new RegExp(query, 'i');

        const suggestions = await db.collection(this.departments).find({
            $or: [
                { department: searchPattern },
                { cn: searchPattern }
            ]
        })
            .project({
                _id: 1,
                department: 1,
                cn: 1
            })
            .limit(10)
            .toArray();

        return res.status(200).json({
            status: "success",
            suggestions
        });
    }

    // async getFacultySuggestions(req, res) {
    //     // FacultyService dismantled: method removed
    // }

    async getStudentSuggestions(req, res) {
        const db = await getDB();
        const { query, branch, batch, section } = req.query;

        if (!query || typeof query !== 'string') {
            return res.status(200).json({
                status: "success",
                suggestions: []
            });
        }

        const searchPattern = new RegExp(query, 'i');

        let filter = {
            $or: [
                { StudentName: searchPattern },
                { scholarNumber: searchPattern }
            ]
        };

        if (branch) filter.branch = branch;
        if (batch) filter.batch = batch;
        if (section) filter.section = section;

        const suggestions = await db.collection(this.students).find(filter)
            .project({
                _id: 1,
                StudentName: 1,
                scholarNumber: 1,
                branch: 1,
                section: 1,
                batch: 1,
                department: 1
            })
            .limit(10)
            .toArray();

        return res.status(200).json({
            status: "success",
            suggestions
        });
    }

    // async updateSubject(req, res) {
    //     // SubjectService dismantled: method removed
    // }

    // async getSubjectSuggestions(req, res) {
    //     // SubjectService dismantled: method removed
    // }

    async getSessionApprovalRequests(req, res) {
        const { status } = req.query;
        const result = await this.approvalService.getSessionApprovalRequests(status);
        return res.status(200).json(result);
    }

    async processSessionRequest(req, res) {
        const { requestId, action, reason } = req.body;
        const processedBy = req.user?.employeeCode || 'admin';

        const result = await this.approvalService.processSessionRequest({
            requestId,
            action,
            reason,
            processedBy
        });

        return res.status(200).json(result);
    }

    async getBranchApprovalRequests(req, res) {
        const { status } = req.query;
        const result = await this.approvalService.getBranchApprovalRequests(status);
        return res.status(200).json(result);
    }

    async processBranchRequest(req, res) {
        const { requestId, action, reason } = req.body;
        const processedBy = req.user?.employeeCode || 'admin';

        const result = await this.approvalService.processBranchRequest({
            requestId,
            action,
            reason,
            processedBy
        });

        return res.status(200).json(result);
    }

    /**
     * Delete a department by ID
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response indicating success or failure
     */
    async deleteDepartment(req, res) {
        const { departmentId } = req.params;

        if (!departmentId) {
            throw new ApplicationError("Department ID is required", 400);
        }

        try {
            const result = await this.departmentService.deleteDepartment(departmentId);
            return res.status(200).json({
                status: "success",
                message: "Department deleted successfully",
                data: result
            });
        } catch (error) {
            throw new ApplicationError(error.message || "Failed to delete department", error.statusCode || 500);
        }
    }

    /**
     * Delete a branch from a department
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response indicating success or failure
     */
    async deleteBranch(req, res) {
        const { departmentId, branchShortForm } = req.params;

        if (!departmentId || !branchShortForm) {
            throw new ApplicationError("Department ID and branch short form are required", 400);
        }

        try {
            const result = await this.departmentService.deleteBranch(departmentId, branchShortForm);
            return res.status(200).json({
                status: "success",
                message: `Branch ${branchShortForm} deleted successfully`,
                data: result
            });
        } catch (error) {
            throw new ApplicationError(error.message || "Failed to delete branch", error.statusCode || 500);
        }
    }

    /**
     * Delete a session from a branch
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response indicating success or failure
     */
    async deleteSession(req, res) {
        const { departmentId, branchShortForm, session } = req.params;

        if (!departmentId || !branchShortForm || !session) {
            throw new ApplicationError("Department ID, branch short form, and session are required", 400);
        }

        try {
            const result = await this.departmentService.deleteSession(departmentId, branchShortForm, session);
            return res.status(200).json({
                status: "success",
                message: `Session ${session} deleted successfully from branch ${branchShortForm}`,
                data: result
            });
        } catch (error) {
            throw new ApplicationError(error.message || "Failed to delete session", error.statusCode || 500);
        }
    }

    /**
     * Delete a course from a department
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response indicating success or failure
     */
    async deleteCourse(req, res) {
        const { departmentId, courseName } = req.params;

        if (!departmentId || !courseName) {
            throw new ApplicationError("Department ID and course name are required", 400);
        }

        try {
            const result = await this.departmentService.deleteCourse(departmentId, courseName);
            return res.status(200).json({
                status: "success",
                message: `Course ${courseName} deleted successfully`,
                data: result
            });
        } catch (error) {
            throw new ApplicationError(error.message || "Failed to delete course", error.statusCode || 500);
        }
    }    // Get dashboard statistics for the main admin (super_admin)
    async getDashboardStats(req, res) {
        try {
            await this.dashboardController.getDashboardStats(req, res);
        } catch (error) {
            throw new ApplicationError(error.message || "Failed to fetch dashboard statistics", error.statusCode || 500);
        }
    }    /**
     * Get timetable for a faculty member
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response with timetable data
     */
    async getTimetable(req, res) {
        const { ownerId } = req.body;
        
        if (!ownerId) {
            throw new ApplicationError("Faculty ID (ownerId) is required", 400);
        }

        const result = await this.timetableService.getTimetable({ ownerId });
        if(!result.timetable)
        {
            console.log("No time Table Found Brooo !! ")
        }
        return res.status(200).json({
            status: "success",
            message: "Timetable retrieved successfully",
            data: result
        });
    }

    /**
     * Update timetable for a faculty member
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} - JSON response with update result
     */
    async updateTimetable(req, res) {
        try {
            const { ownerId, timetable } = req.body;
            
            if (!ownerId) {
                throw new ApplicationError("Faculty ID (ownerId) is required", 400);
            }

            if (!timetable) {
                throw new ApplicationError("Timetable data is required", 400);
            }

            const result = await this.timetableService.UpdateTimeTable({ ownerId, timetable });
            
            return res.status(200).json({
                status: "success",
                message: "Timetable updated successfully",
                data: result
            });
        } catch (error) {
            if (error instanceof ApplicationError) {
                return res.status(error.code).json({
                    status: "error",
                    message: error.message
                });
            }
            console.error("Error in AdminController updateTimetable:", error);
            return res.status(500).json({
                status: "error",
                message: "Something went wrong while updating timetable."
            });
        }
    }

    /**
     * Delete a subject from a faculty's timetable for a given day
     */
    async deleteSubject(req, res) {
        const { ownerId, day, subjectId } = req.body;
        try {
            const result = await this.timetableService.deleteSubject({ ownerId, day, subjectId });
            return res.status(200).json({ status: 'success', data: result });
        } catch (error) {
            if (error instanceof ApplicationError) {
                return res.status(error.code).json({ status: 'error', message: error.message });
            }
            console.error('Error in AdminController.deleteSubject:', error);
            return res.status(500).json({ status: 'error', message: 'Failed to delete subject from timetable' });
        }
    }
}