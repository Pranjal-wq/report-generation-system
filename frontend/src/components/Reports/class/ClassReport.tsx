import React, { useState, useMemo } from 'react';
import { Users, Calendar, AlertCircle, Filter, Info, X } from 'lucide-react';
import ExportButton from '../../ui/ExportButton';

interface ReportData {
    totalClasses: number;
    report: Array<{
        totalPresent: number;
        scholarNumber: string;
        name: string;
    }>;
}

interface ClassReportProps {
    data: ReportData;
}

export default function ClassReport({ data }: ClassReportProps) {
    const [lowerLimit, setLowerLimit] = useState<number>(0);
    const [upperLimit, setUpperLimit] = useState<number>(100);
    const [scholarNumbers, setScholarNumbers] = useState<string[]>([]);
    const [currentScholarNumber, setCurrentScholarNumber] = useState<string>('');
    const [showAttendanceTooltip, setShowAttendanceTooltip] = useState<boolean>(false);
    const [showScholarTooltip, setShowScholarTooltip] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

    if (!data) return null;

    const getAttendanceStatus = (present: number, total: number) => {
        const percentage = (present / total) * 100;
        if (percentage >= 90) return 'bg-green-200 text-green-900 font-semibold';
        if (percentage >= 75) return 'bg-orange-200 text-orange-900 font-semibold';
        return 'bg-red-200 text-red-900 font-semibold';
    };

    const getAttendancePercentage = (present: number, total: number) => {
        return ((present / total) * 100).toFixed(1) + '%';
    };

    const handleAddScholarNumber = () => {
        const trimmedNumber = currentScholarNumber.trim();
        if (/^\d{10}$/.test(trimmedNumber) && !scholarNumbers.includes(trimmedNumber)) {
            setScholarNumbers([...scholarNumbers, trimmedNumber]);
            setCurrentScholarNumber('');
        }
    };

    const removeScholarNumber = (numberToRemove: string) => {
        setScholarNumbers(scholarNumbers.filter(num => num !== numberToRemove));
    };

    const toggleStudentInfo = (scholarNumber: string) => {
        setSelectedStudent(selectedStudent === scholarNumber ? null : scholarNumber);
    };

    const filteredReport = data.report.filter(item => {
        const percentage = (item.totalPresent / data.totalClasses) * 100;
        const attendanceFilter = (lowerLimit > 0 || upperLimit < 100)
            ? (percentage >= lowerLimit && percentage <= upperLimit)
            : true;

        const scholarFilter = scholarNumbers.length === 0
            ? true
            : scholarNumbers.includes(item.scholarNumber);

        return attendanceFilter && scholarFilter;
    });

    // Export columns for PDF and Excel exports
    const exportColumns = useMemo(() => [
        { header: 'Scholar Number', dataKey: 'scholarNumber' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Classes Present', dataKey: 'totalPresent' },
        { header: 'Total Classes', dataKey: 'totalClasses' },
        { header: 'Attendance %', dataKey: 'attendancePercentage' },
        { header: 'Status', dataKey: 'status' }
    ], []);

    // Prepare data for export
    const exportData = useMemo(() =>
        filteredReport.map(item => {
            const attendancePercentage = Number(((item.totalPresent / data.totalClasses) * 100).toFixed(1));
            return {
                ...item,
                totalClasses: data.totalClasses,
                attendancePercentage: attendancePercentage,
                status: attendancePercentage >= 75 ? 'Regular' : 'Irregular'
            };
        }),
        [filteredReport, data.totalClasses]);

    return (
        <div className="w-full">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden" id="classReport">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-white mb-1">
                            <Users className="h-6 w-6" />
                            <h3 className="text-2xl font-bold">Class Attendance Report</h3>
                        </div>
                        <div className="flex items-center gap-2 text-blue-100">
                            <Calendar className="h-5 w-5" />
                            <p className="text-lg">Total Classes: {data.totalClasses}</p>
                        </div>
                    </div>
                    <div>
                        <ExportButton
                            data={exportData}
                            columns={exportColumns}
                            fileName="ClassAttendanceReport"
                            title="Class Attendance Report"
                            buttonText="Export"
                            buttonVariant="contained"
                            buttonColor="primary"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        />
                    </div>
                </div>

                {/* Filtering Section */}
                <div className="p-4 bg-gray-50 space-y-4">
                    {/* Attendance Percentage Filter */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 relative">
                                <label htmlFor="lowerLimit" className="text-sm font-medium text-gray-700">
                                    Lower Limit (%)
                                </label>
                                <div
                                    onMouseEnter={() => setShowAttendanceTooltip(true)}
                                    onMouseLeave={() => setShowAttendanceTooltip(false)}
                                    className="cursor-help"
                                >
                                    <Info className="h-4 w-4 text-gray-500" />
                                </div>
                                {showAttendanceTooltip && (
                                    <div className="absolute z-10 top-full left-0 mt-2 w-64 p-2 bg-black border rounded-md shadow-lg text-xs text-white">
                                        Filter students based on their attendance percentage.
                                        Set lower and upper limits to view students within a specific attendance range.
                                    </div>
                                )}
                                <input
                                    type="number"
                                    id="lowerLimit"
                                    min="0"
                                    max="100"
                                    value={lowerLimit}
                                    onChange={(e) => setLowerLimit(Number(e.target.value))}
                                    className="w-20 px-2 py-1 border rounded-md text-sm"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label htmlFor="upperLimit" className="text-sm font-medium text-gray-700">
                                    Upper Limit (%)
                                </label>
                                <input
                                    type="number"
                                    id="upperLimit"
                                    min="0"
                                    max="100"
                                    value={upperLimit}
                                    onChange={(e) => setUpperLimit(Number(e.target.value))}
                                    className="w-20 px-2 py-1 border rounded-md text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Filter className="h-4 w-4" />
                            <span>Filtered Students: {filteredReport.length}</span>
                        </div>
                    </div>

                    {/* Scholar Number Filter */}
                    <div className="flex flex-wrap items-center gap-4 relative">
                        <div className="flex items-center gap-2">
                            <label htmlFor="scholarNumber" className="text-sm font-medium text-gray-700">
                                Scholar Number
                            </label>
                            <div
                                onMouseEnter={() => setShowScholarTooltip(true)}
                                onMouseLeave={() => setShowScholarTooltip(false)}
                                className="cursor-help"
                            >
                                <Info className="h-4 w-4 text-gray-500" />
                            </div>
                            {showScholarTooltip && (
                                <div className="absolute z-10 top-full left-0 mt-2 w-64 p-2 bg-black border rounded-md shadow-lg text-xs text-white">
                                    Filter students by their 10-digit Scholar Number.
                                    You can add multiple scholar numbers to filter.
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                id="scholarNumber"
                                value={currentScholarNumber}
                                onChange={(e) => setCurrentScholarNumber(e.target.value)}
                                placeholder="Enter 10-digit number"
                                maxLength={10}
                                className="w-40 px-2 py-1 border rounded-md text-sm"
                            />
                            <button
                                onClick={handleAddScholarNumber}
                                className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm hover:bg-blue-600"
                            >
                                Add
                            </button>
                        </div>
                        {/* Scholar Number Tags */}
                        <div className="flex flex-wrap gap-2">
                            {scholarNumbers.map(number => (
                                <div
                                    key={number}
                                    className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                                >
                                    {number}
                                    <button
                                        onClick={() => removeScholarNumber(number)}
                                        className="ml-2 text-blue-500 hover:text-blue-700"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Attendance Status:</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-900">≥ 90%</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-200 text-orange-900">≥ 75%</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-200 text-red-900">&lt; 75%</span>
                    </div>
                </div>

                {/* Table/Mobile List */}
                <div className="p-6">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto h-80 overflow-y-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Scholar Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Attendance
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredReport.map((item) => {
                                    const attendanceClass = getAttendanceStatus(item.totalPresent, data.totalClasses);
                                    const percentage = getAttendancePercentage(item.totalPresent, data.totalClasses);

                                    return (
                                        <tr key={item.scholarNumber} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.scholarNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.totalPresent} / {data.totalClasses}
                                                <span className="ml-2 text-gray-500">
                                                    ({percentage})
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${attendanceClass}`}>
                                                    {Number(percentage.slice(0, -1)) >= 75 ? 'Regular' : 'Irregular'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile List View */}
                    <div className="md:hidden space-y-4 h-80 overflow-y-auto">
                        {filteredReport.map((item) => {
                            const attendanceClass = getAttendanceStatus(item.totalPresent, data.totalClasses);
                            const percentage = getAttendancePercentage(item.totalPresent, data.totalClasses);

                            return (
                                <div key={item.scholarNumber} className="bg-white rounded-lg shadow p-4">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => toggleStudentInfo(item.scholarNumber)}
                                    >
                                        <span className="font-medium">{item.scholarNumber}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${attendanceClass}`}>
                                            {percentage}
                                        </span>
                                    </div>

                                    {selectedStudent === item.scholarNumber && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Name:</span> {item.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Attendance:</span> {item.totalPresent} / {data.totalClasses}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Status:</span> {Number(percentage.slice(0, -1)) >= 75 ? 'Regular' : 'Irregular'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}