import React, { useState, useEffect } from 'react';
import {
    getDepartments,
    getStudentsByClass,
    addStudent,
    addStudentsBulk
} from '../../../api/services/Admin/admin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Department {
    _id: string;
    department: string;
    cn: string;
    branches: Branch[];
    courses: Course[];
    updatedAt?: string;
    createdAt?: string;
}

interface Course {
    name: string;
    type: string;
    duration: number;
    _id?: string;
}

interface Branch {
    program: string;
    course: string;
    shortForm: string;
    session: string[];
    duration: number;
}

interface Student {
    _id: string;
    scholarNumber: string;
    StudentName: string;
    branch: string;
    section: string;
    batch: string;
    department: string;
}

const StudentService: React.FC = () => {
    // Form state
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [sessions, setSessions] = useState<string[]>([]);
    const [selectedSession, setSelectedSession] = useState('');
    const [sections, setSections] = useState<string[]>(['A', 'B', 'C', 'D']);
    const [selectedSection, setSelectedSection] = useState('');

    // Student state
    const [scholarNumber, setScholarNumber] = useState('');
    const [studentName, setStudentName] = useState('');
    const [isBulkUpload, setIsBulkUpload] = useState(false);
    const [bulkStudentData, setBulkStudentData] = useState('');

    // List state
    const [students, setStudents] = useState<Student[]>([]);    // Loading states
    const [loading, setLoading] = useState(false);
    const [studentLoading, setStudentLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    // Update courses when department changes
    useEffect(() => {
        if (selectedDepartment) {
            // Find selected department in the departments array
            const department = departments.find(dept => dept._id === selectedDepartment);            if (department) {
                // Set courses from the department data
                setCourses(department.courses.map(course => ({
                    _id: course.name, // Using name as ID since it's unique within a department
                    name: course.name,
                    type: course.type,
                    duration: course.duration
                })));
            }
        } else {
            setCourses([]);
            setSelectedCourse('');
        }
    }, [selectedDepartment, departments]);    // Update branches when course changes
    useEffect(() => {
        if (selectedDepartment && selectedCourse) {
            // Find selected department
            const department = departments.find(dept => dept._id === selectedDepartment);
            
            if (department) {
                // Filter branches by the selected course
                const filteredBranches = department.branches.filter(branch => 
                    branch.course === selectedCourse
                );
                
                setBranches(filteredBranches);
                
                // Reset branch selection when course changes
                setSelectedBranch('');
                setSelectedSession('');
            }
        } else {
            setBranches([]);
            setSessions([]);
            setSelectedBranch('');
            setSelectedSession('');
        }
    }, [selectedDepartment, selectedCourse, departments]);

    // Update sections dynamically when branch changes
    useEffect(() => {
        if (selectedBranch) {
            // Keep the sections the same, but this makes clear the relationship
            // and gives us a place to dynamically update sections in the future if needed
            setSections(['A', 'B', 'C', 'D']);
        }
    }, [selectedBranch]);

    // Update sessions when branch changes
    useEffect(() => {
        if (selectedBranch && selectedDepartment) {
            const department = departments.find(dept => dept._id === selectedDepartment);
            if (department) {
                const selectedBranchObj = department.branches.find(branch => 
                    branch.shortForm === selectedBranch
                );
                
                if (selectedBranchObj) {
                    // Use sessions specific to the selected branch
                    setSessions(selectedBranchObj.session.length > 0 
                        ? selectedBranchObj.session 
                        : ['2022-26', '2023-27', '2024-28']);
                }
            }
        } else {
            setSessions([]);
            setSelectedSession('');
        }
    }, [selectedBranch, selectedDepartment, departments]);

    // Fetch students when all parameters are set
    useEffect(() => {
        if (selectedDepartment && selectedCourse && selectedBranch && selectedSession && selectedSection) {
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [selectedDepartment, selectedCourse, selectedBranch, selectedSession, selectedSection]);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const data = await getDepartments();
            setDepartments(data.departments);
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Failed to load departments');
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        if (!selectedDepartment || !selectedCourse || !selectedBranch || !selectedSession || !selectedSection) {
            return;
        }

        setStudentLoading(true);
        try {
            const data = await getStudentsByClass(
                selectedDepartment,
                selectedCourse,
                selectedBranch,
                selectedSession,
                selectedSection
            );
            setStudents(data.students || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to load students');
            setStudents([]);
        } finally {
            setStudentLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDepartment || !selectedBranch || !selectedSession || !selectedSection) {
            toast.error('Please complete all required fields');
            return;
        }

        setSubmitting(true);
        try {
            if (isBulkUpload) {
                // Process bulk upload
                let parsedData: any[] = [];

                try {
                    // Try parsing as JSON
                    parsedData = JSON.parse(bulkStudentData);
                } catch (e) {
                    // If not JSON, try parsing as CSV
                    const rows = bulkStudentData.trim().split('\n');
                    parsedData = rows.map(row => {
                        const [scholarNumber, StudentName] = row.split(',').map(item => item.trim());
                        return {
                            scholarNumber,
                            StudentName,
                            branch: selectedBranch,
                            section: selectedSection,
                            batch: selectedSession,
                            department: selectedDepartment
                        };
                    });
                }

                // Add default values for any missing fields
                parsedData = parsedData.map(student => ({
                    scholarNumber: student.scholarNumber,
                    StudentName: student.StudentName,
                    branch: student.branch || selectedBranch,
                    section: student.section || selectedSection,
                    batch: student.batch || selectedSession,
                    department: student.department || selectedDepartment
                }));

                await addStudentsBulk({ students: parsedData });
                toast.success('Students added successfully!');
                setBulkStudentData('');
            } else {
                // Single student upload
                if (!scholarNumber || !studentName) {
                    toast.error('Scholar number and name are required');
                    return;
                }

                await addStudent({
                    scholarNumber,
                    StudentName: studentName,
                    branch: selectedBranch,
                    section: selectedSection,
                    batch: selectedSession,
                    department: selectedDepartment
                });

                toast.success('Student added successfully!');
                setScholarNumber('');
                setStudentName('');
            }

            // Refresh student list
            fetchStudents();
        } catch (error: any) {
            console.error('Error adding student(s):', error);
            toast.error(error?.response?.data?.message || 'Failed to add student(s)');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Student Management</h1>
                <button
                    onClick={() => setIsBulkUpload(!isBulkUpload)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    {isBulkUpload ? 'Add Single Student' : 'Bulk Upload'}
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Add Student Form */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                        {isBulkUpload ? 'Add Multiple Students' : 'Add Student'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                                    Department <span className="text-red-600">*</span>
                                </label>
                                <select
                                    id="department"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    disabled={loading}
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

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="course">
                                    Course <span className="text-red-600">*</span>
                                </label>                                <select
                                    id="course"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    disabled={loading || !selectedDepartment}
                                    required
                                >                                    <option value="">Select Course</option>
                                    {courses.map((course) => (
                                        <option key={course._id} value={course.name}>
                                            {course.name} ({course.type}, {course.duration} year{course.duration > 1 ? 's' : ''})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="branch">
                                    Branch <span className="text-red-600">*</span>
                                </label>
                                <select
                                    id="branch"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={selectedBranch}
                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                    disabled={!selectedCourse}
                                    required
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map((branch, index) => (
                                        <option key={index} value={branch.shortForm}>
                                            {branch.program} ({branch.shortForm})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="session">
                                    Session <span className="text-red-600">*</span>
                                </label>
                                <select
                                    id="session"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={selectedSession}
                                    onChange={(e) => setSelectedSession(e.target.value)}
                                    disabled={!selectedBranch}
                                    required
                                >
                                    <option value="">Select Session</option>
                                    {sessions.map((session) => (
                                        <option key={session} value={session}>
                                            {session}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="section">
                                    Section <span className="text-red-600">*</span>
                                </label>
                                <select
                                    id="section"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    disabled={!selectedSession}
                                    required
                                >
                                    <option value="">Select Section</option>
                                    {sections.map((section) => (
                                        <option key={section} value={section}>
                                            {section}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {!isBulkUpload ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scholarNumber">
                                        Scholar Number <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="scholarNumber"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="e.g., 0901CS101234"
                                        value={scholarNumber}
                                        onChange={(e) => setScholarNumber(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="studentName">
                                        Student Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="studentName"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="e.g., John Doe"
                                        value={studentName}
                                        onChange={(e) => setStudentName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bulkData">
                                    Bulk Upload (JSON or CSV format)
                                </label>
                                <textarea
                                    id="bulkData"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                                    placeholder={`For JSON: [{"scholarNumber": "0901CS101234", "StudentName": "John Doe"}]\n\nFor CSV:\n0901CS101234, John Doe\n0901CS101235, Jane Smith`}
                                    value={bulkStudentData}
                                    onChange={(e) => setBulkStudentData(e.target.value)}
                                    required
                                />
                                <p className="text-sm text-gray-600 mt-1">
                                    Note: Department, Branch, Section, and Session will be automatically applied to all records.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${submitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Student List */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Student List</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="sm:col-span-3">
                            <p className="text-sm text-gray-600">
                                Select department, course, branch, session, and section above to view students.
                            </p>
                        </div>
                    </div>

                    {studentLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                        </div>
                    ) : !selectedDepartment || !selectedCourse || !selectedBranch || !selectedSession || !selectedSection ? (
                        <p className="text-gray-500 text-center py-8">Complete the selections to view students</p>
                    ) : students.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No students found for the selected criteria</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Scholar Number
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Section
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student._id} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border-b border-gray-200">{student.scholarNumber}</td>
                                            <td className="py-2 px-4 border-b border-gray-200">{student.StudentName}</td>
                                            <td className="py-2 px-4 border-b border-gray-200">{student.section}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default StudentService;