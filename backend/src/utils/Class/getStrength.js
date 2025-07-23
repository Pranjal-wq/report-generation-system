// import { Console } from "winston/lib/winston/transports/index.js";
import { getDB } from "../../config/mongodb.js";

export const getStrength = async (branch, section, session) => {
    
	const db = await getDB();
	const attendanceDoc = await db
		.collection("Attendance")
		.findOne({ branch, section, session });
	if (!attendanceDoc) return 0;
	const strength = attendanceDoc.attendance?.[0]?.attendance?.length || 0;
    console.log("This is the strength : ", strength);
	return strength;
};
