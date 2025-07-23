import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    ColumnDef,
    flexRender,
} from '@tanstack/react-table';
import { FileSpreadsheet, Calendar, User, Download } from 'lucide-react';
import { exportToPDF } from '../../../Utils/ExportPDF';

interface FacultyRecord {
    subjectId: string;
    subjectName: string;
    subjectCode: string;
    branch: string;
    semester: string;
    section: string;
    course: string;
    session: string;
    scheduledClasses: number;
    totalClasses: number; // still set in data but won't be shown in the table
    isMarked: number;
    unmarkedDates: string[];
    averageMarkedAttendance: number; // Added new field for average attendance percentage
}

interface FacultyReportProps {
    data: FacultyRecord[];
    professorName?: string;
    startDate?: string;
    endDate?: string;
    employeeCode?: string; // renamed from empCode
}

const FacultyReport: React.FC<FacultyReportProps> = ({
    data,
    professorName = "Faculty Member",
    startDate = "All time",
    endDate = "Present",
    employeeCode = '0000' // renamed default prop
}) => {
    const tableData = React.useMemo(() => data || [], [data]);

    const [showModal, setShowModal] = React.useState(false);
    const [selectedUnmarked, setSelectedUnmarked] = React.useState<string[]>([]);

    const columns = React.useMemo<ColumnDef<FacultyRecord>[]>(() => [
        {
            header: 'Subject Details',
            columns: [
                {
                    header: 'Subject Name',
                    accessorKey: 'subjectName',
                    cell: (info) => (
                        <div className="font-medium text-gray-900">{info.getValue() as string}</div>
                    )
                },
                {
                    header: 'Subject Code',
                    accessorKey: 'subjectCode',
                    cell: (info) => (
                        <div className="text-sm text-gray-600">{info.getValue() as string}</div>
                    )
                },
            ]
        },
        {
            header: 'Class Information',
            columns: [
                {
                    header: 'Branch',
                    accessorKey: 'branch',
                    cell: (info) => (
                        <div className="text-sm font-medium text-gray-700">{info.getValue() as string}</div>
                    )
                },
                {
                    header: 'Semester',
                    accessorKey: 'semester',
                    cell: (info) => (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {info.getValue() as string}
                        </span>
                    )
                },
                {
                    header: 'Section',
                    accessorKey: 'section',
                    cell: (info) => (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {info.getValue() as string}
                        </span>
                    )
                },
            ]
        },
        {
            header: 'Attendance Statistics',
            columns: [
                {
                    header: 'Scheduled',
                    accessorKey: 'scheduledClasses',
                    cell: (info) => (
                        <div className="text-center font-semibold text-gray-900">
                            {info.getValue() as number}
                        </div>
                    )
                },
                {
                    header: 'Avg Attendance %',
                    accessorKey: 'averageMarkedAttendance',
                    cell: (info) => {
                        const value = info.getValue() as number;
                        return (
                            <div className="text-center font-semibold text-gray-900">
                                {value.toFixed(2)}%
                            </div>
                        );
                    }
                },
                {
                    header: 'Marked',
                    accessorKey: 'isMarked',
                    cell: (info) => {
                        const value = info.getValue() as number;
                        return (
                            <span className="text-sm font-medium text-gray-900">{value}</span>
                        );
                    }
                },
                {
                    header: 'Unmarked',
                    accessorKey: 'unmarkedDates',
                    cell: (info) => {
                        const { unmarkedDates } = info.row.original;
                        return (
                            <button
                                onClick={() => {
                                    setSelectedUnmarked(unmarkedDates);
                                    setShowModal(true);
                                }}
                                className="text-sm font-medium text-blue-600 underline"
                            >
                                {unmarkedDates.length}
                            </button>
                        );
                    }
                },
            ]
        },
    ], []);

    // Define export columns (simpler structure for export)
    const exportColumns = React.useMemo(() => [
        { header: 'Subject Name', dataKey: 'subjectName' },
        { header: 'Subject Code', dataKey: 'subjectCode' },
        { header: 'Branch', dataKey: 'branch' },
        { header: 'Semester', dataKey: 'semester' },
        { header: 'Section', dataKey: 'section' },
        { header: 'Course', dataKey: 'course' },
        { header: 'Session', dataKey: 'session' },
        { header: 'Scheduled Classes', dataKey: 'scheduledClasses' },
        { header: 'Marked Classes', dataKey: 'isMarked' },
        { header: 'Average Attendance %', dataKey: 'averageMarkedAttendance' }
    ], []);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div id="facultyReport" className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <FileSpreadsheet className="w-6 h-6 mr-2" />
                        Faculty Attendance Report
                    </h2>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-blue-100">
                            <User className="w-5 h-5 mr-2" />
                            <span className="font-medium">{professorName}</span>
                        </div>
                        <div className="flex items-center text-blue-100">
                            <Calendar className="w-5 h-5 mr-2" />
                            <span>{startDate} to {endDate}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        onClick={() => exportToPDF('facultyReport', `FacultyReport-${professorName}.pdf`)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-500 hover:to-blue-400 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr
                                    key={headerGroup.id}
                                    className="divide-x divide-gray-200"
                                >
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                                        >
                                            {header.isPlaceholder ? null :
                                                flexRender(header.column.columnDef.header, header.getContext())
                                            }
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row, i) => (
                                    <tr
                                        key={row.id}
                                        className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} divide-x divide-gray-200`}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <td
                                                key={cell.id}
                                                className="px-6 py-4 whitespace-nowrap"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-8 text-center text-gray-500 bg-gray-50"
                                    >
                                        No attendance data available for the selected time period
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-2">Unmarked Dates</h2>
                        {selectedUnmarked.length ? (
                            <ul className="list-disc list-inside">
                                {selectedUnmarked.map((date, idx) => (
                                    <li key={idx}>{date}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No unmarked dates available.</p>
                        )}
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 bg-gray-300 px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyReport;

