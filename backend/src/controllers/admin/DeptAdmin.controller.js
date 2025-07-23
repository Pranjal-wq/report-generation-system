import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import { ApplicationError } from "../../errorHandle/error.js";

export class DeptAdminController {
    constructor() {
        this.Faculty = "Users",
            this.Subjects = "Subject",
            this.departments = "Departments"
    }

    // 1. Add Session (submit for approval to admin)
    async submitSession(req, res) {
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

        // Find the branch index
        const branchIndex = department.branches?.findIndex(b => b.shortForm === branchShortForm);
        if (branchIndex === -1 || branchIndex === undefined) {
            throw new ApplicationError("Branch not found in this department", 404);
        }

        // Check if session already exists
        if (department.branches[branchIndex].session.includes(session)) {
            throw new ApplicationError("Session already exists for this branch", 400);
        }

        // Create a new collection for session approval requests if it doesn't exist
        const sessionsApproval = db.collection("SessionApprovalRequests");

        // Check if this session approval already exists
        const existingRequest = await sessionsApproval.findOne({
            departmentId: departmentObjectId,
            branchShortForm,
            session
        });

        if (existingRequest) {
            if (existingRequest.status === "approved") {
                throw new ApplicationError("This session has already been approved", 400);
            } else if (existingRequest.status === "pending") {
                throw new ApplicationError("This session approval is already pending", 400);
            }
        }

        // Create the approval request
        const approvalRequest = {
            departmentId: departmentObjectId,
            departmentName: department.department,
            branchShortForm,
            session,
            status: "pending",
            createdAt: new Date()
        };

        await sessionsApproval.insertOne(approvalRequest);

        return res.status(200).json({
            status: "success",
            message: "Session submitted for approval successfully"
        });
    }

    // 2. Add Branch
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

        // Find the department
        const department = await db.collection(this.departments).findOne({ _id: departmentObjectId });

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Validate each branch object
        for (const branch of branches) {
            if (!branch.program || !branch.course || !branch.shortForm || !branch.duration) {
                throw new ApplicationError("Each branch must have program name, course, shortForm, and duration", 400);
            }

            // Validate duration based on program type
            if (typeof branch.duration !== 'number' || branch.duration < 1 || branch.duration > 5) {
                throw new ApplicationError("Duration must be a number between 1 and 5 years", 400);
            }

            // Check if branch already exists in this department
            const branchExists = department.branches?.some(b =>
                b.program === branch.program || b.shortForm === branch.shortForm
            );

            if (branchExists) {
                throw new ApplicationError(`Branch ${branch.program} or shortform ${branch.shortForm} already exists`, 400);
            }

            // Add empty session array if not provided
            if (!branch.session) {
                branch.session = [];
            }
        }

        // Create the branch approval request collection if it doesn't exist
        const branchApproval = db.collection("BranchApprovalRequests");

        // Create approval request for each branch
        const approvalRequests = branches.map(branch => ({
            departmentId: departmentObjectId,
            departmentName: department.department,
            branch,
            status: "pending",
            createdAt: new Date()
        }));

        await branchApproval.insertMany(approvalRequests);

        return res.status(200).json({
            status: "success",
            message: "Branches submitted for approval successfully"
        });
    }

    // 3. Add Faculty
    async addFaculty(req, res) {
        const db = await getDB();
        const { name, password, about, employeeCode, role, department, email, phone, abbreviation } = req.body;

        // Validate required fields
        if (!name || !password || !employeeCode || !role || !department || !email || !phone || !abbreviation) {
            throw new ApplicationError("Name, password, employee code, role, department, email, phone, and abbreviation are required", 400);
        }

        // Check if faculty already exists with the same employee code or email
        const existingFaculty = await db.collection(this.Faculty).findOne({
            $or: [
                { employeeCode: employeeCode },
                { email: email }
            ]
        });

        if (existingFaculty) {
            throw new ApplicationError(`Faculty with this employee code or email already exists`, 400);
        }

        // Check if the department exists
        const departmentExists = await db.collection(this.departments).findOne({ department });
        if (!departmentExists) {
            throw new ApplicationError(`Department ${department} does not exist`, 404);
        }

        // Prepare new faculty object
        const newFaculty = {
            name,
            password,  // In a production app, this should be hashed
            about: about || "Available",  // Default value if not provided
            employeeCode,
            role,
            department,
            email,
            phone,
            abbreviation,
            createdAt: new Date()
        };

        // Insert the faculty into the database
        const result = await db.collection(this.Faculty).insertOne(newFaculty);

        return res.status(201).json({
            status: "success",
            message: "Faculty added successfully",
            faculty: {
                ...newFaculty,
                _id: result.insertedId,
                password: undefined  // Don't return the password in the response
            }
        });
    }

    // 4. Add Subject List
    async addSubjects(req, res) {
        const db = await getDB();
        const { departmentId, courseType, branch, subjects } = req.body;

        // Validate required fields
        if (!departmentId || !courseType || !branch || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
            throw new ApplicationError("Department ID, course type, branch, and subjects array are required", 400);
        }

        let departmentObjectId;
        try {
            departmentObjectId = new ObjectId(departmentId);
        } catch (error) {
            throw new ApplicationError("Invalid department ID format", 400);
        }

        // Find the department
        const department = await db.collection(this.departments).findOne({ _id: departmentObjectId });

        if (!department) {
            throw new ApplicationError("Department not found", 404);
        }

        // Verify the branch exists in this department
        const branchExists = department.branches?.some(b => b.shortForm === branch);
        if (!branchExists) {
            throw new ApplicationError(`Branch ${branch} not found in this department`, 404);
        }

        // Verify the course type exists in this department
        const courseExists = department.courses?.some(c => c.type === courseType);
        if (!courseExists) {
            throw new ApplicationError(`Course type ${courseType} not found in this department`, 404);
        }

        // Validate each subject
        for (const subject of subjects) {
            if (!subject.subjectCode || !subject.subjectName) {
                throw new ApplicationError("Each subject must have a code and name", 400);
            }

            // Check if subject already exists
            const existingSubject = await db.collection(this.Subjects).findOne({
                subjectCode: subject.subjectCode
            });

            if (existingSubject) {
                throw new ApplicationError(`Subject with code ${subject.subjectCode} already exists`, 400);
            }
        }

        // Prepare the subjects for insertion with department info
        const subjectsToInsert = subjects.map(subject => ({
            ...subject,
            department: department.department,
            isElective: subject.isElective || false,
            branch,
            courseType,
            createdAt: new Date()
        }));

        // Insert the subjects into the database
        const result = await db.collection(this.Subjects).insertMany(subjectsToInsert);

        return res.status(201).json({
            status: "success",
            message: `${result.insertedCount} subjects added successfully`,
            subjects: subjectsToInsert.map((subject, index) => ({
                ...subject,
                _id: result.insertedIds[index]
            }))
        });
    }

    // Get departments for dept admin
    async getDepartments(req, res) {
        const db = await getDB();
        const departmentId = req.params.departmentId;

        // If departmentId is provided, get specific department details
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

            // Normalize department data - ensure all branches have session array
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

        // Otherwise, get all departments
        const departments = await db.collection(this.departments).find({}).toArray();

        // Normalize data for all departments
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

    // Get subject suggestions
    async getSubjectSuggestions(req, res) {
        const db = await getDB();
        const { query, department, branch } = req.query;

        if (!query || typeof query !== 'string') {
            return res.status(200).json({
                status: "success",
                suggestions: []
            });
        }

        // Create a case-insensitive regex pattern for the search term
        const searchPattern = new RegExp(query, 'i');

        // Build the search filter
        let filter = {
            $or: [
                { subjectName: searchPattern },
                { subjectCode: searchPattern }
            ]
        };

        // Add optional filters if provided
        if (department) filter.department = department;
        if (branch) filter.branch = branch;

        // Search for subjects that match the filter
        const suggestions = await db.collection(this.Subjects).find(filter)
            .project({
                _id: 1,
                subjectName: 1,
                subjectCode: 1,
                department: 1,
                isElective: 1,
                branch: 1
            })
            .limit(10) // Limit to 10 suggestions
            .toArray();

        return res.status(200).json({
            status: "success",
            suggestions
        });
    }
}