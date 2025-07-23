import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// API services
import {
    getDepartments,
    getSessionsByCourse,
    addSession,
    getCoursesByDepartment,
    deleteSession
} from '../../../../../api/services/Admin/admin';

// Component imports
import DepartmentSelector from './DepartmentSelector';
import CourseSelector from './CourseSelector';
import BranchSelector from './BranchSelector';
import SessionList, { DeleteSessionModal } from './SessionList';
import AddSessionForm from './AddSessionForm';
import BulkSessionInput from './BulkSessionInput';

// Interfaces
interface Department {
    _id: string;
    department: string;
    cn: string;
    branches?: DepartmentBranch[];
    courses?: Course[];
}

interface DepartmentBranch {
    course: string;
    program: string;
    shortForm: string;
    session: string[];
    duration: number;
}

interface Course {
    _id?: string;
    name: string;
    type?: string;
    duration?: number;
}

interface Branch {
    _id: string;
    shortForm: string;
    program: string;
}

interface Session {
    _id: string;
    session: string;
}

interface DepartmentsResponse {
    status: string;
    departments: Department[];
}

const SessionManagement: React.FC = () => {
    // State for selectors
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [sessions, setSessions] = useState<Session[]>([]);
    const [newSession, setNewSession] = useState('');
    const [selectedCourseDuration, setSelectedCourseDuration] = useState<number | null>(null);

    // Loading states
    const [loading, setLoading] = useState(false);
    const [courseLoading, setCourseLoading] = useState(false);
    const [branchLoading, setBranchLoading] = useState(false);
    const [sessionLoading, setSessionLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Delete session states
    const [isDeleting, setIsDeleting] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Bulk session input state
    const [showBulkInputDialog, setShowBulkInputDialog] = useState(false);

    // Load departments on component mount
    useEffect(() => {
        refreshDepartmentsData();
    }, []);

    // When department changes, load courses
    useEffect(() => {
        if (selectedDepartment) {
            fetchCourses(selectedDepartment);
        } else {
            setCourses([]);
            setSelectedCourse('');
            setBranches([]);
            setSelectedBranch('');
            setSessions([]);
        }
    }, [selectedDepartment]);

    // When course changes, load branches and update selected course duration
    useEffect(() => {
        if (selectedCourse && selectedDepartment) {
            fetchBranches(selectedDepartment, selectedCourse);

            // Update the selected course duration
            const dept = departments.find(dept => dept._id === selectedDepartment);
            if (dept && dept.courses) {
                const course = dept.courses.find(course => course.name === selectedCourse);
                if (course) {
                    setSelectedCourseDuration(course.duration ?? null);
                } else {
                    setSelectedCourseDuration(null);
                }
            } else {
                setSelectedCourseDuration(null);
            }
        } else {
            setBranches([]);
            setSelectedBranch('');
            setSessions([]);
            setSelectedCourseDuration(null);
        }
    }, [selectedCourse, selectedDepartment, departments]);

    // When branch changes, load sessions for that branch
    useEffect(() => {
        if (selectedBranch && selectedCourse && selectedDepartment) {
            fetchSessionsForBranch(selectedDepartment, selectedCourse, selectedBranch);
        } else {
            setSessions([]);
        }
    }, [selectedBranch, selectedCourse, selectedDepartment]);

    // Function to refresh departments data from API and update localStorage
    const refreshDepartmentsData = async () => {
        setLoading(true);
        try {
            const data = await getDepartments() as DepartmentsResponse;
            if (data && data.departments) {
                setDepartments(data.departments);
                // Update localStorage with fresh data
                updateLocalStorage(data.departments);
                return data.departments;
            } else {
                setDepartments([]);
                console.error('Unexpected response format:', data);
                return [];
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Failed to refresh departments data');
            setDepartments([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Fetch departments with fallback to cached data
    const fetchDepartments = async () => {
        setLoading(true);
        try {
            // First try to get fresh data from API
            const freshDepartments = await refreshDepartmentsData();
            if (freshDepartments.length > 0) {
                return;
            }

            // If API call failed, try to use cached data as fallback
            const cachedData = localStorage.getItem('departmentsData');
            if (cachedData) {
                const parsedData = JSON.parse(cachedData) as DepartmentsResponse;
                // Check if the cached data is still valid
                if (parsedData && parsedData.departments && parsedData.departments.length > 0) {
                    setDepartments(parsedData.departments);
                }
            }
        } catch (error) {
            console.error('Error in fetchDepartments:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch courses for a department
    const fetchCourses = async (departmentId: string) => {
        setCourseLoading(true);
        try {
            // Check if we already have departments data in localStorage
            const cachedData = localStorage.getItem('departmentsData');
            if (cachedData) {
                const parsedData = JSON.parse(cachedData) as DepartmentsResponse;
                const selectedDept = parsedData.departments.find(dept => dept._id === departmentId);
                if (selectedDept && selectedDept.courses) {
                    setCourses(selectedDept.courses);
                } else {
                    setCourses([]);
                    console.warn('No courses found in cached data for the selected department');
                }
            } else {
                // If no data in cache, fetch from API
                const data = await getCoursesByDepartment(departmentId);
                setCourses(data.courses || []);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to load courses');
            setCourses([]);
        } finally {
            setCourseLoading(false);
        }
    };

    // Fetch branches for a department and course
    const fetchBranches = async (departmentId: string, courseName: string) => {
        setBranchLoading(true);
        try {
            // Check if we already have departments data in localStorage
            const cachedData = localStorage.getItem('departmentsData');
            if (cachedData) {
                const parsedData = JSON.parse(cachedData) as DepartmentsResponse;
                const selectedDept = parsedData.departments.find(dept => dept._id === departmentId);

                if (selectedDept && selectedDept.branches) {
                    // Filter branches by the selected course
                    const relevantBranches = selectedDept.branches.filter(branch =>
                        branch.course === courseName
                    );

                    if (relevantBranches.length > 0) {
                        // Map to the Branch interface format expected by the component
                        const branchData = relevantBranches.map(branch => ({
                            _id: `branch-${branch.shortForm}`,
                            shortForm: branch.shortForm,
                            program: branch.program
                        }));

                        setBranches(branchData);
                    } else {
                        setBranches([]);
                        console.warn('No branches found in cached data for the selected course');
                    }
                } else {
                    setBranches([]);
                    console.warn('No branches found in cached data for the selected department');
                }
            } else {
                // If no cached data, use default mock data (this would be replaced with an API call in a real app)
                const mockBranches = [
                    { _id: 'b1', shortForm: 'CSE', program: 'Computer Science and Engineering' },
                    { _id: 'b2', shortForm: 'ECE', program: 'Electronics and Communication Engineering' },
                    { _id: 'b3', shortForm: 'EE', program: 'Electrical Engineering' },
                    { _id: 'b4', shortForm: 'ME', program: 'Mechanical Engineering' }
                ];
                setBranches(mockBranches);
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
            toast.error('Failed to load branches');
            setBranches([]);
        } finally {
            setBranchLoading(false);
        }
    };

    // Fetch sessions for a branch
    const fetchSessionsForBranch = async (departmentId: string, courseName: string, branchShortForm: string) => {
        setSessionLoading(true);
        try {
            // Check if we already have departments data in localStorage
            const cachedData = localStorage.getItem('departmentsData');
            if (cachedData) {
                const parsedData = JSON.parse(cachedData) as DepartmentsResponse;
                const selectedDept = parsedData.departments.find(dept => dept._id === departmentId);

                if (selectedDept && selectedDept.branches) {
                    // Find the specific branch
                    const branch = selectedDept.branches.find(b =>
                        b.course === courseName && b.shortForm === branchShortForm
                    );

                    if (branch) {
                        // Map to the Session interface format expected by the component
                        const sessionData = branch.session.map(session => ({
                            _id: `session-${session}`,
                            session: session
                        }));

                        setSessions(sessionData);
                    } else {
                        setSessions([]);
                        console.warn('No sessions found for the selected branch');
                    }
                } else {
                    setSessions([]);
                    console.warn('No branches found in cached data for the selected department');
                }
            } else {
                // If no data in cache, fetch from API
                const data = await getSessionsByCourse(departmentId, courseName);
                // Filter the data for this specific branch if needed
                setSessions(data.sessions || []);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
            toast.error('Failed to load sessions');
            setSessions([]);
        } finally {
            setSessionLoading(false);
        }
    };

    // Function to update the localStorage with the latest department data
    const updateLocalStorage = (updatedDepartments: Department[]) => {
        const dataToStore: DepartmentsResponse = {
            status: "success",
            departments: updatedDepartments
        };
        localStorage.setItem('departmentsData', JSON.stringify(dataToStore));
    };

    // Validate session format based on course duration
    const validateSessionFormat = (session: string, duration?: number): boolean => {
        if (!session || !duration) return false;

        // Session should be in format YYYY-YY or YYYY-YYYY
        const sessionRegex = /^(\d{4})-(\d{2,4})$/;
        const match = session.match(sessionRegex);
        if (!match) return false;

        const startYear = parseInt(match[1], 10);
        const endPart = match[2];

        // If end part is 4 digits (YYYY-YYYY format)
        if (endPart.length === 4) {
            const endYear = parseInt(endPart, 10);
            return endYear - startYear === duration;
        }
        // If end part is 2 digits (YYYY-YY format)
        else if (endPart.length === 2) {
            const endYear = parseInt(`20${endPart}`, 10);
            return endYear - startYear === duration;
        }

        return false;
    };

    // Get expected end year based on start year and duration
    const getExpectedEndYear = (startYear: number, duration: number): string => {
        const fullEndYear = startYear + duration;
        return fullEndYear.toString().slice(-2); // Return last 2 digits for display
    };

    // Handle form submission to add a new session
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDepartment || !selectedCourse || !selectedBranch) {
            toast.error('Please select a department, course, and branch');
            return;
        }

        if (!newSession.trim()) {
            toast.error('Please enter a session before submitting');
            return;
        }

        setSubmitting(true);
        try {
            // Create the payload with the selected branch and the new session
            await addSession({
                departmentId: selectedDepartment,
                branchSessions: [
                    {
                        branchShortForm: selectedBranch,
                        sessions: [newSession.trim()]
                    }
                ]
            });

            toast.success('Session added successfully');
            setNewSession('');

            // After successful update, refresh the departments data to keep the cache up-to-date
            const newData = await getDepartments() as DepartmentsResponse;
            if (newData && newData.departments) {
                setDepartments(newData.departments);
                // Update localStorage with fresh data
                updateLocalStorage(newData.departments);
            }

            // Refresh the sessions list for the selected branch
            fetchSessionsForBranch(selectedDepartment, selectedCourse, selectedBranch);
        } catch (error: any) {
            console.error('Error adding session:', error);
            toast.error(error?.response?.data?.message || 'Failed to add session');
        } finally {
            setSubmitting(false);
        }
    };

    // Add new session with validation
    const addNewSession = () => {
        if (!newSession.trim()) {
            toast.error('Please enter a session');
            return;
        }

        if (!selectedDepartment || !selectedCourse || !selectedBranch) {
            toast.error('Please select a department, course, and branch first');
            return;
        }

        // Check if session already exists
        const sessionExists = sessions.some(s => s.session === newSession.trim());
        if (sessionExists) {
            toast.error('This session already exists');
            return;
        }

        // Validate session format based on course duration
        if (selectedCourseDuration) {
            if (!validateSessionFormat(newSession.trim(), selectedCourseDuration)) {
                // Extract start year for suggestion
                const startYearMatch = newSession.trim().match(/^(\d{4})/);
                let errorMsg = `Invalid session format. For a ${selectedCourseDuration}-year program, `;

                if (startYearMatch) {
                    const startYear = parseInt(startYearMatch[1], 10);
                    const expectedEndYear = getExpectedEndYear(startYear, selectedCourseDuration);
                    errorMsg += `the correct format should be "${startYear}-${expectedEndYear}" or "${startYear}-20${expectedEndYear}"`;
                } else {
                    errorMsg += `the format should be YYYY-YY or YYYY-YYYY with a ${selectedCourseDuration}-year difference`;
                }

                toast.error(errorMsg);
                return;
            }
        }

        // Handle the form submission to add the new session
        handleSubmit(new Event('submit') as any);
    };

    // Handle opening delete confirmation dialog
    const openDeleteModal = (session: Session) => {
        setSessionToDelete(session);
        setShowDeleteModal(true);
    };

    // Handle closing delete confirmation dialog
    const closeDeleteModal = () => {
        setSessionToDelete(null);
        setShowDeleteModal(false);
    };

    // Handle confirming session deletion
    const confirmDelete = async () => {
        if (!sessionToDelete || !selectedDepartment || !selectedBranch) return;

        setIsDeleting(true);
        try {
            await deleteSession(selectedDepartment, selectedBranch, sessionToDelete.session);
            toast.success(`Session "${sessionToDelete.session}" deleted successfully`);

            // After successful update, refresh the departments data to keep the cache up-to-date
            const newData = await getDepartments() as DepartmentsResponse;
            if (newData && newData.departments) {
                setDepartments(newData.departments);
                // Update localStorage with fresh data
                updateLocalStorage(newData.departments);
            }

            // Refresh the sessions list for the selected branch
            fetchSessionsForBranch(selectedDepartment, selectedCourse, selectedBranch);
        } catch (error: any) {
            console.error('Error deleting session:', error);
            toast.error(error?.response?.data?.message || 'Failed to delete session');
        } finally {
            setIsDeleting(false);
            closeDeleteModal();
        }
    };

    // Handle bulk session upload
    const handleBulkUpload = async (sessions: string[]) => {
        if (!sessions.length || !selectedDepartment || !selectedBranch) {
            toast.error('No sessions to upload or missing department/branch selection');
            return;
        }

        setIsUploading(true);

        try {
            // Use the addSession API to add bulk sessions
            await addSession({
                departmentId: selectedDepartment,
                branchSessions: [
                    {
                        branchShortForm: selectedBranch,
                        sessions: sessions
                    }
                ]
            });

            toast.success(`Successfully uploaded ${sessions.length} sessions`);

            // Reset states
            setShowBulkInputDialog(false);

            // Refresh the data
            const newData = await getDepartments() as DepartmentsResponse;
            if (newData && newData.departments) {
                setDepartments(newData.departments);
                updateLocalStorage(newData.departments);
            }

            // Refresh the sessions list for the selected branch
            fetchSessionsForBranch(selectedDepartment, selectedCourse, selectedBranch);
        } catch (error: any) {
            console.error('Error uploading sessions in bulk:', error);
            toast.error(error?.response?.data?.message || 'Failed to upload sessions');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Session Management</h1>

            <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                    {/* Department Selector Component */}
                    <DepartmentSelector
                        departments={departments}
                        selectedDepartment={selectedDepartment}
                        setSelectedDepartment={setSelectedDepartment}
                        loading={loading}
                    />

                    {/* Course Selector Component */}
                    <CourseSelector
                        courses={courses}
                        selectedCourse={selectedCourse}
                        setSelectedCourse={setSelectedCourse}
                        loading={courseLoading}
                        disabled={!selectedDepartment}
                    />

                    {/* Branch Selector Component */}
                    <BranchSelector
                        branches={branches}
                        selectedBranch={selectedBranch}
                        setSelectedBranch={setSelectedBranch}
                        loading={branchLoading}
                        disabled={!selectedCourse}
                    />
                </div>

                {/* Session List Component */}
                {selectedBranch && (
                    <SessionList
                        sessions={sessions}
                        sessionLoading={sessionLoading}
                        selectedBranch={selectedBranch}
                        onDeleteSession={openDeleteModal}
                    />
                )}

                {/* Add Session Form with integrated Bulk Upload button */}
                {selectedBranch && (
                    <div className="mt-4">
                        <AddSessionForm
                            newSession={newSession}
                            setNewSession={setNewSession}
                            addNewSession={addNewSession}
                            submitting={submitting}
                            selectedCourseDuration={selectedCourseDuration}
                            onBulkUpload={() => setShowBulkInputDialog(true)}
                        />
                    </div>
                )}
            </div>

            {/* Toast Messages */}
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Delete Confirmation Modal */}
            <DeleteSessionModal
                open={showDeleteModal}
                session={sessionToDelete}
                isDeleting={isDeleting}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
            />

            {/* Bulk Session Input Dialog */}
            <BulkSessionInput
                open={showBulkInputDialog}
                onClose={() => setShowBulkInputDialog(false)}
                onBulkUpload={handleBulkUpload}
                courseDuration={selectedCourseDuration}
                isUploading={isUploading}
                validateSessionFormat={validateSessionFormat}
            />
        </div>
    );
};

export default SessionManagement;