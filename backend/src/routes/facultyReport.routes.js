import express from "express";
import FacultyReportController from "../controllers/FacultyReport/facultyReport.controller.js";
import { ClassReportController } from "../controllers/ClassReport/ClassReport.cotroller.js";
import asyncWrap from "../utils/asyncWrap.js";

const facultyReportRoutes = express.Router();
const facultyReportCont = new FacultyReportController();
const ClassReportCont = new ClassReportController();

facultyReportRoutes.get("/Subjects", asyncWrap((req, res) => {
  facultyReportCont.facultySubjectList(req, res);
}));

facultyReportRoutes.post("/attendance/classwise", asyncWrap((req, res) => {
  facultyReportCont.facultyAttendancePercentage(req, res);
}));

facultyReportRoutes.get("/details", asyncWrap((req, res) => {
  facultyReportCont.facultyDetails(req, res);
}));

facultyReportRoutes.get("/list", asyncWrap((req, res) => {
  facultyReportCont.listFaculty(req, res);
}));

facultyReportRoutes.post("/facultyAttendance", asyncWrap((req, res) => {
  facultyReportCont.FacultyAttendance(req, res);
}));

facultyReportRoutes.post("/nameToEmpCode", asyncWrap((req, res) => {
  facultyReportCont.getEmpCode(req, res);
}));

facultyReportRoutes.get("/timetable", asyncWrap((req, res) => {
  facultyReportCont.getTimeTable(req, res);
}));

facultyReportRoutes.post("/classReport", asyncWrap((req, res) => {
  ClassReportCont.getClassReport(req, res);
}));

export default facultyReportRoutes;


