import React, { useState } from 'react';
import { addDepartment } from '../../../../../api/services/Admin/admin';
import { toast } from 'react-toastify';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface AddDepartmentFormProps {
    onDepartmentAdded: () => void;
    onShowBulkModal: () => void;
}

const AddDepartmentForm: React.FC<AddDepartmentFormProps> = ({ onDepartmentAdded, onShowBulkModal }) => {
    const [departmentName, setDepartmentName] = useState('');
    const [departmentCode, setDepartmentCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!departmentName.trim() || !departmentCode.trim()) {
            toast.error('Department name and code are required');
            return;
        }

        setIsSubmitting(true);
        try {
            await addDepartment({
                department: departmentName,
                cn: departmentCode
            });

            toast.success('Department added successfully!');
            setDepartmentName('');
            setDepartmentCode('');
            onDepartmentAdded();
        } catch (error: any) {
            console.error('Error adding department:', error);
            toast.error(error?.response?.data?.message || 'Failed to add department');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add Department</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="departmentName">
                        Department Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        id="departmentName"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="e.g., Computer Science and Engineering"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="departmentCode">
                        Department Code <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        id="departmentCode"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="e.g., CSE"
                        value={departmentCode}
                        onChange={(e) => setDepartmentCode(e.target.value)}
                        required
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition flex items-center"
                        onClick={onShowBulkModal}
                    >
                        <AddCircleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Bulk Add
                    </button>
                    <button
                        type="submit"
                        className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Add Department'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddDepartmentForm;