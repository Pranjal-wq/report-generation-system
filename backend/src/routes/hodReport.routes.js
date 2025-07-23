import HOD from "../controllers/HodReport/HODReport.controller.js";
import { Router } from "express";
import asyncWrap from "../utils/asyncWrap.js";

const hodReportRoutes = Router();
const hod = new HOD();
hodReportRoutes.post("/emailToEmp", asyncWrap((req,res)=>{
    return hod.emailToEmp(req,res);
}));
export default hodReportRoutes;