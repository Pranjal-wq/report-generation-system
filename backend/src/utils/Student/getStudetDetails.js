import { getDB } from "../../config/mongodb.js"


// New helper function to fetch student details
export const getStudentDetails = async (scholarNumber) => {
	const db = getDB();
	return await db.collection("Student").find({ scholarNumber }).toArray();
};