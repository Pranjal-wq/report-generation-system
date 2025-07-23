import React, { useState, useEffect } from 'react';
import { configureSemester, getSemesterStatus } from '../../../api/services/Admin/admin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SemesterStatus {
    enabled: boolean;
    type: 'even' | 'odd';
}

const SemesterService: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentSemester, setCurrentSemester] = useState<SemesterStatus | null>(null);
    const [selectedType, setSelectedType] = useState<'even' | 'odd'>('even');
    const [updating, setUpdating] = useState<boolean>(false);

    // Fetch current semester configuration on component mount
    useEffect(() => {
        fetchSemesterStatus();
    }, []);

    const fetchSemesterStatus = async () => {
        setIsLoading(true);
        try {
            const res = await getSemesterStatus();
            setCurrentSemester({
                enabled: res.status === 'success',
                type: res.activeSemester,
            });
            setSelectedType(res.activeSemester);
        } catch (error) {
            console.error('Error fetching semester status:', error);
            toast.error('Failed to fetch semester configuration');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSemesterUpdate = async () => {
        setUpdating(true);
        try {
            const data = await configureSemester(selectedType);
            toast.success(data.message);
            fetchSemesterStatus(); // Refresh the status after update
        } catch (error: any) {
            console.error('Error updating semester:', error);
            toast.error(error?.response?.data?.message || 'Failed to update semester configuration');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Semester Configuration</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold mb-4">Current Semester Configuration</h2>
                            <div className="bg-gray-100 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-gray-700">Status:</span>
                                        <span className={`ml-2 font-semibold ${currentSemester?.enabled ? 'text-green-600' : 'text-red-600'}`}>
                                            {currentSemester?.enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-700">Type:</span>
                                        <span className="ml-2 font-semibold text-blue-700">
                                            {currentSemester?.type.toUpperCase()} Semester
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-4">Update Semester Type</h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="evenSemester"
                                            name="semesterType"
                                            value="even"
                                            checked={selectedType === 'even'}
                                            onChange={() => setSelectedType('even')}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="evenSemester" className="ml-2 block text-sm text-gray-700">
                                            EVEN Semester
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="oddSemester"
                                            name="semesterType"
                                            value="odd"
                                            checked={selectedType === 'odd'}
                                            onChange={() => setSelectedType('odd')}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="oddSemester" className="ml-2 block text-sm text-gray-700">
                                            ODD Semester
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSemesterUpdate}
                                    disabled={updating || (currentSemester?.type === selectedType)}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${(updating || currentSemester?.type === selectedType) ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {updating ? 'Updating...' : 'Update Semester Type'}
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h3 className="text-yellow-800 font-medium mb-2">Important Note</h3>
                            <p className="text-yellow-700 text-sm">
                                Changing the semester type has system-wide implications. This setting affects which subjects are available,
                                which attendance records are tracked, and how reports are generated. Please ensure you're making this change
                                at the appropriate time in the academic calendar.
                            </p>
                        </div>
                    </>
                )}
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default SemesterService;