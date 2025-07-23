import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

export const getSubjectDetails = async (subjectId) => {
	const db = getDB();
	const sub_details = await db
		.collection("Subject")
		.findOne({ _id: new ObjectId(subjectId) });
	console.log("Subject Details: ", sub_details);
	return sub_details;
};
