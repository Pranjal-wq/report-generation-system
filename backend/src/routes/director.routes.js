import { Router } from "express";
import { getDepts, findByOwnerId } from "../controllers/director.controller.js";
import { ClassReportController } from "../controllers/ClassReport/ClassReport.cotroller.js";
import asyncWrap from "../utils/asyncWrap.js";

const ClassReportCot = new ClassReportController();
const directorRoutes = Router();

directorRoutes.get("/getDepartments", asyncWrap(getDepts));
directorRoutes.get("/getBranches", asyncWrap(ClassReportCot.getBranches.bind(ClassReportCot)));
directorRoutes.get("/getSubjectsAccToSection", asyncWrap(ClassReportCot.getSubjectsAccToSection.bind(ClassReportCot)));
directorRoutes.get("/ownerIdToEmp", asyncWrap(findByOwnerId));

export default directorRoutes;