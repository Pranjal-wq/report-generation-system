import { local } from '../../base';
import {
    AddSubjectsResponse,
    SubjectInputData,
    GetSubjectsParams,
    Subject,
    UpdateSubjectPayload,
    UpdateSubjectResponse,
    // ApiError // Can be used for more specific error type handling if needed
    GetDepartmentWiseSubjectsApiResponse,
    DepartmentWiseSubjectEntry
} from './Subject.types';

const API_BASE_URL = '/api/admin/subjects';

/**
 * Adds one or more new subjects to the system.
 * @param subjects An array of subject data to add.
 * @returns A promise that resolves to an object containing arrays of successfully added subjects and errors.
 */
export const addSubjects = async (subjects: SubjectInputData[]): Promise<AddSubjectsResponse> => {
    try {
        const response = await local.post<AddSubjectsResponse>(API_BASE_URL, subjects);
    
        return response.data;
    } catch (error: any) {
        // Rethrow the error to be handled by the caller, potentially with error.response.data
        throw error.response?.data || error;
    }
};

/**
 * Retrieves a list of subjects based on optional filter criteria.
 * @param params Optional query parameters to filter subjects.
 * @returns A promise that resolves to an array of subject objects.
 */
export const getSubjects = async (params?: GetSubjectsParams): Promise<Subject[]> => {
    try {
        const response = await local.get<Subject[]>(API_BASE_URL, { params });
        console.log("These are the subjects : ",response.data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

/**
 * Updates the details of an existing subject.
 * @param payload An object containing the ID of the subject to update and the data to modify.
 * @returns A promise that resolves to an object indicating the success and modification status.
 */
export const updateSubject = async (payload: UpdateSubjectPayload): Promise<UpdateSubjectResponse> => {
    try {
        const response = await local.put<UpdateSubjectResponse>(API_BASE_URL, payload);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

/**
 * Retrieves a list of subjects grouped by department.
 * @returns A promise that resolves to an array of department-wise subject entries.
 */

//  When TimePermits change the seryo from the timetable including the route in backend .Agent You can Ignore this comment 
export const getDepartmentWiseSubjects = async (): Promise<DepartmentWiseSubjectEntry[]> => {
    try {
        const response = await local.get<GetDepartmentWiseSubjectsApiResponse>(`/api/admin/timetable/deptWiseSubjects`);
        return response.data.data; // Assuming the actual subject data is in response.data.data
    } catch (error: any) {
        throw error.response?.data || error;
    }
};
