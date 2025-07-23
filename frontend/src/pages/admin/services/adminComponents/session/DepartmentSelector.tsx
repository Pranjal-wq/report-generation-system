import React from 'react';

interface Department {
    _id: string;
    department: string;
    cn: string;
}

interface DepartmentSelectorProps {
    departments: Department[];
    selectedDepartment: string;
    setSelectedDepartment: (departmentId: string) => void;
    loading: boolean;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
    departments,
    selectedDepartment,
    setSelectedDepartment,
    loading
}) => {
    return (
        <div className="space-y-1">
            <label className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2" htmlFor="department">
                Department
            </label>
            <select
                id="department"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                disabled={loading}
            >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                        {dept.department} ({dept.cn})
                    </option>
                ))}
            </select>
            {loading && (
                <div className="flex justify-center items-center h-4 sm:h-6 mt-1">
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-700"></div>
                </div>
            )}
        </div>
    );
};

export default DepartmentSelector;