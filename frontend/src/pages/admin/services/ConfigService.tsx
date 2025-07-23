import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    getSemesterConfig,
    updateAcademicYear,
    updateSemesterDates,
    updateInstituteName,
    configureSemester
} from '../../../api/services/Admin/admin';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';

interface SemesterSession {
    semesterType: 'Odd' | 'Even';
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface ConfigData {
    _id: string;
    configType: string;
    institute: string;
    academicYear: string;
    sessions: SemesterSession[];
    createdAt: string;
    updatedAt: string;
}

const ConfigService: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [config, setConfig] = useState<ConfigData | null>(null);
    
    // Edit states
    const [editingAcademicYear, setEditingAcademicYear] = useState(false);
    const [editingInstitute, setEditingInstitute] = useState(false);
    const [editingSemester, setEditingSemester] = useState<string | null>(null);
    
    // Form states
    const [academicYearInput, setAcademicYearInput] = useState('');
    const [instituteInput, setInstituteInput] = useState('');
    const [semesterDateInputs, setSemesterDateInputs] = useState<{[key: string]: {startDate: string, endDate: string}}>({});
    
    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        setLoading(true);
        try {
            const response = await getSemesterConfig();
            setConfig(response.data);
            setAcademicYearInput(response.data.academicYear);
            setInstituteInput(response.data.institute);
            
            // Initialize semester date inputs
            const dateInputs: {[key: string]: {startDate: string, endDate: string}} = {};
            response.data.sessions.forEach((session: SemesterSession) => {
                dateInputs[session.semesterType] = {
                    startDate: new Date(session.startDate).toISOString().split('T')[0],
                    endDate: new Date(session.endDate).toISOString().split('T')[0]
                };
            });
            setSemesterDateInputs(dateInputs);
        } catch (error) {
            console.error('Error fetching config:', error);
            toast.error('Failed to load configuration');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAcademicYear = async () => {
        if (!academicYearInput.trim()) {
            toast.error('Academic year cannot be empty');
            return;
        }

        // Validate YYYY-YYYY format
        const academicYearRegex = /^\d{4}-\d{4}$/;
        if (!academicYearRegex.test(academicYearInput)) {
            toast.error('Academic year must be in YYYY-YYYY format (e.g., 2024-2025)');
            return;
        }

        setUpdating(true);        try {
            const response = await updateAcademicYear(academicYearInput);
            toast.success(response.message);
            setEditingAcademicYear(false);
            fetchConfig(); // Refresh config
        } catch (err: unknown) {
            console.error('Error updating academic year:', err);
            const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(errorMessage || 'Failed to update academic year');
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateInstitute = async () => {
        if (!instituteInput.trim()) {
            toast.error('Institute name cannot be empty');
            return;
        }

        setUpdating(true);        try {
            const response = await updateInstituteName(instituteInput);
            toast.success(response.message);
            setEditingInstitute(false);
            fetchConfig(); // Refresh config
        } catch (err: unknown) {
            console.error('Error updating institute:', err);
            const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(errorMessage || 'Failed to update institute name');
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateSemesterDates = async (semesterType: 'Odd' | 'Even') => {
        const dates = semesterDateInputs[semesterType];
        if (!dates.startDate || !dates.endDate) {
            toast.error('Both start and end dates are required');
            return;
        }

        if (new Date(dates.startDate) >= new Date(dates.endDate)) {
            toast.error('Start date must be before end date');
            return;
        }

        setUpdating(true);        try {
            const response = await updateSemesterDates(semesterType, dates.startDate, dates.endDate);
            toast.success(response.message);
            setEditingSemester(null);
            fetchConfig(); // Refresh config
        } catch (err: unknown) {
            console.error('Error updating semester dates:', err);
            const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(errorMessage || 'Failed to update semester dates');
        } finally {
            setUpdating(false);
        }
    };

    const handleActivateSemester = async (semesterType: 'Odd' | 'Even') => {
        setUpdating(true);        try {
            const response = await configureSemester(semesterType.toLowerCase() as 'odd' | 'even');
            toast.success(response.message);
            fetchConfig(); // Refresh config
        } catch (err: unknown) {
            console.error('Error activating semester:', err);
            const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(errorMessage || 'Failed to activate semester');
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-gray-500">No configuration found</p>
                    <button
                        onClick={fetchConfig}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
                <div className="flex items-center">
                    <SettingsIcon className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">System Configuration</h1>
                        <p className="text-gray-600 text-sm sm:text-base">Manage academic year, institute details, and semester settings</p>
                    </div>
                </div>
                <button
                    onClick={fetchConfig}
                    disabled={loading}
                    className="flex items-center px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                >
                    <RefreshIcon className="w-5 h-5 mr-2" />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {/* Academic Year Configuration */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
                    <div className="flex items-center mb-4">
                        <CalendarTodayIcon className="w-6 h-6 text-blue-600 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-800">Academic Year</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Current Academic Year:</span>
                            {editingAcademicYear ? (
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={academicYearInput}
                                        onChange={(e) => setAcademicYearInput(e.target.value)}
                                        placeholder="YYYY-YYYY"
                                        className="px-2 py-1 border rounded-md text-sm w-24 sm:w-32"
                                    />
                                    <button
                                        onClick={handleUpdateAcademicYear}
                                        disabled={updating}
                                        className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        <SaveIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingAcademicYear(false);
                                            setAcademicYearInput(config.academicYear);
                                        }}
                                        className="p-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-blue-700">{config.academicYear}</span>
                                    <button
                                        onClick={() => setEditingAcademicYear(true)}
                                        className="p-1 text-gray-500 hover:text-blue-600"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className="text-sm text-gray-500">
                            Format: YYYY-YYYY (e.g., 2024-2025)
                        </div>
                    </div>
                </div>

                {/* Institute Configuration */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
                    <div className="flex items-center mb-4">
                        <BusinessIcon className="w-6 h-6 text-blue-600 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-800">Institute Details</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Institute Name:</span>
                            {editingInstitute ? (
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={instituteInput}
                                        onChange={(e) => setInstituteInput(e.target.value)}
                                        className="px-2 py-1 border rounded-md text-sm min-w-32 sm:min-w-48"
                                    />
                                    <button
                                        onClick={handleUpdateInstitute}
                                        disabled={updating}
                                        className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        <SaveIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingInstitute(false);
                                            setInstituteInput(config.institute);
                                        }}
                                        className="p-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-blue-700">{config.institute}</span>
                                    <button
                                        onClick={() => setEditingInstitute(true)}
                                        className="p-1 text-gray-500 hover:text-blue-600"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Semester Configuration */}
            <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center mb-6">
                    <SchoolIcon className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">Semester Configuration</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {config.sessions.map((session) => (
                        <div
                            key={session.semesterType}
                            className={`border rounded-lg p-3 sm:p-4 ${
                                session.isActive 
                                    ? 'border-green-300 bg-green-50' 
                                    : 'border-gray-300 bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {session.semesterType} Semester
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            session.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {session.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    {!session.isActive && (
                                        <button
                                            onClick={() => handleActivateSemester(session.semesterType)}
                                            disabled={updating}
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                        >
                                            Activate
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {editingSemester === session.semesterType ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={semesterDateInputs[session.semesterType]?.startDate || ''}
                                                onChange={(e) => setSemesterDateInputs(prev => ({
                                                    ...prev,
                                                    [session.semesterType]: {
                                                        ...prev[session.semesterType],
                                                        startDate: e.target.value
                                                    }
                                                }))}
                                                className="w-full px-2 py-2 border rounded-md text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                End Date
                                            </label>
                                            <input
                                                type="date"
                                                value={semesterDateInputs[session.semesterType]?.endDate || ''}
                                                onChange={(e) => setSemesterDateInputs(prev => ({
                                                    ...prev,
                                                    [session.semesterType]: {
                                                        ...prev[session.semesterType],
                                                        endDate: e.target.value
                                                    }
                                                }))}
                                                className="w-full px-2 py-2 border rounded-md text-sm"
                                            />
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                                            <button
                                                onClick={() => handleUpdateSemesterDates(session.semesterType)}
                                                disabled={updating}
                                                className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                            >
                                                <SaveIcon className="w-4 h-4 mr-1" />
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingSemester(null)}
                                                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-0">
                                            <span className="text-sm text-gray-600">Start Date:</span>
                                            <span className="text-sm font-medium">{formatDate(session.startDate)}</span>
                                        </div>
                                        <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-0">
                                            <span className="text-sm text-gray-600">End Date:</span>
                                            <span className="text-sm font-medium">{formatDate(session.endDate)}</span>
                                        </div>
                                        <div className="flex justify-end mt-2 sm:mt-3">
                                            <button
                                                onClick={() => setEditingSemester(session.semesterType)}
                                                className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                                            >
                                                <EditIcon className="w-4 h-4 mr-1" />
                                                Edit Dates
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* System Information */}
            <div className="mt-6 sm:mt-8 bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 overflow-x-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs sm:text-sm min-w-[320px]">
                    <div>
                        <span className="text-gray-600">Configuration ID:</span>
                        <span className="ml-2 font-mono text-xs">{config._id}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Configuration Type:</span>
                        <span className="ml-2">{config.configType}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Created:</span>
                        <span className="ml-2">{formatDate(config.createdAt)}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="ml-2">{formatDate(config.updatedAt)}</span>
                    </div>
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ConfigService;