import jwt from "jsonwebtoken";
import { ApplicationError } from "../errorHandle/error.js";

const jwtAuthProf = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return next(new ApplicationError("Authentication token missing", 401));
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_TEACHER);
    req.userId = payload.userID;
  } catch (err) {
    return next(new ApplicationError("Invalid or expired authentication token", 401));
  }
  
  next();
};

export default jwtAuthProf;
