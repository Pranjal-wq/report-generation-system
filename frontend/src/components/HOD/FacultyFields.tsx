import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { getDepartments, getFacultyAttendance } from "../../api/services/director/director";
import { getProfessorsByDepartment, getSubjectsByProfessor } from "../../api/services/Common";
import { useFacultyContext } from '../../context/FacultyContext';
import { useToast } from '../../context/ToastContext';
import { UserRound, Building2, BookOpen, Loader2, HelpCircle, Calendar, CalendarRange } from 'lucide-react';

interface Professor {
    name: string;
    employeeCode: string;
    role: string;
    department: string;
    abbreviation?: string;
    _id?: string
}

interface Subject {
    subject: {
        _id: string;
        subjectCode: string;
        subjectName: string;
        department: string;
        isElective: boolean;
    };
    branch: string;
    semester: string;
    section: string;
    location: string;
    course: string;
    session: string;
}

interface SubjectsResponse {
    status: string;
    message: string;
    data: Subject[];
}

interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    return (
        <div className="group relative inline-block">
            {children}
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute left-0 -top-2 -translate-y-full w-72 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50">
                {content}
                <div className="absolute -bottom-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
            </div>
        </div>
    );
}

const SelectionMethodCard = ({ method, icon: Icon, title, description, selected, onClick }: {
    method: string;
    icon: React.ElementType;
    title: string;
    description: string;
    selected: boolean;
    onClick: () => void;
}) => (
    <div
        onClick={onClick}
        className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${selected
            ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
            : 'bg-white border-2 border-gray-200 hover:border-blue-300'
            }`}
    >
        <div className="flex items-start space-x-4">
            <div className={`p-2 rounded-lg ${selected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <h3 className={`font-medium ${selected ? 'text-blue-900' : 'text-gray-900'}`}>{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
            <div className="flex items-center h-full">
                <input
                    type="radio"
                    name="facultyMethod"
                    value={method}
                    checked={selected}
                    onChange={() => { }}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
            </div>
        </div>
    </div>
);

const FacultyFields = forwardRef((props, ref) => {
    const [departments, setDepartments] = useState<any[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedProfessor, setSelectedProfessor] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [employeeCodeInput, setEmployeeCodeInput] = useState('');
    const [selectionMethod, setSelectionMethod] = useState('department');
    const { professors, subjects, setProfessors, setSubjects } = useFacultyContext();
    const [loadingProfessors, setLoadingProfessors] = useState(false);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await getDepartments();
                setDepartments(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDepartments();
    }, []);

    const handleDepartmentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const deptId = e.target.value;
        setSelectedDepartment(deptId);
        if (deptId) {
            setLoadingProfessors(true);
            try {
                const profs = await getProfessorsByDepartment(deptId);
                const facultyOnly = profs.filter((prof: Professor) => prof.role !== 'STU');
                setProfessors(facultyOnly);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingProfessors(false);
            }
        } else {
            setProfessors([]);
        }
        setSelectedProfessor('');
        setSubjects([]);
        setSelectedSubject('');
    };

    const handleProfessorChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const profId = e.target.value;
        setSelectedProfessor(profId);
        if (profId) {
            setLoadingSubjects(true);
            try {
                const response: SubjectsResponse = await getSubjectsByProfessor(profId);
                const subjectsAllOption = {
                    subject: {
                        _id: "ALL",
                        subjectCode: "",
                        subjectName: "ALL",
                        department: "",
                        isElective: false,
                    },
                    branch: "",
                    semester: "",
                    section: "",
                    location: "",
                    course: "",
                    session: "",
                };
                const subjectsData = [subjectsAllOption, ...response.data];
                setSubjects(subjectsData);
                setSelectedSubject("ALL");
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingSubjects(false);
            }
        } else {
            setSubjects([]);
            setSelectedSubject('');
        }
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubject(e.target.value);
    };

    const handleSubmit = async () => {
        let employeeCode = "";
        if (selectionMethod === 'employee') {
            employeeCode = employeeCodeInput;
        } else if (selectionMethod === 'department') {
            employeeCode = selectedProfessor;
        }
        if (!employeeCode) {
            toast.showError("Employee code is required", "faculty-missing-code");
            return null;
        }

        setIsSubmitting(true);
        toast.showInfo("Fetching faculty attendance data...", "faculty-report-loading");

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : new Date();
        const subjectParam =
            selectionMethod === 'department' && selectedSubject && selectedSubject !== "ALL"
                ? selectedSubject
                : undefined;

        try {
            const attendance = await getFacultyAttendance(employeeCode, start, end, subjectParam);
            toast.showSuccess("Faculty attendance data loaded successfully", "faculty-report-success");
            return {
                ...attendance,
                employeeCode, // <-- Added employeeCode property
                professorName: selectionMethod === 'department' ?
                    professors.find((prof: Professor) => prof.employeeCode === employeeCode)?.name :
                    "Faculty Member",
                startDate: start ? start.toLocaleDateString() : "All time",
                endDate: end.toLocaleDateString()
            };
        } catch (err) {
            console.error("Error getting attendance:", err);
            toast.showError("Failed to fetch faculty attendance data", "faculty-report-error");
            return null;
        } finally {
            setIsSubmitting(false);
        }
    };

    useImperativeHandle(ref, () => ({
        submitAttendance: handleSubmit,
        isSubmitting
    }));

    const SelectField = ({ id, label, value, onChange, options, loading, disabled, icon: Icon, tooltip }: any) => (
        <div className="space-y-2">
            <label htmlFor={id} className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {tooltip && (
                    <Tooltip content={tooltip}>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
                    </Tooltip>
                )}
            </label>
            <div className="relative">
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    disabled={disabled || loading}
                    className="w-full rounded-lg border-2 border-gray-400 shadow-sm px-3 py-2 focus:border-blue-600 focus:ring-blue-500 bg-white transition duration-150 ease-in-out hover:border-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                    {options}
                </select>
                {loading && (
                    <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-6 bg-gray-50 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectionMethodCard
                    method="department"
                    icon={Building2}
                    title="Search by Department"
                    description="Select faculty members from specific departments and their subjects"
                    selected={selectionMethod === 'department'}
                    onClick={() => setSelectionMethod('department')}
                />
                <SelectionMethodCard
                    method="employee"
                    icon={UserRound}
                    title="Search by Employee Code"
                    description="Directly search using faculty employee code"
                    selected={selectionMethod === 'employee'}
                    onClick={() => setSelectionMethod('employee')}
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                {selectionMethod === 'department' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SelectField
                            id="facultyDepartment"
                            label="Department"
                            value={selectedDepartment}
                            onChange={handleDepartmentChange}
                            icon={Building2}
                            tooltip="Select a department to proceed with further selections"
                            options={[
                                <option key="default" value="">Select Department</option>,
                                ...departments.map((dept, index) => (
                                    <option key={`${dept._id}-${index}`} value={dept._id}>{dept._id}</option>
                                ))
                            ]}
                        />

                        <SelectField
                            id="professor"
                            label="Professor"
                            value={selectedProfessor}
                            onChange={handleProfessorChange}
                            loading={loadingProfessors}
                            disabled={!selectedDepartment}
                            icon={UserRound}
                            tooltip="Select a professor to view their subjects"
                            options={[
                                <option key="default" value="">Select Professor</option>,
                                ...(loadingProfessors
                                    ? [<option key="loading" disabled>Loading professors...</option>]
                                    : professors.map((prof: Professor, index: number) => (
                                        <option key={`${prof.employeeCode}-${index}`} value={prof.employeeCode}>
                                            {`${prof.name} (${prof.abbreviation || prof.employeeCode}) - ${prof.role}`}
                                        </option>
                                    ))
                                )
                            ]}
                        />

                        <SelectField
                            id="subject"
                            label="Subject"
                            value={selectedSubject}
                            onChange={handleSubjectChange}
                            loading={loadingSubjects}
                            disabled={!selectedProfessor}
                            icon={BookOpen}
                            tooltip="Select specific subjects or view all"
                            options={[
                                <option key="default" value="">Select Subject</option>,
                                ...(loadingSubjects
                                    ? [<option key="loading" disabled>Loading subjects...</option>]
                                    : subjects.map((subjectData: Subject, index: number) => (
                                        <option key={`${subjectData.subject._id}-${index}`} value={subjectData.subject._id}>
                                            {`${subjectData.subject.subjectName} (${subjectData.subject.subjectCode})`}
                                        </option>
                                    ))
                                )
                            ]}
                        />
                    </div>
                ) : (
                    <div className="max-w-md">
                        <div className="space-y-2">
                            <label htmlFor="employeeCodeInput" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <UserRound className="w-4 h-4" />
                                <span>Employee Code</span>
                            </label>
                            <input
                                type="text"
                                id="employeeCodeInput"
                                value={employeeCodeInput}
                                onChange={(e) => setEmployeeCodeInput(e.target.value)}
                                className="w-full rounded-lg border-2 border-gray-400 shadow-sm px-3 py-2 focus:border-blue-600 focus:ring-blue-500 bg-white transition duration-150 ease-in-out hover:border-gray-500"
                                placeholder="Enter Employee Code"
                            />
                        </div>
                    </div>
                )}

                <div className="border-t pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                        <div className="space-y-2">
                            <label htmlFor="startDate" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Calendar className="w-4 h-4" />
                                <span>Start Date</span>
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white p-2.5 text-sm transition duration-150 ease-in-out hover:border-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="endDate" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <CalendarRange className="w-4 h-4" />
                                <span>End Date</span>
                                <Tooltip content="Defaults to today if left blank">
                                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
                                </Tooltip>
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white p-2.5 text-sm transition duration-150 ease-in-out hover:border-gray-400"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default FacultyFields;