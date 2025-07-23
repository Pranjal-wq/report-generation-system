import { localApiService } from "../../base";

export const getEmpCode = async (empName: string) => {
    try {
        const response = await localApiService.post(`/api/faculty/nameToEmpCode`, { name: empName }, {
            showErrorToast: true,
            errorMessage: "Failed to fetch Employee Code",
            toastId: "emp-code-fetch"
        });
        
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching Employee Code:", error);
        throw error;
    }
}

export const getClassReport = async (employeeCode: string, subjectId: string, branch: string, section: string) => {
    try {
        const response = await localApiService.post(`/api/faculty/classReport`, { 
            employeeCode, 
            subjectId, 
            branch, 
            section 
        }, {
            showSuccessToast: true,
            successMessage: "Class report fetched successfully",
            showErrorToast: true,
            errorMessage: "Failed to fetch Class Report",
            toastId: "class-report"
        });
        
        console.log(`This is the class report of the faculty with the ${employeeCode} employee code : ${response.data}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Class Report:", error);
        throw error;
    }
}

export const getTimetable = async (empCode: string) => {
    try {
        const response = await localApiService.get(`/api/faculty/timetable?empCode=${empCode}`, {
            showErrorToast: true,
            errorMessage: "Failed to fetch Timetable",
            toastId: "faculty-timetable"
        });
        
        console.log(`This is the timetable of the faculty with the ${empCode} employee code : ${response.data}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Timetable:", error);
        throw error;
    }
}

