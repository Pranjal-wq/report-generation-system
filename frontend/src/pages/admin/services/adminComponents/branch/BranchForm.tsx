import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { addBranch } from '../../../../../api/services/Admin/admin';
import { Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FormDropdown from '../shared/FormDropdown';

interface Course {
    name: string;
    type?: string;
    duration?: number;
}

interface Department {
    _id: string;
    department: string;
    cn: string;
}

interface BranchFormProps {
    departmentId: string;
    courses: Course[];
    departments: Department[];
    onSuccess: () => void;
    onDepartmentChange: (departmentId: string) => void;
}

const BranchForm: React.FC<BranchFormProps> = ({
    departmentId,
    courses,
    departments,
    onSuccess,
    onDepartmentChange
}) => {
    const [branchName, setBranchName] = useState('');
    const [branchShortForm, setBranchShortForm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [branchDuration, setBranchDuration] = useState<number>(4);
    const [submitting, setSubmitting] = useState(false);

    // Track if dropdowns are open to manage z-index
    const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
    const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
    const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!departmentId || !branchName || !branchShortForm || !selectedCourse) {
            toast.error('Please fill all required fields');
            return;
        }

        setSubmitting(true);
        try {
            await addBranch({
                departmentId,
                branches: [{
                    program: branchName,
                    course: selectedCourse,
                    shortForm: branchShortForm,
                    duration: branchDuration
                }]
            });

            toast.success('Branch added successfully');
            resetForm();
            onSuccess();
        } catch (error: any) {
            console.error('Error adding branch:', error);
            toast.error(error?.response?.data?.message || 'Failed to add branch');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setBranchName('');
        setBranchShortForm('');
        setSelectedCourse('');
        setBranchDuration(4);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:shadow-blue-200 transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Add Branch</h2>
            <form onSubmit={handleSubmit}>
                <FormDropdown
                    id="department"
                    label="Department"
                    value={departmentId}
                    onChange={(e) => onDepartmentChange(e.target.value)}
                    options={[
                        { value: '', label: 'Select Department' },
                        ...departments.map(dept => ({
                            value: dept._id,
                            label: `${dept.department} (${dept.cn})`
                        }))
                    ]}
                    required={true}
                    helpText="Select a department to add branches to"
                    zIndex={30}
                    onFocus={() => setDepartmentDropdownOpen(true)}
                    onBlur={() => setDepartmentDropdownOpen(false)}
                />

                <FormDropdown
                    id="course"
                    label="Course"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    options={[
                        { value: '', label: 'Select Course' },
                        ...courses.map((course, index) => ({
                            value: course.name,
                            label: course.name
                        }))
                    ]}
                    required={true}
                    helpText="Select the course for this branch"
                    zIndex={20}
                    disabled={!departmentId || courses.length === 0}
                    onFocus={() => setCourseDropdownOpen(true)}
                    onBlur={() => setCourseDropdownOpen(false)}
                />

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center" htmlFor="branchName">
                        Branch Name <span className="text-red-600">*</span>
                        <Tooltip title="Enter the full name of the branch (e.g., Computer Science and Engineering)" arrow>
                            <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                                <HelpOutlineIcon fontSize="small" className="text-blue-500" />
                            </IconButton>
                        </Tooltip>
                    </label>
                    <input
                        type="text"
                        id="branchName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:shadow-outline focus:border-blue-400 transition-all duration-200"
                        placeholder="e.g., Computer Science and Engineering"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center" htmlFor="branchShortForm">
                        Branch Short Form <span className="text-red-600">*</span>
                        <Tooltip title="Enter the abbreviation for this branch (e.g., CSE)" arrow>
                            <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
                                <HelpOutlineIcon fontSize="small" className="text-blue-500" />
                            </IconButton>
                        </Tooltip>
                    </label>
                    <input
                        type="text"
                        id="branchShortForm"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:shadow-outline focus:border-blue-400 transition-all duration-200"
                        placeholder="e.g., CSE"
                        value={branchShortForm}
                        onChange={(e) => setBranchShortForm(e.target.value)}
                        required
                    />
                </div>

                <FormDropdown
                    id="branchDuration"
                    label="Duration (years)"
                    value={branchDuration.toString()}
                    onChange={(e) => setBranchDuration(parseInt(e.target.value))}
                    options={[2, 3, 4, 5].map(years => ({
                        value: years.toString(),
                        label: `${years} years`
                    }))}
                    helpText="Select the duration of this branch program in years"
                    zIndex={10}
                    onFocus={() => setDurationDropdownOpen(true)}
                    onBlur={() => setDurationDropdownOpen(false)}
                />

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:shadow-md hover:shadow-blue-400/50 transition-all ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={submitting || !departmentId}
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BranchForm;