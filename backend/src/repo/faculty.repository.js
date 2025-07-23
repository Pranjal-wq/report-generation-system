import { getDB } from "../config/mongodb.js";
import { getScheduledClasses } from "../utils/common/getScheduledClasses.js";
import UserRepository from "./user.repository.js";
import { getUnmarkedAttendanceDates } from "../utils/Faculty/getUnmarked.js";
// import AttedanceModal from "../models/attendance.model.js";
import { getAvgMarkedAttendance } from "../utils/Class/AvgMarked.js";

export default class FacultyReportRepo {
	/**
	 * Creates an instance of FacultyReportRepo.
	 */
	constructor() {
		this.userRepo = new UserRepository();
		this.TimeTableColletion = "TimeTable";
		this.attendanceCollection = "Attendance";
	}

	/**
	 * Retrieves the subject list for the given faculty employee code.
	 * @param {string} empCode - The employee code of the faculty.
	 * @returns {Promise<Object>} - An object containing status, message, and data.
	 */
	async facultySubjectList(empCode) {
		try {
			const emp = await this.userRepo.findByEmployeeCode(empCode);
			if (emp.status === "ok" && emp.data != null) {
				const db = await getDB();
				const collec = await db.collection(this.TimeTableColletion);
				const timeTableData = await collec.findOne({ ownerId: emp.data._id });
				const objectsSet = new Set();
				// Process timetable data to remove duplicate entries (ignoring timing)
				Object.keys(timeTableData.TimeTable).forEach((key) => {
					const elements = timeTableData.TimeTable[key];
					elements.forEach((element) => {
						const { timing, ...rest } = element;
						objectsSet.add(JSON.stringify(rest));
					});
				});
				const uniqueObjects = Array.from(objectsSet).map((item) =>
					JSON.parse(item)
				);
				return {
					status: "ok",
					message: "Success",
					data: uniqueObjects,
				};
			} else {
				return {
					status: "err",
					message: emp.message,
					data: {},
				};
			}
		} catch (e) {
			console.log(e);
			return {
				status: "err",
				message: e.message || "An error occurred",
				data: {},
			};
		}
	}

	/**
	 * Calculates faculty class attendance percentage.
	 * @param {Object} data - Object containing ownerId, subjectId, course, branch, semester, section, and session.
	 * @returns {Promise<Object>} - Returns an object with status, message, and attendance metrics.
	 */
	async facultyClassAttendancePercentage(data) {
		try {
			const { ownerId, subjectId, course, branch, semester, section, session } =
				data;
			if (
				ownerId &&
				subjectId &&
				course &&
				branch &&
				semester &&
				section &&
				session
			) {
				const db = await getDB();
				const collec = await db.collection(this.attendanceCollection);
				const result = await collec.findOne({ ...data });
				const mp = new Map();
				let total = 0;
				result.attendance.forEach((attendanceRecord) => {
					total++;
					attendanceRecord.attendance.forEach((list) => {
						if (mp.has(list["Scholar No."])) {
							const tmp = mp.get(list["Scholar No."]);
							mp.set(list["Scholar No."], tmp + parseInt(list["isPresent"]));
						} else {
							mp.set(list["Scholar No."], parseInt(list["isPresent"]));
						}
					});
				});
				return {
					status: "ok",
					message: "Success",
					data: { totalClass: total, attendace: Object.fromEntries(mp) },
				};
			}
			return {
				status: "err",
				message: "Some data is missing",
				data: { totalClass: 0, attendace: {} },
			};
		} catch (e) {
			console.log(e);
			return {
				status: "err",
				message: e.message || "An error occurred",
				data: {},
			};
		}
	}

	/**
	 * Extracts the user ID from nested user result data.
	 * @param {Object} userResult - The user result object.
	 * @returns {string} - The extracted user ID.
	 */
	extractUserId(userResult) {
		let data = userResult.data;
		while (data && data.data) {
			data = data.data;
		}
		return data._id;
	}

	/**
	 * Retrieves detailed attendance data and scheduled classes for a faculty subject.
	 * @param {Object} data - Contains ownerId, startDate, endDate, subjectId, and employeeCode.
	 * @returns {Promise<Object>} - An object with status, message, and schedule/attendance details.
	 */
	async facultyAttendance(data) {
		try {
			let {
				ownerId,
				startDate: reqStartDate,
				endDate: reqEndDate,
				subjectId,
				employeeCode,
			} = data;
			const endDate = new Date(reqEndDate);
			const providedStartDate = reqStartDate ? new Date(reqStartDate) : null;
			const db = await getDB();
			const Attendance = db.collection("Attendance");
			if (!Attendance) {
				return {
					status: "err",
					message: "Attendance collection not found",
					data: [],
				};
			}
			const ScheduledClasses = [];
			const facultyResult = await this.facultySubjectList(employeeCode);
			if (facultyResult.status !== "ok" || !facultyResult.data) {
				return {
					status: "err",
					message: "Failed to fetch faculty subjects",
					data: [],
				};
			}
			const subjectsToProcess = subjectId
				? facultyResult.data.filter((entry) => entry.subject._id === subjectId)
				: facultyResult.data;
			if (subjectId && subjectsToProcess.length === 0) {
				return {
					status: "err",
					message: "Subject not found",
					data: [],
				};
			}
			for (const element of subjectsToProcess) {
				const id = element.subject._id;
				if (!id) continue;
				const q = { ownerId: ownerId.toString(), subjectId: id };
				let attendanceDoc = await Attendance.findOne(q);
				if (!attendanceDoc) continue;
				if (!attendanceDoc.attendance.length) {
					continue;
				}
				let currentStartDate = providedStartDate;
				if (!currentStartDate) {
					if (
						Array.isArray(attendanceDoc.attendance) &&
						attendanceDoc.attendance.length > 0
					) {
						const dates = attendanceDoc.attendance
							.map((record) => new Date(record.date))
							.filter((d) => !isNaN(d));
						currentStartDate =
							dates.length > 0 ? new Date(Math.min(...dates)) : new Date();
					} else {
						currentStartDate = new Date();
					}
				}
				const scheduledClasses = await getScheduledClasses(
					ownerId,
					id,
					currentStartDate.toISOString(),
					reqEndDate
				);
				let totalClasses = 0;
				if (Array.isArray(attendanceDoc.attendance)) {
					totalClasses = attendanceDoc.attendance.filter((record) => {
						if (!record.date) return false;
						const recordDate = new Date(record.date);
						return recordDate >= currentStartDate && recordDate <= endDate;
					}).length;
				}
				let isMarked = 0;
				if (attendanceDoc.isMarked && Array.isArray(attendanceDoc.isMarked)) {
					const startTime = currentStartDate.getTime();
					const endTime = endDate.getTime();
					isMarked = attendanceDoc.isMarked.filter((markedEntry) => {
						const parts = markedEntry.split(" ");
						if (parts.length < 2) return false;
						const markedTime = Date.parse(parts[1]);
						return (
							!isNaN(markedTime) &&
							markedTime >= startTime &&
							markedTime <= endTime
						);
					}).length;
				}
				const unmarkedDatesResult = await getUnmarkedAttendanceDates(
					ownerId,
					id,
					currentStartDate.toISOString(),
					reqEndDate
				);
				let unmarkedDates = [];
				if (
					unmarkedDatesResult.status === "ok" &&
					unmarkedDatesResult.data.length
				) {
					const [res] = unmarkedDatesResult.data;
					unmarkedDates = [
						...res.unmarkedInAttendance,
						...res.unmarkedInIsMarked,
					];
				}
				const avgMarkedAttendance = await getAvgMarkedAttendance(
					element.branch,
					element.section,
					element.session,
					currentStartDate,
					endDate
				);
				if(avgMarkedAttendance.length === 0 || !avgMarkedAttendance) {
					return {data: [], message: "No data found", status: "err"};
				}
				ScheduledClasses.push({
					employeeCode: employeeCode,
					subjectId: id,
					subjectName: element.subject.subjectName || "Unknown Subject",
					subjectCode: element.subject.subjectCode || "Unknown Code",
					branch: element.branch || "Unknown Branch",
					semester: element.semester,
					section: element.section,
					course: element.course,
					session: element.session,
					isElective: element.isElective,
					scheduledClasses: scheduledClasses,
					totalClasses: totalClasses,
					isMarked: isMarked,
					startDate: currentStartDate,
					endDate: endDate,
					unmarkedDates,
					averageMarkedAttendance: avgMarkedAttendance,
				});
			}
			return {
				status: "ok",
				message: "Success",
				data: ScheduledClasses,
			};
		} catch (error) {
			return {
				status: "err",
				message: error.message,
				data: [],
			};
		}
	}

	async getTimeTable(ownerId) {
		try {
			const db = await getDB();
			const collec = await db.collection(this.TimeTableColletion);
			const timeTableData = await collec.findOne({ ownerId:ownerId });
			return timeTableData.TimeTable;
	}catch (error) {
		return {
			status: "err",
			message: error.message,
			data: [],
		};
	}
}	

}
