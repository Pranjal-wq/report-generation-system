import { AxiosResponse } from 'axios';
import { local } from '../../base';
import {
  GetTimetableRequest,
  GetTimetableResponse,
  UpdateTimetableRequest,
  UpdateTimetableResponse,
  TimetableErrorResponse,
  WeeklyTimetable,
  DeleteSubjectRequest,
  DeleteSubjectResponse
} from './Timetable.types';

/**
 * Get timetable for a specific faculty member
 * @param ownerId - The faculty member's ID
 * @returns Promise with timetable data
 */
export const getTimetable = async (
  ownerId: string
): Promise<GetTimetableResponse> => {
  try {
    const requestData: GetTimetableRequest = { ownerId };
    
    const response: AxiosResponse<GetTimetableResponse> = await local.post(
      '/api/admin/timetable/get',
      requestData
    );
      return response.data;
  } catch (error: unknown) {
    console.error('Error fetching timetable:', error);
    
    // Handle API error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: TimetableErrorResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }
    
    // Handle network or other errors
    return {
      status: 'error',
      message: 'Failed to fetch timetable. Please try again.'
    };
  }
};

/**
 * Update timetable for a specific faculty member
 * @param ownerId - The faculty member's ID
 * @param timetable - The updated timetable data
 * @returns Promise with update result
 */
export const updateTimetable = async (
  ownerId: string,
  timetable: WeeklyTimetable
): Promise<UpdateTimetableResponse> => {
  try {
    const requestData: UpdateTimetableRequest = { ownerId, timetable };
    
    const response: AxiosResponse<UpdateTimetableResponse> = await local.put(
      '/api/admin/timetable/update',
      requestData
    );
      return response.data;
  } catch (error: unknown) {
    console.error('Error updating timetable:', error);
    
    // Handle API error response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: TimetableErrorResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }
    
    // Handle network or other errors
    return {
      status: 'error',
      message: 'Failed to update timetable. Please try again.'
    };
  }
};

// Delete a subject from a faculty member's timetable for a specific day
/**
 * Delete a subject from the timetable
 * @param ownerId - The faculty member's ID
 * @param day - The day key from which to delete the subject
 * @param subjectId - The subject ID to delete
 * @returns Promise with delete result
 */
export const deleteSubject = async (
  ownerId: string,
  day: string,
  subjectId: string
): Promise<DeleteSubjectResponse> => {
  try {
    const requestData: DeleteSubjectRequest = { ownerId, day, subjectId };
    const response: AxiosResponse<DeleteSubjectResponse> = await local.delete(
      '/api/admin/timetable/delete',
      { data: requestData }
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Error deleting subject from timetable:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: DeleteSubjectResponse } };
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }
    return {
      status: 'error',
      message: 'Failed to delete subject from timetable. Please try again.'
    };
  }
};

