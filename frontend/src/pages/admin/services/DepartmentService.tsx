import React, { useState, useEffect } from 'react';
import { getDepartments } from '../../../api/services/Admin/admin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Department, DepartmentsResponse } from './DepartmentTypes';

// Import modularized components with consistent casing
import AddDepartmentForm from './adminComponents/department/AddDepartmentForm';
import DepartmentList from './adminComponents/department/DepartmentList';
import EditDepartmentModal from './adminComponents/department/EditDepartmentModal';
import DeleteDepartmentModal from './adminComponents/department/DeleteDepartmentModal';
import BulkImportModal from './adminComponents/department/BulkImportModal';

const DepartmentService: React.FC = () => {
    // State
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

    const [showBulkModal, setShowBulkModal] = useState(false);

    // Fetch departments on component mount
    useEffect(() => {
        fetchDepartments();
    }, []);

    // Function to fetch departments
    const fetchDepartments = async () => {
        setIsLoading(true);
        try {
            const data = await getDepartments() as DepartmentsResponse;
            if (data && data.departments) {
                setDepartments(data.departments);
            } else {
                setDepartments([]);
                console.error('Unexpected response format:', data);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Failed to load departments');
            setDepartments([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handler functions for modals
    const openEditModal = (department: Department) => {
        setDepartmentToEdit(department);
        setShowEditModal(true);
    };

    const openDeleteModal = (department: Department) => {
        setDepartmentToDelete(department);
        setShowDeleteModal(true);
    };

    const openBulkModal = () => {
        setShowBulkModal(true);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Department Management</h1>

            {/* Mobile tab switcher */}
            <div className="md:hidden mb-6">
                <div className="flex rounded-lg bg-gray-100 p-1">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'list'
                            ? 'bg-white text-blue-600 shadow'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Departments
                    </button>
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'add'
                            ? 'bg-white text-blue-600 shadow'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Add New
                    </button>
                </div>
            </div>

            {/* Main content stack - changed from grid to flex column */}
            <div className="flex flex-col gap-8">
                {/* Add Department Form */}
                <div className={`${activeTab === 'add' ? 'block' : 'hidden md:block'}`}>
                    <AddDepartmentForm
                        onDepartmentAdded={() => {
                            fetchDepartments();
                            setActiveTab('list');
                        }}
                        onShowBulkModal={openBulkModal}
                    />
                </div>

                {/* Department List */}
                <div className={`${activeTab === 'list' ? 'block' : 'hidden md:block'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Department List</h2>
                        <DepartmentList
                            departments={departments}
                            isLoading={isLoading}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                        />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditDepartmentModal
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                department={departmentToEdit}
                onSuccess={fetchDepartments}
            />

            <DeleteDepartmentModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                department={departmentToDelete}
                onSuccess={fetchDepartments}
            />

            <BulkImportModal
                open={showBulkModal}
                onClose={() => setShowBulkModal(false)}
                existingDepartments={departments}
                onSuccess={fetchDepartments}
            />

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default DepartmentService;