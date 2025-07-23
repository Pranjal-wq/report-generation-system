import { getDB } from "../../config/mongodb.js";
import validator from "validator";
import { getStudentDetails } from "../../utils/Student/getStudetDetails.js";
import { getOverallReportSubjectWise } from "../../Pipelines/getOverallReportSubjectWise.pipeline.js";
import { getSubjectDetails } from "../../utils/common/getSubjectDetails.js";
import { getMonthlyPipeline } from "../../Pipelines/Monthly.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

// @swagger
// /student/monthlyReport:
//   post:
//     summary: Generates a monthly attendance report for a student.
//     requestBody:
//       required: true
//       content:
//         application/json:
//           schema:
//             type: object
//             properties:
//               scholarNumber:
//                 type: string
//     responses:
//       200:
//         description: Monthly report data
//       400:
//         description: Invalid scholar number
//       404:
//         description: Student not found or related data missing
export const monthlyReport = async (req, res) => {
	const { scholarNumber } = req.body;

	// Validate required fields
	if (!validator.matches(scholarNumber, /^[0-9]{10}$/)) {
		return res.status(400).json({ error: "Invalid scholar number" });
	}

	// Get student details
	const studentDetails = await getStudentDetails(scholarNumber);
	if (!studentDetails || studentDetails.length === 0) {
		return res.status(404).json({ error: "Student not found" });
	}
	const student = studentDetails[0];
	console.log("Student Details:", student);

	// Validate branch and section
	const branch = student.branch;
	const section = student.section;
	if (!branch || !section) {
		return res.status(400).json({ error: "Branch and section are required" });
	}

	// Verify that the provided branch matches the student's record
	// (Assuming branch is provided via student's details)
	if (student.branch !== branch) {
		return res
			.status(400)
			.json({ error: "Branch does not match student's record" });
	}

	const db = getDB(); // Database is ATMS

	// Optional: Normalize section if needed
	const normalizedSection = section.length === 1 ? `0${section}` : section;

	// Build aggregation pipeline using request parameters with normalized section
	const pipeline = getMonthlyPipeline(
		scholarNumber,
		branch,
		null,
		normalizedSection
	);

	const results = await db
		.collection("Attendance")
		.aggregate(pipeline)
		.toArray();

	const SectionFaculty = db.collection("SectionFacultyMap");

	if (!SectionFaculty) {
		return res
			.status(404)
			.json({ error: "SectionFaculty collection not found" });
	}
	const facultyCollection = db.collection("User");
	const query = {
		batch: student.batch,
		department: student.branch,
		section: student.section,
	};
	// Fetch section faculty document
	const sectionFacultyDoc = await SectionFaculty.findOne(query);
	console.log("The query was  : \n", query);

	if (!sectionFacultyDoc) {
		return res.status(404).json({ error: "Faculty not found" });
	}

	// Replace subjectId with subject details and fetch faculty info
	const updatedResults = await Promise.all(
		results.map(async (record) => {
			try {
				const subjectDetail = await getSubjectDetails(record.subjectId);
				let facultyName = null;
				let facultyCode = null;
				if (sectionFacultyDoc) {
					const subjectMapEntry = sectionFacultyDoc.map.find(
						(m) => m.subjectId === record.subjectId
					);
					if (subjectMapEntry) {
						const facultyDoc = await facultyCollection.findOne({
							_id: new ObjectId(subjectMapEntry.ownerId),
						});
						if (facultyDoc) {
							facultyName = facultyDoc.name;
							facultyCode = facultyDoc.abbreviation;
						}
					}
				}
				return {
					...record,
					subjectCode: subjectDetail ? subjectDetail.subjectCode : null,
					subjectName: subjectDetail ? subjectDetail.subjectName : null,
					facultyName,
					facultyCode,
				};
			} catch (err) {
				console.error(
					`Error fetching subject details for ${record.subjectId}:`,
					err
				);
				return {
					...record,
					subjectCode: null,
					subjectName: null,
					facultyName: null,
					facultyCode: null,
				};
			}
		})
	);

	return res.status(200).json(updatedResults);
};

export const StudentOverallReport = async (req, res) => {
	const { scholarNumber, branch } = req.body;
	if (!validator.matches(scholarNumber, /^[0-9]{10}$/)) {
		return res.status(400).json({ error: "Invalid scholar number" });
	}

	console.log(req.body);
	const db = getDB();
	const student = await db.collection('Student').findOne({ scholarNumber: scholarNumber, branch: { $regex: branch } });

	if (!student) {
		return res.status(404).json({ error: "Student not found" });
	}

	let result = {
		scholarNumber: student.scholarNumber,
		studentName: student.StudentName
	};

	const data = await db.collection('SectionFacultyMap').find({
		batch: student.batch,
		department: student.branch,
		section: student.section
	}).toArray();

	if (!data || data.length === 0) {
		return res.status(404).json({ error: "Section faculty mapping not found" });
	}

	const subjects = data[0].map;
	let summary = [];

	for (let i = 0; i < subjects.length; i++) {
		const attendanceRecords = await db.collection('Attendance').find({
			ownerId: subjects[i].ownerId,
			subjectId: subjects[i].subjectId
		}).toArray();

		if (!attendanceRecords || attendanceRecords.length === 0) {
			continue;
		}

		const totalAttendance = attendanceRecords[0].attendance.length;
		const _id = new mongoose.Types.ObjectId(subjects[i].ownerId);
		const employee = await db.collection('User').find({ _id: _id }).toArray();

		const pipeline = await getOverallReportSubjectWise(
			subjects[i].ownerId,
			subjects[i].subjectId,
			student.section,
			scholarNumber
		);

		const present = await db.collection('Attendance').aggregate(pipeline).toArray();

		if (!present || present.length === 0) {
			continue;
		}

		summary.push({
			subCode: subjects[i].subCode,
			subName: subjects[i].subjectName,
			employee: employee[0].name,
			total: totalAttendance,
			present: present[0].totalPresent
		});
	}

	result.summary = summary;
	return res.status(200).json(result);
};

export const studentDetails = async (req, res) => {
	const scholarNumber = req.body.scholarNumber;
	if (!validator.matches(scholarNumber, /^[0-9]{10}$/)) {
		return res.status(400).json({ error: "Invalid scholar number" });
	}
	const details = await getStudentDetails(scholarNumber);
	console.log(`Details of ${scholarNumber} : `, details[0]);
	return res.status(200).json(details);
};