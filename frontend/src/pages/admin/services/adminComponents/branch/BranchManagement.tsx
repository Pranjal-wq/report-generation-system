import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { getDepartments } from '../../../../../api/services/Admin/admin';
import BranchForm from './BranchForm';
import BranchList from './BranchList';
import BranchBulkImportModal from './BranchBulkImportModal';
import FormDropdown from '../shared/FormDropdown';
// Import Material-UI components
import { Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Branch {
    program: string;
    course: string;
    shortForm: string;
    duration: number;
    session?: string[];
}

interface DepartmentBranch {
    course: string;
    program: string;
    shortForm: string;
    session: string[];
    duration: number;
}

interface Course {
    name: string;
    type?: string;
    duration?: number;
}

interface Department {
    _id: string;
    department: string;
    cn: string;
    branches?: DepartmentBranch[];
    courses?: Course[];
}

interface DepartmentsResponse {
    status: string;
    departments: Department[];
}

const BranchManagement: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [addDepartment, setAddDepartment] = useState<string>('');
    const [viewDepartment, setViewDepartment] = useState<string>('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(false);
    const [branchLoading, setBranchLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('add'); // 'add' or 'view'
    const [showBulkModal, setShowBulkModal] = useState(false);

    // Track if department dropdowns are open to manage z-index
    const [viewDeptDropdownOpen, setViewDeptDropdownOpen] = useState(false);

    useEffect(() => {
        // Load departments when component mounts
        refreshDepartmentsData();
    }, []);

    // When add department changes, fetch courses for form
    useEffect(() => {
        if (addDepartment) {
            fetchCourses(addDepartment);
        } else {
            setCourses([]);
        }
    }, [addDepartment]);

    // When view department changes, fetch branches
    useEffect(() => {
        if (viewDepartment) {
            fetchAllBranches(viewDepartment);
        } else {
            setBranches([]);
        }
    }, [viewDepartment]);

    // Function to refresh departments data and update localStorage
    const refreshDepartmentsData = async () => {
        setLoading(true);
        try {
            const data = await getDepartments() as DepartmentsResponse;
            if (data && data.departments) {
                setDepartments(data.departments);
                updateLocalStorage(data.departments);
                return data.departments;
            } else {
                setDepartments([]);
                console.error('Unexpected response format:', data);
                return [];
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
            setDepartments([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async (departmentId: string) => {
        setLoading(true);
        try {
            // Find the selected department in our local data
            const cachedData = localStorage.getItem('departmentsData');
            if (cachedData) {
                const parsedData = JSON.parse(cachedData) as DepartmentsResponse;
                const selectedDept = parsedData.departments.find(dept => dept._id === departmentId);
                if (selectedDept && selectedDept.courses) {
                    setCourses(selectedDept.courses);
                } else {
                    setCourses([]);
                }
            } else {
                setCourses([]);
            }
        } catch (error) {
            console.error('Error fetching courses from cache:', error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllBranches = async (departmentId: string) => {
        setBranchLoading(true);
        try {
            // Find the selected department in our local data
            const cachedData = localStorage.getItem('departmentsData');
            if (cachedData) {
                const parsedData = JSON.parse(cachedData) as DepartmentsResponse;
                const selectedDept = parsedData.departments.find(dept => dept._id === departmentId);

                if (selectedDept && selectedDept.branches) {
                    // Map all branches with sessions included
                    const allBranches = selectedDept.branches.map(branch => ({
                        program: branch.program,
                        course: branch.course,
                        shortForm: branch.shortForm,
                        duration: branch.duration,
                        session: branch.session // Include sessions for each branch
                    }));

                    setBranches(allBranches);
                } else {
                    setBranches([]);
                }
            } else {
                setBranches([]);
            }
        } catch (error) {
            console.error('Error fetching branches from cache:', error);
            setBranches([]);
        } finally {
            setBranchLoading(false);
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

    const handleRefresh = async () => {
        await refreshDepartmentsData();
        if (addDepartment) {
            fetchCourses(addDepartment);
        }
        if (viewDepartment) {
            fetchAllBranches(viewDepartment);
        }
    };

    const handleAddDepartmentChange = (newDepartmentId: string) => {
        setAddDepartment(newDepartmentId);
    };

    const openBulkUploadModal = () => {
        setShowBulkModal(true);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-800">Branch Management</h1>

                <div className="space-x-2 flex items-center">
                    <Tooltip title="Refresh data" arrow placement="top">
                        <IconButton
                            onClick={handleRefresh}
                            size="small"
                            color="primary"
                            aria-label="refresh"
                            className="hover:shadow-lg hover:shadow-blue-200 transition-shadow"
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>

            {/* Mobile Tab Selector */}
            <div className="block sm:hidden mb-6">
                <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-lg shadow-md shadow-blue-100">
                    <button
                        className={`py-2 rounded-md transition-all duration-200 ${activeTab === 'add' ? 'bg-white shadow-md shadow-blue-300' : 'text-gray-600 hover:bg-blue-50'}`}
                        onClick={() => setActiveTab('add')}
                    >
                        Add Branch
                    </button>
                    <button
                        className={`py-2 rounded-md transition-all duration-200 ${activeTab === 'view' ? 'bg-white shadow-md shadow-blue-300' : 'text-gray-600 hover:bg-blue-50'}`}
                        onClick={() => setActiveTab('view')}
                    >
                        View Branches
                    </button>
                </div>
            </div>

            <div className="grid sm:grid-cols-1 gap-8">
                {/* Add Branch Form - visible on desktop, or when 'add' tab is active on mobile */}
                <div className={`${activeTab !== 'add' ? 'hidden sm:block' : ''}`}>
                    <BranchForm
                        departmentId={addDepartment}
                        courses={courses}
                        departments={departments}
                        onSuccess={handleRefresh}
                        onDepartmentChange={handleAddDepartmentChange}
                    />
                </div>

                {/* Branch List - visible on desktop, or when 'view' tab is active on mobile */}
                <div className={`${activeTab !== 'view' ? 'hidden sm:block' : ''}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:shadow-blue-200 transition-shadow">
                        <h2 className="text-xl font-semibold mb-4 text-blue-700">View Branches</h2>

                        <FormDropdown
                            id="viewDepartment"
                            label="Department"
                            value={viewDepartment}
                            onChange={(e) => setViewDepartment(e.target.value)}
                            options={[
                                { value: '', label: 'Select Department' },
                                ...departments.map(dept => ({
                                    value: dept._id,
                                    label: `${dept.department} (${dept.cn})`
                                }))
                            ]}
                            helpText="Select a department to view its branches"
                            zIndex={30}
                            disabled={loading}
                            onFocus={() => setViewDeptDropdownOpen(true)}
                            onBlur={() => setViewDeptDropdownOpen(false)}
                        />

                        <BranchList
                            departmentId={viewDepartment}
                            branches={branches}
                            loading={branchLoading}
                            onDelete={handleRefresh}
                        />
                    </div>
                </div>
            </div>

            {/* Bulk Import Modal */}
            <BranchBulkImportModal
                open={showBulkModal}
                onClose={() => setShowBulkModal(false)}
                departmentId={viewDepartment}
                existingBranches={branches}
                onSuccess={handleRefresh}
            />

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default BranchManagement;