import { getDB } from "../../config/mongodb.js";
import { getStrength } from "./getStrength.js";

export const getAvgMarkedAttendance = async (
	branch,
	section,
	session,
	startDate,
	endDate
) => {
	// Retrieve attendance document for given params
	const db = await getDB();
	console.log("The params are : ", branch, section, session,"\n");
	const attendanceDoc = await db
		.collection("Attendance")
		.findOne({ branch, section, session });

	if (!attendanceDoc) {
		console.log("No attendance document found for given params");
		return 0;
	}

	// Calculate strength using getStrength
	const strength = await getStrength(branch, section, session);
	
	if (strength === 0) return 0;

	const startTime = startDate ? new Date(startDate).getTime() : -Infinity;
	const endTime = endDate ? new Date(endDate).getTime() : Infinity;
	const filteredClasses = (attendanceDoc.isMarked || []).filter((marked) => {
		const parts = marked.split(" ");
		const markedTime = Date.parse(parts[1]);
		return markedTime >= startTime && markedTime <= endTime;
	});

	let totalPercentage = 0;
	filteredClasses.forEach((marked) => {
		// Assume format: "time date", e.g., "12:00-1:00PM 2025-01-20"
		const parts = marked.split(" ");
		const markedDate = parts[1];
		const attendanceEntry = (attendanceDoc.attendance || []).find((entry) => {
			// Compare date parts by converting to ISO (yyyy-mm-dd)
			const entryDate = new Date(entry.date).toISOString().split("T")[0];
			return entryDate === markedDate;
		});
		let percentage = 0;
		if (attendanceEntry) {
			const presentCount = (attendanceEntry.attendance || []).filter(
				(record) => record.isPresent === "1"
			).length;
			percentage = (presentCount / strength) * 100;
		}
		totalPercentage += percentage;
	});

	return filteredClasses.length ? totalPercentage / filteredClasses.length : 0;
};
