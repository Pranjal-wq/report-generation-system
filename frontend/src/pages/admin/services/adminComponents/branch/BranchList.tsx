import React, { useState, useEffect } from 'react';
import { FaTrash, FaExclamationTriangle, FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { deleteBranch } from '../../../../../api/services/Admin/admin';
import { toast } from 'react-toastify';

interface Branch {
    program: string;
    course: string;
    shortForm: string;
    duration: number;
    session?: string[];
}

interface GroupedData {
    [key: string]: {
        branch: Branch;
        courses: { [courseName: string]: string[] }; // course name -> sessions
    };
}

interface BranchListProps {
    departmentId: string;
    branches: Branch[];
    loading: boolean;
    onDelete: () => void;
}

const BranchList: React.FC<BranchListProps> = ({
    departmentId,
    branches,
    loading,
    onDelete
}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [groupedData, setGroupedData] = useState<GroupedData>({});
    const [expandedBranches, setExpandedBranches] = useState<{ [key: string]: boolean }>({});
    const [expandedCourses, setExpandedCourses] = useState<{ [key: string]: boolean }>({});

    // Group branches by shortForm and organize courses and sessions
    useEffect(() => {
        const grouped: GroupedData = {};

        branches.forEach(branch => {
            const key = branch.shortForm;

            if (!grouped[key]) {
                grouped[key] = {
                    branch: {
                        program: branch.program,
                        course: branch.course,
                        shortForm: branch.shortForm,
                        duration: branch.duration
                    },
                    courses: {}
                };
            }

            // Add course and its sessions
            if (branch.course && branch.session) {
                if (!grouped[key].courses[branch.course]) {
                    grouped[key].courses[branch.course] = [...(branch.session || [])];
                } else {
                    branch.session.forEach(session => {
                        if (!grouped[key].courses[branch.course].includes(session)) {
                            grouped[key].courses[branch.course].push(session);
                        }
                    });
                }
            }
        });

        setGroupedData(grouped);

        // Initialize expanded state for all branches
        const expandedState: { [key: string]: boolean } = {};
        Object.keys(grouped).forEach(key => {
            expandedState[key] = true; // Start expanded by default
        });
        setExpandedBranches(expandedState);

        // Initialize expanded state for courses
        const expandedCoursesState: { [key: string]: boolean } = {};
        Object.keys(grouped).forEach(branchKey => {
            Object.keys(grouped[branchKey].courses).forEach(course => {
                expandedCoursesState[`${branchKey}-${course}`] = true;
            });
        });
        setExpandedCourses(expandedCoursesState);
    }, [branches]);

    // Toggle expanded state for a branch
    const toggleBranchExpanded = (branchKey: string) => {
        setExpandedBranches(prev => ({
            ...prev,
            [branchKey]: !prev[branchKey]
        }));
    };

    // Toggle expanded state for a course
    const toggleCourseExpanded = (key: string) => {
        setExpandedCourses(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Delete branch handlers
    const openDeleteModal = (branch: Branch) => {
        setBranchToDelete(branch);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setBranchToDelete(null);
        setShowDeleteModal(false);
    };

    const confirmDelete = async () => {
        if (!branchToDelete || !departmentId) return;

        setIsDeleting(true);
        try {
            await deleteBranch(departmentId, branchToDelete.shortForm);
            toast.success(`Branch "${branchToDelete.program}" (${branchToDelete.shortForm}) deleted successfully`);
            onDelete();
        } catch (error: any) {
            console.error('Error deleting branch:', error);
            toast.error(error?.response?.data?.message || 'Failed to delete branch');
        } finally {
            setIsDeleting(false);
            closeDeleteModal();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
        );
    }

    if (!departmentId) {
        return (
            <p className="text-gray-500 text-center py-8 bg-blue-50 rounded-md shadow-inner shadow-blue-100">
                Please select a department to view branches
            </p>
        );
    }

    if (branches.length === 0) {
        return (
            <p className="text-gray-500 text-center py-8 bg-blue-50 rounded-md shadow-inner shadow-blue-100">No branches found</p>
        );
    }

    return (
        <div>
            <div className="overflow-x-auto">
                <div className="grid grid-cols-1 gap-4">
                    {Object.entries(groupedData).map(([branchKey, data]) => (
                        <div key={`branch-${branchKey}`} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:shadow-blue-200 transition-shadow">
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-blue-50 transition-colors rounded-t-lg"
                                onClick={() => toggleBranchExpanded(branchKey)}
                            >
                                <div className="flex items-center">
                                    <div className="mr-2 text-blue-500">
                                        {expandedBranches[branchKey] ? <FaAngleDown /> : <FaAngleRight />}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg text-blue-800">{data.branch.program}</h3>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Code:</span> {data.branch.shortForm} |
                                            <span className="font-medium ml-2">Duration:</span> {data.branch.duration} years
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteModal(data.branch);
                                    }}
                                    className="text-red-600 hover:text-red-800 transition p-1 hover:shadow-md hover:shadow-red-100 rounded"
                                    aria-label={`Delete ${data.branch.program} branch`}
                                >
                                    <FaTrash />
                                </button>
                            </div>

                            {expandedBranches[branchKey] && (
                                <div className="border-t border-gray-200 px-4 py-3">
                                    <div className="mb-2 font-medium text-sm text-gray-700">Courses & Sessions:</div>
                                    <div className="space-y-2">
                                        {Object.entries(data.courses).map(([course, sessions]) => (
                                            <div key={`${branchKey}-${course}`} className="bg-gray-50 rounded-md p-3 hover:shadow-md hover:shadow-blue-100 transition-shadow">
                                                <div
                                                    className="flex items-center cursor-pointer"
                                                    onClick={() => toggleCourseExpanded(`${branchKey}-${course}`)}
                                                >
                                                    <div className="mr-2 text-blue-500">
                                                        {expandedCourses[`${branchKey}-${course}`] ? <FaAngleDown size={14} /> : <FaAngleRight size={14} />}
                                                    </div>
                                                    <span className="font-medium text-blue-700">{course}</span>
                                                </div>

                                                {expandedCourses[`${branchKey}-${course}`] && (
                                                    <div className="mt-2 pl-6">
                                                        <div className="text-sm text-gray-600 mb-1">Sessions:</div>
                                                        {sessions.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {sessions.map((session, i) => (
                                                                    <span
                                                                        key={`session-${branchKey}-${course}-${i}`}
                                                                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs shadow-sm"
                                                                    >
                                                                        {session}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mt-1 shadow-sm">
                                                                <p className="text-sm text-yellow-700">
                                                                    No sessions found for this branch. Please add sessions through the Session Management service.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && branchToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <div className="flex items-center text-red-600 mb-4">
                            <FaExclamationTriangle size={24} className="mr-2" />
                            <h3 className="text-lg font-bold">Delete Branch</h3>
                        </div>
                        <p className="mb-6">
                            Are you sure you want to delete the branch <span className="font-semibold">{branchToDelete?.program}</span> ({branchToDelete?.shortForm})?
                            This action will delete all associated sessions and student data. This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition shadow-sm hover:shadow-md"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition shadow-sm hover:shadow-md hover:shadow-red-300 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchList;