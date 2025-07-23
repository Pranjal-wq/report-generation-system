import { Router } from "express";
import { DeptAdminController } from "../controllers/admin/DeptAdmin.controller.js";
import asyncWrap from "../utils/asyncWrap.js";

const deptAdminRouter = Router();
const deptAdminController = new DeptAdminController();

// Get departments (single or all)
deptAdminRouter.get("/departments/:departmentId?", asyncWrap((req, res) => {
    return deptAdminController.getDepartments(req, res);
}));

// 1. Add Session: Departmental admin can add and submit for approval to the admin
deptAdminRouter.post("/sessions", asyncWrap((req, res) => {
    return deptAdminController.submitSession(req, res);
}));

// 2. Add Branch: Departmental Admin can add branches for approval
deptAdminRouter.post("/branches", asyncWrap((req, res) => {
    return deptAdminController.addBranch(req, res);
}));

// 3. Add Faculty: Departmental admin can add faculty
deptAdminRouter.post("/faculty", asyncWrap((req, res) => {
    return deptAdminController.addFaculty(req, res);
}));

// 4. Add Subject List
deptAdminRouter.post("/subjects", asyncWrap((req, res) => {
    return deptAdminController.addSubjects(req, res);
}));

// Get subject suggestions for autocomplete
deptAdminRouter.get("/suggestions/subjects", asyncWrap((req, res) => {
    return deptAdminController.getSubjectSuggestions(req, res);
}));

export default deptAdminRouter;