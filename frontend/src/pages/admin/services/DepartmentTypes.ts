export interface Department {
	_id: string;
	department: string;
	cn: string;
}

export interface DepartmentsResponse {
	status: string;
	departments: Department[];
}

export interface UploadedFile {
	id: string;
	name: string;
	type: string;
	size: number;
	data: any;
	status: "uploading" | "valid" | "invalid" | "processed";
	error?: string;
}

export type DepartmentStatus = "valid" | "duplicate" | "exists";

export interface ParsedDepartment {
	department: string;
	cn: string;
	status: DepartmentStatus;
}
