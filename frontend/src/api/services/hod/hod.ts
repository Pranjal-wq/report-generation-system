import { localApiService } from "../../base";

export const nameToEmp = async (email: string) => {
    const response = await localApiService.post("/api/hod/emailToEmp", { email }, {
        showErrorToast: true,
        errorMessage: "Failed to fetch employee data",
        toastId: "hod-email-emp"
    });
    
    console.log("This is the HOD DATA: ", response.data);
    return response.data;
}

export const StudentOverall = async (scholarNumber: string, branch: string) => {
    const response = await localApiService.post("/api/student/studentOverallReport", { scholarNumber, branch }, {
        showSuccessToast: true,
        successMessage: "Student overall report fetched successfully",
        showErrorToast: true,
        errorMessage: "Failed to fetch student overall report",
        toastId: "student-overall-report"
    });
    
    console.log("This is the Student Overall DATA: ", response.data);
    return response.data;
}