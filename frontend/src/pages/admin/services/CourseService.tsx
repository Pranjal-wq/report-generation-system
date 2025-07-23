import React, { useState, useEffect } from 'react';
import { getDepartments, getCoursesByDepartment, addCourse, deleteCourse } from '../../../api/services/Admin/admin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';

interface Department {
    _id: string;
    department: string;
    cn: string;
}

interface Course {
    _id: string;
    name: string;
    courseType?: string; // UG, PG, etc.
    customCourseType?: string; // Custom course type
    customName?: string; // Custom course name
    
    duration?: number; // Duration in years
}

interface DepartmentsResponse {
    status: string;
    departments: Department[];
}

const CourseService: React.FC = () => {
    // State for departments and selection
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [departmentLoading, setDepartmentLoading] = useState(false);

    // State for courses
    const [courses, setCourses] = useState<Course[]>([]);
    const [coursesLoading, setCoursesLoading] = useState(false);

    // State for form input
    const [courseInputs, setCourseInputs] = useState<{
        name: string;
        courseType: string;
        customCourseType?: string;
        customName?: string;
        duration: number;
    }[]>([{ name: 'B.Tech', courseType: 'UG', duration: 4 }]); // Array to store course inputs with type and duration
    const [submitting, setSubmitting] = useState(false);

    // State for course deletion
    const [isDeleting, setIsDeleting] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Fetch departments on component mount
    useEffect(() => {
        refreshDepartmentsData();
    }, []);

    // Fetch courses when department selection changes
    useEffect(() => {
        if (selectedDepartment) {
            fetchCoursesByDepartment(selectedDepartment);
        } else {
            setCourses([]);
        }
    }, [selectedDepartment]);

    // Function to refresh departments data and update localStorage
    const refreshDepartmentsData = async () => {
        setDepartmentLoading(true);
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
            setDepartmentLoading(false);
        }
    };

    const fetchDepartments = async () => {
        setDepartmentLoading(true);
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
                if (parsedData && parsedData.departments && parsedData.departments.length > 0) {
                    setDepartments(parsedData.departments);
                }
            }
        } catch (error) {
            console.error('Error in fetchDepartments:', error);
        } finally {
            setDepartmentLoading(false);
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

    const fetchCoursesByDepartment = async (departmentId: string) => {
        setCoursesLoading(true);
        try {
            // First try the API call
            const data = await getCoursesByDepartment(departmentId);
            if (data && data.courses && data.courses.length > 0) {
                setCourses(data.courses || []);
            } else {
                // If API returns no courses or fails, try getting from localStorage
                const cachedData = localStorage.getItem('departmentsData');
                if (cachedData) {
                    const parsedData = JSON.parse(cachedData) as DepartmentsResponse;
                    const department = parsedData.departments.find(dept => dept._id === departmentId);
                    if (department && department.courses) {
                        // Transform the courses format to match our Course interface
                        const transformedCourses: Course[] = department.courses.map((course: any, index: number) => ({
                            _id: `local_${index}`,
                            name: course.name,
                            courseType: course.type,
                            duration: course.duration
                        }));
                        setCourses(transformedCourses);
                    } else {
                        setCourses([]);
                    }
                } else {
                    setCourses([]);
                }
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to load courses for the selected department');

            // Fallback to localStorage
            const cachedData = localStorage.getItem('departmentsData');
            if (cachedData) {
                const parsedData = JSON.parse(cachedData) as DepartmentsResponse;
                const department = parsedData.departments.find(dept => dept._id === departmentId);
                if (department && department.courses) {
                    // Transform the courses format to match our Course interface
                    const transformedCourses: Course[] = department.courses.map((course: any, index: number) => ({
                        _id: `local_${index}`,
                        name: course.name,
                        courseType: course.courseType,
                        duration: course.duration
                    }));
                    setCourses(transformedCourses);
                } else {
                    setCourses([]);
                }
            } else {
                setCourses([]);
            }
        } finally {
            setCoursesLoading(false);
        }
    };

    const handleCourseInputChange = (index: number, field: string, value: string | number) => {
        const updatedInputs = [...courseInputs];
        updatedInputs[index] = { ...updatedInputs[index], [field]: value };
        setCourseInputs(updatedInputs);
    };

    const addCourseInput = () => {
        setCourseInputs([...courseInputs, { name: 'B.Tech', courseType: 'UG', duration: 4 }]);
    };

    const removeCourseInput = (index: number) => {
        if (courseInputs.length > 1) {
            const updatedInputs = courseInputs.filter((_, i) => i !== index);
            setCourseInputs(updatedInputs);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate inputs
        if (!selectedDepartment) {
            toast.error('Please select a department');
            return;
        }

        // Filter out empty inputs and check if any are left
        const validCourses = courseInputs.filter(course => course.name.trim() !== '');
        if (validCourses.length === 0) {
            toast.error('Please enter at least one course name');
            return;
        }

        setSubmitting(true);
        try {
            // Process each course individually with the correct payload format
            let successCount = 0;
            for (const course of validCourses) {
                // Handle custom course name if "Other" is selected
                const finalCourseName = course.name === 'Other' && course.customName 
                    ? course.customName 
                    : course.name;
                
                // Handle custom course type if "Other" is selected
                const finalCourseType = course.courseType === 'Other' && course.customCourseType
                    ? course.customCourseType
                    : course.courseType;

                const response = await addCourse({
                    departmentId: selectedDepartment,
                    courseName: finalCourseName,
                    courseType: finalCourseType,
                    duration: course.duration
                });

                if (response && response.status === "success") {
                    successCount++;
                }
            }

            // Provide more specific feedback on success
            if (successCount === validCourses.length) {
                toast.success(`All ${successCount} courses added successfully!`);
            } else if (successCount > 0) {
                toast.info(`${successCount} out of ${validCourses.length} courses added successfully.`);
            } else {
                toast.warning('Courses were processed but may not have been added.');
            }

            // Reset form
            setCourseInputs([{ name: 'B.Tech', courseType: 'UG', duration: 4 }]);

            // Wait a moment before refreshing the course list to ensure API consistency
            setTimeout(async () => {
                await refreshDepartmentsData();
                // Then refresh the courses view
                if (selectedDepartment) {
                    await fetchCoursesByDepartment(selectedDepartment);
                }
            }, 500);

        } catch (error: any) {
            console.error('Error adding courses:', error);
            toast.error(error?.response?.data?.message || 'Failed to add courses');
        } finally {
            setSubmitting(false);
        }
    };

    // Delete course handlers
    const openDeleteModal = (course: Course) => {
        setCourseToDelete(course);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setCourseToDelete(null);
        setShowDeleteModal(false);
    };

    const confirmDelete = async () => {
        if (!courseToDelete || !selectedDepartment) return;

        setIsDeleting(true);
        try {
            const response = await deleteCourse(selectedDepartment, courseToDelete.name);
            
            if (response && response.status === "success") {
                // Immediately update the local state to reflect the deletion
                setCourses(prevCourses => prevCourses.filter(course => course._id !== courseToDelete._id));
                toast.success(`Course "${courseToDelete.name}" deleted successfully`);
                
                // Close the modal right away to improve user experience
                closeDeleteModal();
                
                // Then refresh data to ensure consistency with server
                setTimeout(async () => {
                    await refreshDepartmentsData();
                    await fetchCoursesByDepartment(selectedDepartment);
                }, 300);
            } else {
                toast.error("Failed to delete course. Server returned an invalid response.");
            }
        } catch (error: any) {
            console.error('Error deleting course:', error);
            toast.error(error?.response?.data?.message || 'Failed to delete course');
        } finally {
            setIsDeleting(false);
            if (showDeleteModal) {
                closeDeleteModal();
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Course Management</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Add Course Form */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Add Courses</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                                Step 1: Select Department <span className="text-red-600">*</span>
                            </label>
                            <select
                                id="department"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                disabled={departmentLoading}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept._id} value={dept._id}>
                                        {dept.department} ({dept.cn})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Step 2: Add Multiple Courses <span className="text-red-600">*</span>
                            </label>

                            {courseInputs.map((course, index) => (
                                <div key={index} className="mb-4">
                                    <div className="flex mb-2">
                                        <select
                                            className="shadow appearance-none border rounded flex-grow py-2 px-3 mr-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={course.name}
                                            onChange={(e) => handleCourseInputChange(index, 'name', e.target.value)}
                                            required={index === 0}
                                        >
                                            <option value="B.Tech">B.Tech</option>
                                            <option value="M.Tech">M.Tech</option>
                                            <option value="MBA">MBA</option>
                                            <option value="PhD">PhD</option>
                                            <option value="Other">Other (Custom)</option>
                                        </select>
                                        {course.name === 'Other' && (
                                            <input
                                                type="text"
                                                className="shadow appearance-none border rounded flex-grow py-2 px-3 mr-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder="Enter custom course name"
                                                value={course.customName || ''}
                                                onChange={(e) => handleCourseInputChange(index, 'customName', e.target.value)}
                                                required={course.name === 'Other'}
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeCourseInput(index)}
                                            className={`px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition ${courseInputs.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={courseInputs.length === 1}
                                        >
                                            -
                                        </button>
                                    </div>
                                    <div className="flex mb-2">
                                        <select
                                            className="shadow appearance-none border rounded flex-grow py-2 px-3 mr-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={course.courseType}
                                            onChange={(e) => handleCourseInputChange(index, 'courseType', e.target.value)}
                                        >
                                            <option value="UG">UG</option>
                                            <option value="PG">PG</option>
                                            <option value="DD">DualDegree</option>
                                            <option value="Other">Other (Custom)</option>
                                        </select>
                                        <input
                                            type="number"
                                            className="shadow appearance-none border rounded flex-grow py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Duration (Years)"
                                            value={course.duration}
                                            onChange={(e) => handleCourseInputChange(index, 'duration', Number(e.target.value))}
                                        />
                                    </div>
                                    {course.courseType === 'Other' && (
                                        <div className="mb-2">
                                            <input
                                                type="text"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder="Enter custom course type"
                                                value={course.customCourseType || ''}
                                                onChange={(e) => handleCourseInputChange(index, 'customCourseType', e.target.value)}
                                                required={course.courseType === 'Other'}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addCourseInput}
                                className="mt-2 flex items-center text-blue-600 hover:text-blue-800 transition"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Add Another Course
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={submitting || !selectedDepartment}
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Course List */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Course List</h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Select a department to view its courses
                        </label>
                        {selectedDepartment ? (
                            <>
                                <div className="text-sm text-gray-600 mb-4">
                                    Showing courses for: {departments.find(d => d._id === selectedDepartment)?.department}
                                </div>

                                {coursesLoading ? (
                                    <div className="flex justify-center items-center h-32">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                                    </div>
                                ) : courses.length === 0 ? (
                                    <p className="text-gray-500 py-4">No courses found for this department</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white">
                                            <thead>
                                                <tr>
                                                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Course Name
                                                    </th>
                                                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Course Type
                                                    </th>
                                                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Duration (Years)
                                                    </th>
                                                    <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {courses.map((course) => (
                                                    <tr key={course._id} className="hover:bg-gray-50">
                                                        <td className="py-2 px-4 border-b border-gray-200">{course.name}</td>
                                                        <td className="py-2 px-4 border-b border-gray-200">{course.courseType || 'N/A'}</td>
                                                        <td className="py-2 px-4 border-b border-gray-200">{course.duration || 'N/A'}</td>
                                                        <td className="py-2 px-4 border-b border-gray-200 text-center">
                                                            <button
                                                                onClick={() => openDeleteModal(course)}
                                                                className="text-red-600 hover:text-red-800 transition"
                                                                aria-label={`Delete ${course.name} course`}
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-500 py-4">Please select a department to view its courses</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && courseToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <div className="flex items-center text-red-600 mb-4">
                            <FaExclamationTriangle size={24} className="mr-2" />
                            <h3 className="text-lg font-bold">Delete Course</h3>
                        </div>
                        <p className="mb-6">
                            Are you sure you want to delete the course <span className="font-semibold">{courseToDelete?.name}</span>?
                            This action will delete all associated branches, sessions, and student data. This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default CourseService;
