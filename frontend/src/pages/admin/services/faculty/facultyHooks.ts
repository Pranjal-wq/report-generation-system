import { useState, useEffect } from "react";
import { FacultyUser } from "../../../../api/services/faculty/Faculty.types";
import { getFaculty } from "../../../../api/services/Admin/admin";
import { getDepartments } from "../../../../api/services/director/director";

export default function useFacultyData() {
  const [faculties, setFaculties] = useState<FacultyUser[]>([]);
  const [departments, setDepartments] = useState<{ _id: string, count: number }[]>([]);
  const [filteredFaculties, setFilteredFaculties] = useState<FacultyUser[]>([]);

  useEffect(() => {
    fetchFaculty();
    fetchDepartments();
  }, []);
  const fetchFaculty = async () => {
    try {
      const res = await getFaculty({});
      const facultyData = res.data || [];      setFaculties(facultyData);
      setFilteredFaculties(facultyData);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const departments = await getDepartments();      setDepartments(departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  return {
    faculties,
    departments,
    filteredFaculties,
    setFilteredFaculties,
    fetchFaculty,
    fetchDepartments
  };
}
