import { Router } from "express";
import { AdminController } from "../controllers/admin/Admin.controller.js";
import asyncWrap from "../utils/asyncWrap.js";

const adminRouter = Router();
const adminController = new AdminController();

// Middleware to handle controller methods with asyncWrap
const handle = (controllerMethod) => asyncWrap((req, res) => controllerMethod(req, res));

// Department Routes
// Single route to handle both all departments and specific department by ID
// The :departmentId? syntax makes the parameter optional
adminRouter.route("/departments/:departmentId?")
    .get(handle(adminController.getDepartments))
    .post(handle(adminController.addDepartment)); // Add Department: Only Admin can add

// Bulk Departments Creation: Only Admin can add multiple departments
adminRouter.post("/bulk-departments", handle(adminController.bulkCreateDepartments));

// Update and delete department by ID
adminRouter.route("/departments/:departmentId")
    .put(handle(adminController.updateDepartment))
    .delete(handle(adminController.deleteDepartment));

// Branch and course management routes
adminRouter.delete("/departments/:departmentId/branches/:branchShortForm", 
    handle(adminController.deleteBranch));

adminRouter.delete("/departments/:departmentId/branches/:branchShortForm/sessions/:session", 
    handle(adminController.deleteSession));

adminRouter.delete("/departments/:departmentId/courses/:courseName", 
    handle(adminController.deleteCourse));

// Branch and Course Type Routes
adminRouter.post("/branch", handle(adminController.addBranch));
adminRouter.post("/coursetype", handle(adminController.addCourseType));

// Session Routes
adminRouter.post("/sessions", handle(adminController.addSession));

// Semester Routes
adminRouter.route("/semester")
    .get(handle(adminController.getActiveSemester))
    .post(handle(adminController.enableSemester));

adminRouter.get("/semester/config", handle(adminController.getSemesterConfig));

// Academic Calendar Routes
adminRouter.put("/academic-year", handle(adminController.updateAcademicYear));
adminRouter.put("/semester/dates", handle(adminController.updateSemesterDates));

// Institute Routes
adminRouter.put("/institute", handle(adminController.updateInstitute));

// 6. Add Subject: Handles both single and multiple subjects
// adminRouter.post("/subjects", asyncWrap((req, res) => {
//     return adminController.addSubject(req, res);
// }));

// Student Routes
adminRouter.route("/students")
    .post(handle(adminController.addStudent)) // Add Student: Handles both single and multiple students
    .put(handle(adminController.updateStudent)); // Update Student: Only Admin can update student details


// Suggestions Routes (Autocomplete)
adminRouter.get("/suggestions/departments", handle(adminController.getDepartmentSuggestions));
adminRouter.get("/suggestions/students", handle(adminController.getStudentSuggestions));
// Removed commented out suggestions routes for faculty and subjects

// Approval Routes
// Session approvals
adminRouter.route("/approvals/sessions")
    .get(handle(adminController.getSessionApprovalRequests));

adminRouter.post("/approvals/sessions/process", handle(adminController.processSessionRequest));

// Branch approvals
adminRouter.route("/approvals/branches")
    .get(handle(adminController.getBranchApprovalRequests));

adminRouter.post("/approvals/branches/process", handle(adminController.processBranchRequest));

// Dashboard Stats Routes
adminRouter.get("/dashboard", handle(adminController.getDashboardStats));

// Faculty Routes
adminRouter.post("/createFaculty", handle(adminController.createFaculty));
adminRouter.post("/getFaculty", handle(adminController.getFaculty));
adminRouter.put("/updateFaculty", handle(adminController.updateFaculty));
// Subject Routes
adminRouter.route("/subjects")
    .get(handle(adminController.getSubjects))      // Get Subjects: Retrieve subjects based on filter
    .post(handle(adminController.addSubject))      // Add Subject: Handles both single and multiple subjects
    .put(handle(adminController.updateSubject));   // Update Subject: Only Admin can update subject details

// Timetable Routes
adminRouter.post("/timetable/get", handle(adminController.getTimetable));
adminRouter.put("/timetable/update", handle(adminController.updateTimetable));
adminRouter.get("/timetable/deptWiseSubjects", handle(adminController.getDepartmentWiseSubjects));
adminRouter.delete("/timetable/delete", handle(adminController.deleteSubject));

export default adminRouter;



