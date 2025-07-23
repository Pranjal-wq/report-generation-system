import { localApiService } from "../../base";
import { CreateFacultyData, FacultyFilter, FacultyUser, UpdateFacultyPayload } from "../faculty/Faculty.types";

// ================== TYPE DEFINITIONS ==================

export interface Department {
  department: string;
  cn: string;
}

export interface Course {
  departmentId: string;
  courseName: string;
  courseType: string;
  duration: number;
}

export interface Branch {
  program: string;
  course: string;
  shortForm: string;
  duration: number;
}

export interface Faculty {
  name: string;
  employeeCode: string;
  email: string;
  phone: string;
  abbreviation: string;
  role: string;
}

export interface Subject {
  subjectCode: string;
  subjectName: string;
  department: string;
  isElective: boolean;
}

export interface Student {
  scholarNumber: string;
  StudentName: string;
  branch: string;
  section: string;
  batch: string;
  department: string;
}

// ================== API UTILS ==================

async function handleApiCall<T>(
  apiCall: () => Promise<{ data: T; success: boolean; message?: string }>, 
  successMessage?: string,
  errorMessage?: string,
  toastId?: string
): Promise<T> {
  try {
    const response = await apiCall();
    if (successMessage) {
      localApiService.showSuccess(successMessage, toastId);
    }
    return response.data;
  } catch (error) {
    console.error(errorMessage || "API error", error);
    // Error toast is already handled by the ApiService
    throw error;
  }
}

// =========== DEPARTMENT MANAGEMENT ===========

export const getDepartments = async () =>
  handleApiCall(
    () => localApiService.get("/api/admin/departments"),
    undefined,
    "Failed to fetch departments",
    "departments-fetch"
  );

export const getDepartmentById = async (departmentId: string) =>
  handleApiCall(
    () => localApiService.get(`/api/admin/departments/${departmentId}`),
    undefined,
    `Failed to fetch department ${departmentId}`,
    "department-fetch"
  );

export const addDepartment = async (departmentData: Department) =>
  handleApiCall(
    () => localApiService.post("/api/admin/departments", departmentData),
    "Department added successfully",
    "Failed to add department",
    "department-add"
  );

export const addDepartmentsBulk = async (departmentsData: Department[]) =>
  handleApiCall(
    () => localApiService.post("/api/admin/bulk-departments", { departments: departmentsData }),
    "Departments added successfully",
    "Failed to add departments in bulk",
    "departments-bulk-add"
  );

export const updateDepartment = async (departmentId: string, updatedData: Partial<Department>) =>
  handleApiCall(
    () => localApiService.put(`/api/admin/departments/${departmentId}`, updatedData),
    "Department updated successfully",
    `Failed to update department ${departmentId}`,
    "department-update"
  );

export const deleteDepartment = async (departmentId: string) =>
  handleApiCall(
    () => localApiService.delete(`/api/admin/departments/${departmentId}`),
    "Department deleted successfully",
    `Failed to delete department ${departmentId}`,
    "department-delete"
  );

// =========== COURSE MANAGEMENT ===========

export const getCoursesByDepartment = async (department: string) =>
  handleApiCall(
    () => localApiService.get(`/api/admin/departments/${department}`),
    undefined,
    `Failed to get courses for department: ${department}`,
    "courses-fetch"
  );

export const addCourse = async (courseData: Course) =>
  handleApiCall(
    () => localApiService.post("/api/admin/courseType", courseData),
    "Course added successfully",
    "Failed to add course",
    "course-add"
  );

export const updateCourse = async (courseId: string, updatedData: { name?: string }) =>
  handleApiCall(
    () => localApiService.put(`/api/admin/courses/${courseId}`, updatedData),
    "Course updated successfully",
    `Failed to update course ${courseId}`,
    "course-update"
  );

export const deleteCourse = async (departmentId: string, courseName: string) =>
  handleApiCall(
    () => localApiService.delete(`/api/admin/departments/${departmentId}/courses/${courseName}`),
    "Course deleted successfully",
    `Failed to delete course ${courseName}`,
    "course-delete"
  );

// =========== SESSION MANAGEMENT ===========

export const getSessionsByCourse = async (department: string, course: string) =>
  handleApiCall(
    () => localApiService.get(`/api/admin/sessions?department=${department}&course=${course}`),
    undefined,
    `Failed to fetch sessions for ${course} in ${department}`,
    "sessions-fetch"
  );

export const addSession = async (sessionData: { departmentId: string; branchSessions: Array<{ branchShortForm: string; sessions: string[] }> }) =>
  handleApiCall(
    () => localApiService.post("/api/admin/sessions", sessionData),
    "Session added successfully",
    "Failed to add session",
    "session-add"
  );

export const deleteSession = async (departmentId: string, branchShortForm: string, session: string) =>
  handleApiCall(
    () => localApiService.delete(`/api/admin/departments/${departmentId}/branches/${branchShortForm}/sessions/${session}`),
    "Session deleted successfully",
    `Failed to delete session ${session}`,
    "session-delete"
  );

// =========== BRANCH MANAGEMENT ===========

export const getBranches = async (department: string, course: string, session: string) =>
  handleApiCall(
    () => localApiService.get(`/api/admin/branches?department=${department}&course=${course}&session=${session}`),
    undefined,
    `Failed to fetch branches for ${course} ${session} in ${department}`,
    "branches-fetch"
  );

export const addBranch = async (branchData: { departmentId: string; branches: Branch[] }) =>
  handleApiCall(
    () => localApiService.post("/api/admin/branch", branchData),
    "Branch added successfully",
    "Failed to add branch",
    "branch-add"
  );

export const deleteBranch = async (departmentId: string, branchShortForm: string) =>
  handleApiCall(
    () => localApiService.delete(`/api/admin/departments/${departmentId}/branches/${branchShortForm}`),
    "Branch deleted successfully",
    `Failed to delete branch ${branchShortForm}`,
    "branch-delete"
  );

// =========== APPROVALS MANAGEMENT ===========

export const getSessionApprovalRequests = async () =>
  handleApiCall(
    () => localApiService.get("/api/approvals/session/requests"),
    undefined,
    "Failed to fetch session approval requests",
    "session-approvals-fetch"
  );

export const getBranchApprovalRequests = async () =>
  handleApiCall(
    () => localApiService.get("/api/approvals/branch/requests"),
    undefined,
    "Failed to fetch branch approval requests",
    "branch-approvals-fetch"
  );

export const markSessionRequestAsRead = async (requestId: string) =>
  handleApiCall(
    () => localApiService.put(`/api/approval/session/read-status/${requestId}`, {}),
    "Session request marked as read",
    `Failed to mark session request ${requestId} as read`,
    "session-read"
  );

export const markBranchRequestAsRead = async (requestId: string) =>
  handleApiCall(
    () => localApiService.put(`/api/approval/branch/read-status/${requestId}`, {}),
    "Branch request marked as read",
    `Failed to mark branch request ${requestId} as read`,
    "branch-read"
  );

export const processSessionRequest = async (requestId: string, action: "approve" | "reject", reason?: string) =>
  handleApiCall(
    () => localApiService.put("/api/approvals/session/process", { requestId, action, reason: action === "reject" ? reason : undefined }),
    `Session request ${action}d successfully`,
    `Failed to process session request ${requestId}`,
    "session-process"
  );

export const processBranchRequest = async (requestId: string, action: "approve" | "reject", reason?: string) =>
  handleApiCall(
    () => localApiService.put("/api/approvals/branch/process", { requestId, action, reason: action === "reject" ? reason : undefined }),
    `Branch request ${action}d successfully`,
    `Failed to process branch request ${requestId}`,
    "branch-process"
  );

// =========== SEMESTER CONFIGURATION ===========

export const configureSemester = async (semesterType: "even" | "odd", startDate?: string, endDate?: string) => {
  const requestData: { semesterType: string; startDate?: string; endDate?: string } = { semesterType };
  if (startDate) requestData.startDate = startDate;
  if (endDate) requestData.endDate = endDate;
  return handleApiCall(
    () => localApiService.post("/api/admin/semester", requestData),
    `Semester configured as ${semesterType} successfully`,
    `Failed to configure semester as ${semesterType}`,
    "semester-config"
  );
};

export const getSemesterStatus = async () =>
  handleApiCall(
    () => localApiService.get("/api/admin/semester"),
    undefined,
    "Failed to fetch semester status",
    "semester-status"
  );

export const getSemesterConfig = async () =>
  handleApiCall(
    () => localApiService.get("/api/admin/semester/config"),
    undefined,
    "Failed to fetch semester configuration",
    "semester-config-fetch"
  );

export const updateAcademicYear = async (academicYear: string) =>
  handleApiCall(
    () => localApiService.put("/api/admin/academic-year", { academicYear }),
    "Academic year updated successfully",
    `Failed to update academic year to ${academicYear}`,
    "academic-year-update"
  );

export const updateSemesterDates = async (semesterType: "odd" | "even", startDate?: string, endDate?: string) => {
  const dateData: { semesterType: string; startDate?: string; endDate?: string } = { semesterType: semesterType.toLowerCase() };
  if (startDate) dateData.startDate = startDate;
  if (endDate) dateData.endDate = endDate;
  return handleApiCall(
    () => localApiService.put("/api/admin/semester/dates", dateData),
    `${semesterType} semester dates updated successfully`,
    `Failed to update ${semesterType} semester dates`,
    "semester-dates-update"
  );
};

export const updateInstituteName = async (instituteName: string) =>
  handleApiCall(
    () => localApiService.put("/api/admin/institute", { instituteName }),
    "Institute name updated successfully",
    `Failed to update institute name to ${instituteName}`,
    "institute-update"
  );

// =========== FACULTY MANAGEMENT ===========

export const createFaculties = async (facultyData: CreateFacultyData) => {
  const response = await localApiService.post("/api/admin/createFaculty", { facultyData }, {
    showSuccessToast: true,
    successMessage: "Faculty created successfully",
    showErrorToast: true,
    errorMessage: "Failed to create faculty",
    toastId: "faculty-create"
  });
  return response.data;
};

export const getFaculty = async (filter: FacultyFilter) => {
  const response = await localApiService.post<{ status: string, data: FacultyUser[] }>("/api/admin/getFaculty", filter, {
    showErrorToast: true,
    errorMessage: "Failed to fetch faculty",
    toastId: "faculty-fetch"
  });
  return response.data;
};

export const updateFacultyById = async (id: string, toModify: UpdateFacultyPayload["toModify"]) => {
  const response = await localApiService.put("/api/admin/updateFaculty", { id, toModify }, {
    showSuccessToast: true,
    successMessage: "Faculty updated successfully",
    showErrorToast: true,
    errorMessage: "Failed to update faculty",
    toastId: "faculty-update"
  });
  return response.data;
};

export const getFacultyByDepartment = async (department: string) =>
  handleApiCall(
    () => localApiService.get(`/api/faculty/list?department=${department}`),
    undefined,
    `Failed to fetch faculty for department ${department}`,
    "faculty-dept-fetch"
  );

export const addFaculty = async (facultyData: { department: string; faculty: Faculty[] }) =>
  handleApiCall(
    () => localApiService.post("/api/admin/faculty", facultyData),
    "Faculty added successfully",
    "Failed to add faculty",
    "faculty-add"
  );

export const updateFaculty = async (employeeCode: string, updatedData: Partial<Faculty> & { department?: string }) =>
  handleApiCall(
    () => localApiService.put(`/api/admin/faculty/${employeeCode}`, updatedData),
    "Faculty updated successfully",
    `Failed to update faculty ${employeeCode}`,
    "faculty-update-emp"
  );

// =========== SUBJECT MANAGEMENT ===========

export const getSubjectsByDepartment = async (department: string) =>
  handleApiCall(
    () => localApiService.get(`/api/admin/subjects?department=${department}`),
    undefined,
    `Failed to fetch subjects for department ${department}`,
    "subjects-dept-fetch"
  );

export const addSubject = async (subjectData: Subject) =>
  handleApiCall(
    () => localApiService.post("/api/admin/subjects", subjectData),
    "Subject added successfully",
    "Failed to add subject",
    "subject-add"
  );

export const addSubjectsBulk = async (subjectsData: { subjects: Subject[] }) =>
  handleApiCall(
    () => localApiService.post("/api/admin/subjects", subjectsData),
    "Subjects added successfully",
    "Failed to add subjects in bulk",
    "subjects-bulk-add"
  );

export const updateSubject = async (subjectId: string, updatedData: Partial<Subject>) =>
  handleApiCall(
    () => localApiService.put(`/api/admin/subjects/${subjectId}`, updatedData),
    "Subject updated successfully",
    `Failed to update subject ${subjectId}`,
    "subject-update"
  );

export const updateSubjectsBulk = async (subjectUpdates: { subjectUpdates: Array<Partial<Subject> & { subjectCode: string }> }) =>
  handleApiCall(
    () => localApiService.put("/api/admin/subjects", subjectUpdates),
    "Subjects updated successfully",
    "Failed to update subjects in bulk",
    "subjects-bulk-update"
  );

// =========== STUDENT MANAGEMENT ===========

export const addStudent = async (studentData: Student) =>
  handleApiCall(
    () => localApiService.post("/api/admin/students", studentData),
    "Student added successfully",
    "Failed to add student",
    "student-add"
  );

export const addStudentsBulk = async (studentsData: { students: Student[] }) =>
  handleApiCall(
    () => localApiService.post("/api/admin/students/bulk", studentsData),
    "Students added successfully",
    "Failed to add students in bulk",
    "students-bulk-add"
  );

export const updateStudent = async (scholarNumber: string, updatedData: Partial<Student>) =>
  handleApiCall(
    () => localApiService.put(`/api/admin/students/${scholarNumber}`, updatedData),
    "Student updated successfully",
    `Failed to update student ${scholarNumber}`,
    "student-update"
  );

export const updateStudentsBulk = async (studentUpdates: { studentUpdates: Array<Partial<Student> & { scholarNumber: string }> }) =>
  handleApiCall(
    () => localApiService.put("/api/admin/students", studentUpdates),
    "Students updated successfully",
    "Failed to update students in bulk",
    "students-bulk-update"
  );

export const getStudentsByClass = async (department: string, course: string, branch: string, session: string, section: string) =>
  handleApiCall(
    () => localApiService.get(`/api/admin/students?department=${department}&course=${course}&branch=${branch}&session=${session}&section=${section}`),
    undefined,
    `Failed to fetch students for ${branch} ${section} ${session}`,
    "students-class-fetch"
  );

export const getAdminDashboardStats = async () =>
  handleApiCall(
    () => localApiService.get("/api/dashboard/stats"),
    undefined,
    "Failed to fetch admin dashboard stats",
    "dashboard-stats"
  );


