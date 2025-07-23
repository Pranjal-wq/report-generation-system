// d:\att\Frontend-ReportGeneration\src\pages\admin\services\timetable\timetableHooks.ts
import { useState, useEffect, useCallback } from 'react';
import { getTimetable } from '../../../../api/services/Admin/Timetable';
import { WeeklyTimetable, GetTimetableResponse } from '../../../../api/services/Admin/Timetable.types';

interface UseTimetableData {
  timetable: WeeklyTimetable | null;
  isLoading: boolean;
  error: string | null;
  fetchTimetable: (facultyId: string) => Promise<void>;
}

const useTimetable = (): UseTimetableData => {
  const [timetable, setTimetable] = useState<WeeklyTimetable | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetable = useCallback(async (facultyId: string) => {
    if (!facultyId) {
      setTimetable(null);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response: GetTimetableResponse = await getTimetable(facultyId);
      if (response.status === 'success' && response.data) {
        setTimetable(response.data.timetable);
      } else {
        setError(response.message || 'Failed to fetch timetable.');
        setTimetable(null);
      }
    } catch (err) {
      console.error('Error in fetchTimetable hook:', err);
      setError('An unexpected error occurred while fetching the timetable.');
      setTimetable(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { timetable, isLoading, error, fetchTimetable };
};

export default useTimetable;
