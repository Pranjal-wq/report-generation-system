import { useState, useEffect, useCallback } from 'react';
import { getSubjects, Subject } from '../../../../api/services/Admin/Subject';
import { getDepartments as fetchAllDepartments } from '../../../../api/services/Admin/admin';
import { Department } from '../DepartmentTypes'; // Assuming DepartmentTypes.ts is in ../
import { toast } from 'react-toastify';

const useSubjectData = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const fetchSubjectsList = useCallback(async () => {
    setLoadingSubjects(true);
    try {
      const {success,data} = await getSubjects();
      setSubjects(data);
      setFilteredSubjects(data); // Initialize filtered list
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      toast.error("Failed to fetch subjects.");
      setSubjects([]);
      setFilteredSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  }, []);

  const fetchDepartmentsList = useCallback(async () => {
    setLoadingDepartments(true);
    try {
      const response = await fetchAllDepartments();
      if (response && response.departments) {
        setDepartments(response.departments);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      toast.error("Failed to fetch departments.");
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjectsList();
    fetchDepartmentsList();
  }, [fetchSubjectsList, fetchDepartmentsList]);

  return {
    subjects,
    departments,
    filteredSubjects,
    setFilteredSubjects,
    fetchSubjectsList,
    fetchDepartmentsList,
    loadingSubjects,
    loadingDepartments,
  };
};

export default useSubjectData;
