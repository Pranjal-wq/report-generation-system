import { baseApiService, localApiService } from "../../base";

// These are the api functions which interact with the backend
// They are used by the components to fetch and send data

export const getOverallAttendance = async (scholarNumber: string) => {
	try {
		const response = await baseApiService.post("/api/attendance/attendanceByScholarId", {
			scholarNumber,
		}, {
			showErrorToast: true,
			errorMessage: "Failed to fetch overall attendance",
			toastId: "overall-attendance"
		});
		
		return response.data;
	} catch (error) {
		console.error("Error fetching overall attendance:", error);
		throw error;
	}
};

export const getMonthlyAttendance = async (scholarNumber: string) => {
	try {
		const response = await localApiService.post("/api/student/attendance/monthly", {
			scholarNumber,
		}, {
			showSuccessToast: true,
			successMessage: "Monthly attendance data fetched successfully!",
			showErrorToast: true,
			errorMessage: "Failed to fetch monthly attendance",
			toastId: "monthly-attendance"
		});
		
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error("Error fetching monthly attendance:", error);
		throw error;
	}
};

export const getStudentDetails = async (
	scholarNumber: string,
	semester: string
) => {
	try {
		const response = await localApiService.post("/api/student/details", {
			scholarNumber,
			semester,
		}, {
			showErrorToast: true,
			errorMessage: "Failed to fetch student details",
			toastId: "student-details"
		});
		
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error("Error fetching student details:", error);
		throw error;
	}
};
