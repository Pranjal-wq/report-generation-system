import { getDB } from "../../config/mongodb.js";

export async function nameToEmpCode(name) {
    try {
        const db = await getDB();
        const col = db.collection("User");
        if(!col) {
            console.log("User not found");
            return;
        }
        console.log(col)
        const faculty = await col.findOne({ name: name });
        return faculty.employeeCode;
    } catch (error) {
        console.log(error);
    }}