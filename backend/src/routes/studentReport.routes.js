import { Router } from "express";
import { studentDetails, monthlyReport, StudentOverallReport } from "../controllers/StudentReport/studentReport.controller.js";
import asyncWrap from "../utils/asyncWrap.js";
const studentReportRouter = Router();

// Student details route
studentReportRouter.post("/details", asyncWrap((req,res)=>{
    return studentDetails(req,res);
}));

// Student attendance reports
studentReportRouter.post("/attendance/monthly", asyncWrap((req,res)=>{
    return monthlyReport(req,res);
}));
studentReportRouter.post("/studentOverallReport", asyncWrap((req,res)=>{
    return StudentOverallReport(req,res);
}
));

export const studentReportRoutes = studentReportRouter;