import UserModel from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import userRepository from "../../repo/user.repository.js";
import bcrypt from "bcrypt";
import { ApplicationError } from "../../errorHandle/error.js";


export default class UserController {
	constructor() {
		this.userRepo = new userRepository();
	}

	async signUp(req, res) {
		const result = await this.userRepo.findByEmployeeCode(
			req.body.employeeCode
		);

		if (result.status == "ok" && result.data != null) {
			return res.send({
				status: "err",
				message: "Employee Already Exist",
				data: {},
			});
		}

		const { name, password, about, employeeCode, role } = req.body;

		if (!name || !password || !employeeCode || !role) {
			throw new ApplicationError("Missing required fields", 400);
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const user = new UserModel(
			name,
			hashedPassword,
			about,
			employeeCode,
			role
		);

		const sign = await this.userRepo.signUp(user);

		if (sign.status == "ok") {
			const token = jwt.sign(
				{
					userID: user._id,
					employeeCode: user.employeeCode,
				},
				process.env.JWT_SECRET_TEACHER,
				{
					expiresIn: "10h",
				}
			);

			res.send({
				status: "ok",
				message: "Success",
				data: {
					name: user.name,
					employeeCode: user.employeeCode,
					authorization: token,
				},
			});
		} else {
			throw new ApplicationError("Failed to create user", 500);
		}
	}

	async signIn(req, res) {
		const { employeeCode, password } = req.body;

		if (!employeeCode || !password) {
			throw new ApplicationError("Employee code and password are required", 400);
		}

		const result = await this.userRepo.findByEmployeeCode(employeeCode);

		if (result.status == "ok" && result.data == null) {
			return res.send({
				status: "err",
				message: "Employee doesn't exist",
				data: {},
			});
		}

		// comparing password with the hashed password
		const output = await bcrypt.compare(
			password,
			result.data.password
		);

		if (output) {
			const token = jwt.sign(
				{
					userID: result.id,
					userEmail: result.email,
				},
				process.env.JWT_SECRET_TEACHER,
				{
					expiresIn: "10h",
				}
			);

			return res.send({
				status: "ok",
				message: "Success",
				data: {
					name: result.name,
					employeeCode: result.employeeCode,
					authorization: token,
				},
			});
		} else {
			return res.send({
				status: "err",
				message: "Incorrect Credentials!",
				data: {},
			});
		}
	}
}
