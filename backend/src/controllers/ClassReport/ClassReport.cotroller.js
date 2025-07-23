import { getDB } from "../../config/mongodb.js";
import { getBranches as branchPipeline } from "../../Pipelines/getBranches.pipeline.js";
import { ApplicationError } from "../../errorHandle/error.js";
import UserRepository from "../../repo/user.repository.js";
import { getOverallClassAttendance } from "../../utils/Class/getOverallClassAttenndance.js";

export class ClassReportController {
	constructor() {
		this.StudentCollection = "Student";
		this.userRepo = new UserRepository();
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

	async getClassReport(req, res) {
		const { employeeCode, subjectId, branch, section } = req.body;
		const db = await getDB();

		const userResult = await this.userRepo.findByEmployeeCode(employeeCode);
		const userId = this.extractUserId(userResult);
		if (!userId) {
			throw new ApplicationError("User not found", 404);
		}

		const ownerId = userId.toString();
		const pipeline = await getOverallClassAttendance(
			ownerId,
			subjectId,
			section,
			branch
		);
		const report = await db
			.collection("Attendance")
			.aggregate(pipeline)
			.toArray();

		// Retrieve attendance document and calculate total classes
		const attendanceDoc = await db
			.collection("Attendance")
			.findOne({ ownerId, subjectId, section });
		const totalClasses = attendanceDoc ? attendanceDoc.attendance.length : 0;

		return res.status(200).json({ totalClasses, report });
	}

	async getBranches(req, res) {
		const db = await getDB();
		const pipeline = await branchPipeline();
		const branches = await db
			.collection("Student")
			.aggregate(pipeline)
			.toArray();
		console.log(branches, "\n");
		return res.status(200).json(branches);
	}

	async getSubjectsAccToSection(req, res) {
		const { branch, session, section } = req.query;

		if (!branch || !session || !section) {
			throw new ApplicationError("Branch, session, and section are required", 400);
		}

		const db = getDB();
		const sectionData = await db.collection('SectionFacultyMap').findOne({
			department: branch,
			batch: session,
			section,
		});

		if (!sectionData || !sectionData.map) {
			console.log("No subjects found for the given section");
			return res.json({ subjects: [] });
		}

		const subjects = sectionData.map.map((subject) => ({
			subCode: subject.subCode,
			subjectName: subject.subjectName,
			subjectId: subject.subjectId,
			ownerId: subject.ownerId,
		}));
		console.log(subjects, "Subjects found for the given section");
		return res.json({ subjects });
	}
}
