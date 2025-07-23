import { localApiService } from "../../base";

interface Department {
	_id: string;
	count: number;
}

interface Branches {
	session: string[];
	branch: string;
}

export const getFacultyAttendance = async (
	employeeCode: string,
	startDate: Date,
	endDate: Date,
	subjectId?: string
) => {
	const payload = {
		employeeCode,
		startDate,
		endDate: endDate ? Date.now() : null,
		...(subjectId ? { subjectId } : {}),
	};
	
	const response = await localApiService.post("/api/faculty/facultyAttendance", payload, {
		showSuccessToast: true,
		successMessage: "Faculty attendance fetched successfully",
		showErrorToast: true,
		errorMessage: "Failed to fetch faculty attendance",
		toastId: "faculty-attendance"
	});
	
	console.log("These are the attendance details of the faculty: ", response.data);
	return response.data;
};

export const getDepartments = async (): Promise<Department[]> => {
	const response = await localApiService.get<Department[]>("/api/director/getDepartments", {
		showErrorToast: true,
		errorMessage: "Failed to fetch departments",
		toastId: "departments-director"
	});
	
	console.log("These are the available departments: ", response.data);
	return response.data;
};

export const getBranches = async (): Promise<Branches[]> => {
	const response = await localApiService.get<Branches[]>("/api/director/getBranches", {
		showErrorToast: true,
		errorMessage: "Failed to fetch branches",
		toastId: "branches-director"
	});
	
	console.log("These are the available branches: ", response.data);
	return response.data;
};

// Retrieves the faculty details and also the timetable of the faculty
export const getFacultyDetails = async (employeeCode: string) => {
	const response = await localApiService.get(`/api/faculty/details?employeeCode=${employeeCode}`, {
		showErrorToast: true,
		errorMessage: "Failed to fetch faculty details. Please check the faculty code.",
		toastId: "faculty-details"
	});
	
	console.log("These are the details of the faculty: ", response.data);
	return response.data;
};

export const getSubjectsAccToSection = async (branch: string, session: string, section: string) => {
	const response = await localApiService.get(`/api/director/getSubjectsAccToSection?branch=${branch.trim()}&session=${session.trim()}&section=${section.trim()}`, {
		showErrorToast: true,
		errorMessage: "Failed to fetch subjects for the specified section",
		toastId: "subjects-section"
	});
	
	console.log(`These are the subjects according to the ${branch} ${section} ${session}: `, response.data);
	return response.data;
}

export const ownerIdToEmpMap = async () => {
	const response = await localApiService.get<{ result: unknown }>(`/api/director/ownerIdToEmp`, {
		showErrorToast: true,
		errorMessage: "Failed to fetch owner ID to employee mapping",
		toastId: "owner-emp-map"
	});
	
	console.log("These are the ownerId to emp map: ", response.data.result);
	// The data object in turn consists of the array with the name as result so we tend to directly return it 
	return response.data.result;
}
