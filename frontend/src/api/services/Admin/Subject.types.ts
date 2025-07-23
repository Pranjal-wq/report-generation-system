// Base structure for subject data input
export interface SubjectInputData {
    subjectCode: string;
    subjectName: string;
    department: string;
    isElective: boolean | "true" | "false";
}

// Structure for a subject successfully added (as per API doc for POST /subjects success array)
export interface AddedSubject {
    _id: string;
    subjectCode: string;
    subjectName: string;
    department: string;
    // Note: 'isElective' is not present in the success array example of the API doc for addSubjects.
}

// Structure for an error when adding a subject (as per API doc for POST /subjects errors array)
export interface SubjectAdditionError {
    subjectCode: string;
    subjectName: string;
    department: string;
    error: string;
    // Note: 'isElective' is not present in the error array example of the API doc for addSubjects.
    // If the API includes it, this type can be updated.
}

// Response type for adding subjects
export interface AddSubjectsResponse {
    success: AddedSubject[];
    errors: SubjectAdditionError[];
}

// Query parameters for getting subjects
export interface GetSubjectsParams {
    department?: string;
    subjectCode?: string;
    subjectName?: string;
    isElective?: boolean | "true" | "false";
}

// Full subject structure as returned by GET /subjects
export interface Subject {
    _id: string;
    subjectCode: string;
    subjectName: string;
    department: string;
    isElective: boolean; // API doc for GET shows boolean in response
    createdAt: string;
    updatedAt: string;
}

// Data for modifying a subject (fields that can be updated)
export interface UpdateSubjectData {
    subjectCode?: string;
    subjectName?: string;
    department?: string;
    isElective?: boolean | "true" | "false";
}

// Payload for updating a subject
export interface UpdateSubjectPayload {
    id: string;
    toModify: UpdateSubjectData;
}

// Response type for updating a subject
export interface UpdateSubjectResponse {
    message: string;
    modified: boolean;
}

// Generic error response from API for non-2xx status codes
export interface ApiError {
    error: string;
}

// New types for department-wise subjects API response
export interface DepartmentSubjectDetail {
  _id?: string; // Assuming _id might be present for individual subjects from backend
  subjectCode: string;
  subjectName: string;
  isElective: boolean;
}

export interface DepartmentWiseSubjectEntry {
  _id: string; // Department name
  subjects: DepartmentSubjectDetail[];
}

export interface GetDepartmentWiseSubjectsApiResponse {
  status: string;
  data: DepartmentWiseSubjectEntry[];
  message?: string; // Optional message field
}
