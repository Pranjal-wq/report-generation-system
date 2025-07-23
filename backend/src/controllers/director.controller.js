// Only Director role has the access to this controller
import { getDepartments } from "../Pipelines/Departments.pipeline.js";
import { getDB } from "../config/mongodb.js";
import { getBranches as getBranchPipeline } from "../Pipelines/getBranches.pipeline.js";
import { ApplicationError } from "../errorHandle/error.js";

export const getDepts = async (req, res) => {
	const db = getDB();
	const pipeline = await getDepartments(); 
	const result = await db.collection("User").aggregate(pipeline).toArray();
	return res.status(200).json(result);
};

export const getBranchAndSession = async (req, res) => {
	const db = getDB();
	const pipeline = await getBranchPipeline(); 
	const result = await db.collection("Student").aggregate(pipeline).toArray();
	return res.status(200).json(result);
};

export async function findByOwnerId(req, res) {
	const db = getDB();
	// const pipeline = ownerIdToEmp();
	const data = await db.collection("User").find().toArray();
	if (!data || data.length === 0) {
		throw new ApplicationError("No user records found", 404);
	}

	const result = [];
	data.forEach((record) => {
		result.push({ _id: record._id, employeeCode: record.employeeCode });
	});
	return res.status(200).json({ result });
}
