import FacultyReportRepo from "../../repo/faculty.repository.js";
import { getFacultyListDepartmentWise } from "../../Pipelines/Facultylist.pipeline.js";
import { getDB } from "../../config/mongodb.js";
import { nameToEmpCode } from "../../utils/Faculty/nameToEmpCode.js";
import { safeStringify } from "../../utils/safeJson.js";

export default class FacultyReportController {
	constructor() {
		this.facultyRepo = new FacultyReportRepo();
		this.Faculty = "User";
	}

	
	async facultySubjectList(req, res) {
		try {
			const result = await this.facultyRepo.facultySubjectList(
				req.query.employeeCode
			);
			res.status(200).json(result);
		} catch (e) {
			console.log(e);
		}
	}

	
	async facultyDetails(req, res) {
		// Since the repo's are crated in the nested manner from the UserRepo -> Faculty Repo .Hence to access the findByEmployee Code we need to accesss it by the help of userRepo
		try {
			const result = await this.facultyRepo.userRepo.findByEmployeeCode(
				req.query.employeeCode
			);
			res.status(200).json(result);
		} catch (e) {
			console.log(e);
		}
	}

	
	extractUserId(userResult) {
		if (!userResult || !userResult.data) {
			return null;
		}
		let data = userResult.data;
		while (data && data.data) {
			data = data.data;
		}
		return data?._id;
	}

	
	async FacultyAttendance(req, res) {
		try {
			console.log("Getting report for the faculty ");
			const { employeeCode, startDate, endDate, subjectId } = req.body;

			console.log("Employee code is ", employeeCode);
			console.log("The requestbody  is : ", req.body);
			// Use helper method to extract _id from nested user result
			const userResult = await this.facultyRepo.userRepo.findByEmployeeCode(
				employeeCode
			);
			if (!userResult) {
				//The employee is not present in the DB
				return res.status(404).json({ error: "Employee not found" });
			}
			const ownerId = this.extractUserId(userResult);
			if (!ownerId) {
				return res.status(404).json({ error: "Employee not found" });
			}

			let result = await this.facultyRepo.facultyAttendance({
				ownerId,
				startDate,
				endDate,
				subjectId,
				employeeCode,
			});

			// Use safeStringify to handle circular references

			return res.status(200).send(result);
		} catch (error) {
			console.log("The error in the Faculty is : ", error);
			res.status(500).json({ error: "Oopsie !!! Internal Server Error" });
		}
	}

	async listFaculty(req, res) {
		try {
			const department = req.query.department || "";
			const result = await getDB()
				.collection(this.Faculty)
				.aggregate(getFacultyListDepartmentWise(department))
				.toArray();
			res.status(200).json(result);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	
	async facultyAttendancePercentage(req, res) {
		try {
			const { ownerId, subjectId, course, branch, semester, section, session } =
				req.body;
			const result = await this.facultyRepo.facultyClassAttendancePercentage({
				ownerId,
				subjectId,
				course,
				branch,
				semester,
				section,
				session,
			});
			res.send(result);
		} catch (e) {
			console.log(e);
			res.send({
				status: "err",
				message: "Something went wrong",
				data: {},
			});
		}
	}

	
	async getTimeTable(req, res) {
		try {
			const { employeeCode } = req.body;

			const user = await this.facultyRepo.userRepo.findByEmployeeCode(
				employeeCode
			);
			if (user.status === "err") {
				return res.status(404).json({ error: "Employee not found" });
			}

			const ownerId = this.extractUserId(user);
			const result = await this.facultyRepo.getTimeTable(ownerId);
			res.status(200).json(result);
		} catch (e) {
			console.log(e);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	
	async getEmpCode(req, res) {
		try {
			if (!req.body.name) {
				return res.status(400).json({ error: "Name is required" });
			}
			console.log("Getting employee code for ", req.body.name);
			const empCode = await nameToEmpCode(req.body.name);

			return res.status(200).json(empCode);
		} catch (e) {
			console.log(e);
		}
	}

	async getTimeTable(req, res) {
		try {
			const userResult = await this.facultyRepo.userRepo.findByEmployeeCode(
				req.query.empCode
			);
			const ownerId = this.extractUserId(userResult);
			const db = getDB();
			const data = await db.collection("TimeTable").findOne({ ownerId });
			if (!data) {
				return res.status(404).json({ error: "Time table not found" });
			}
			return res.status(200).json({TimeTable : data.TimeTable});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error: "Internal server error while fetching time table" });
		}
	}
}