import { getDB } from "../../config/mongodb.js"
import { ApplicationError } from "../../errorHandle/error.js";

export default class HOD {
    constructor() {
        this.collection = 'User';
    }
    async emailToEmp(req, res) {
        const email = req.body.email;
        console.log("Email ", email);

        if (!email) {
            throw new ApplicationError("Email is required", 400);
        }

        const db = await getDB();
        const collection = await db.collection(this.collection);
        const result = await collection.findOne({ email: email });

        if (!result) {
            throw new ApplicationError("User not found with the provided email", 404);
        }

        console.log("Result", result);
        return res.status(200).json({ employeeCode: result.employeeCode, name: result.name, branch: result.department });
    }
}