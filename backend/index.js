import express from "express";
import dotenv from "dotenv";
import userRoute from "./src/routes/user.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

// This is the studentReport Routes .
import { studentReportRoutes } from "./src/routes/studentReport.routes.js";
import facultyReportRoutes from "./src/routes/facultyReport.routes.js";
import directorRoutes from "./src/routes/director.routes.js";
import hodReportRoutes from "./src/routes/hodReport.routes.js";
import adminRouter from "./src/routes/admin.route.js";
import approvalRoutes from './src/routes/approval.routes.js'; //approval routes
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
import dashboardStats from "./src/routes/dashboard.routes.js";
// import { studentRoutes } from "./src/routes/student.routes.js";
import morgan from "morgan";
dotenv.config();
import { ApplicationError } from "./src/errorHandle/error.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import loggerMiddleware from "./src/middleware/logger.middleware.js";
import jwtAuthProf from "./src/middleware/jwt.middleware.js";
import helmet from "helmet";
import errorHandler from "./src/middleware/errorHandler.js";

connectToMongoDB();
const app = express();
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],//Limits the sources of the content to  the same origin (To be precise same domain )
				scriptSrc: ["'self'"], // Only allows the script from the same origin 
				styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"], //Only allows the Google Fonts API to load the Monteserrat Font Styles  
				imgSrc: ["'self'", "data:"],// Allows images from the same origin and data URIs ( simply nothing  but the base64 encoded images)
				connectSrc: ["'self'"],
				fontSrc: ["'self'", "fonts.gstatic.com"],// Allows fonts from the same origin and Google Fonts API
				objectSrc: ["'none'"],// Disallows the use of <object> elements
				mediaSrc: ["'self'"],// Allows media from the same origin
				frameSrc: ["'none'"],//Diallows the use of <frame> elements
				formAction: ["'self'"],// Allows form submissions to the same origin (To precise same domain)
				upgradeInsecureRequests:
					process.env.NODE_ENV === "production" ? [] : null,
			},
		},
		xssFilter: true, // Cross-Site Scripting (XSS) filter
		noSniff: true, // Prevents browsers from MIME-sniffing a response away from the declared content-type
		hidePoweredBy: true, // Hides the "X-Powered-By" header
		referrerPolicy: { policy: "same-origin" },
	})
);
app.use(morgan("dev"));
app.use(bodyParser.json({ type: "application/*+json" }));
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(cookieParser());
const port = process.env.PORT || 3000;
var corsOptions = {
	origin: "http://localhost:5173",
	allowedHeaders: "*",
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(loggerMiddleware);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/student/", studentReportRoutes);
app.use("/api/faculty/", facultyReportRoutes);
app.use("/api/user/", userRoute);
app.use("/api/director/", directorRoutes);
app.use("/api/hod/", hodReportRoutes);
app.use("/api/admin/", adminRouter);
app.use('/api/approvals/', approvalRoutes); //approval routes
app.use("/api/dashboard/", dashboardStats);
app.get("/", (req, res) => {
	res.send("Welcome to Attendance Report APIs");
});

// 404 handler for undefined routes
app.use((req, res) => {
	res.status(404).json({
		status: "err",
		message: "API endpoint not found",
		data: {}
	});
});

// Global error handler - must be after all routes
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server is running at ${port}`);
});
