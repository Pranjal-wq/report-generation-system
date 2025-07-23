import express from "express";
import UserController from "../controllers/User/user.controller.js";
import asyncWrap from "../utils/asyncWrap.js";

const userController = new UserController();
const userRoute = express.Router();

userRoute.post("/signUp", asyncWrap((req, res) => {
  userController.signUp(req, res);
}));

userRoute.post("/signIn", asyncWrap((req, res) => {
  userController.signIn(req, res);
}));

export default userRoute;



