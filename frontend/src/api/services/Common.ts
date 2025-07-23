import { localApiService } from "../base";

export const getProfessorsByDepartment = async (departmentId: string) => {
	try {
		const response = await localApiService.get(`/api/faculty/list?department=${departmentId}`, {
			showErrorToast: true,
			errorMessage: "Failed to fetch professors",
			toastId: "professors-fetch"
		});
		
		console.log(response.data);
        return response.data;
	} catch (error) {
		console.error("Error fetching professors:", error);
		throw error;
	}
};

export const getSubjectsByProfessor = async (professorId: string) => {
	try {
		const response = await localApiService.get(`/api/faculty/Subjects?employeeCode=${professorId}`, {
			showErrorToast: true,
			errorMessage: "Failed to fetch subjects",
			toastId: "subjects-fetch"
		});
		
		console.log(response.data);
        return response.data;
	} catch (error) {
		console.error("Error fetching subjects:", error);
		throw error;
	}
};




