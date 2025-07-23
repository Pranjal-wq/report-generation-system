import React, { useState, useEffect } from 'react';
import { OverallAttendanceReport } from './OverallReport';
import MonthlyAttendanceReport from './MonthlyReport';
import { mockAttendanceData } from '../../../mock/student/mockdata';
import { getOverallAttendance, getMonthlyAttendance } from '../../../api/services/Student/Student';
import { toast, ToastContainer } from 'react-toastify';
import { StudentInfo } from './StudentInfo';
import { Download } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { exportToPDF } from '../../../Utils/ExportPDF';


async function fetchOverallAttendanceData(scholarNumber) {
    let detail;
    const rawData = await getOverallAttendance(scholarNumber);
    const totalClasses = rawData.summary.reduce((acc, item) => acc + item.total, 0);
    const attendedClasses = rawData.summary.reduce((acc, item) => acc + item.present, 0);
    return {
        semesterSummary: {
            totalClasses,
            attendedClasses,
            overallPercentage: totalClasses ? (attendedClasses / totalClasses) * 100 : 0,
            subjectsData: rawData.summary.map(sub => ({
                subjectName: sub.subName,
                subjectCode: sub.subCode,
                professorName: sub.employee,
                totalClasses: sub.total,
                attendedClasses: sub.present,
                percentage: sub.total ? (sub.present / sub.total) * 100 : 0
            }))
        }
    };
}

async function fetchMonthlyAttendanceData() {
    return mockAttendanceData.monthly;
}

function StudentReport({ scholarNumber, studentDetails }: { scholarNumber: string, studentDetails: any }) {
    const [activeTab, setActiveTab] = useState('overall');
    const [overallData, setOverallData] = useState(null);
    const [monthlyData, setMonthlyData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (scholarNumber && activeTab === 'overall') {
            setIsLoading(true);
            (async () => {
                try {
                    const data = await fetchOverallAttendanceData(scholarNumber);
                    setOverallData(data);

                } catch (error) {
                    console.error('Error fetching overall attendance:', error);

                } finally {
                    setIsLoading(false);
                }
            })();
        }
    }, [scholarNumber, activeTab]);

    useEffect(() => {
        if (activeTab === 'monthly') {
            setIsLoading(true);
            (async () => {
                try {
                    const data = await getMonthlyAttendance(scholarNumber);
                    setMonthlyData(data);

                } catch (error) {
                    console.error('Error fetching monthly attendance:', error);

                } finally {
                    setIsLoading(false);
                }
            })();
        }
    }, [activeTab, scholarNumber]); // Updated dependency array

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                            Student Attendance Dashboard
                        </h1>
                        <button
                            onClick={() => exportToPDF('reportToExport', `student-${activeTab}-report-${scholarNumber}.pdf`)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-500 hover:to-blue-400 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </button>
                    </div>

                    <nav className="flex space-x-2 bg-white p-1 rounded-lg w-fit" aria-label="Tabs">
                        {['overall', 'monthly'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${activeTab === tab
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    } px-6 py-3 font-medium text-sm rounded-md capitalize transition-all duration-200`}
                            >
                                {tab} Report
                            </button>
                        ))}
                    </nav>

                    <div id="reportToExport" className="space-y-6">
                        {studentDetails && (
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <StudentInfo details={studentDetails} />
                            </div>
                        )}

                        <div className="mt-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'overall' && overallData && (
                                        <div className="bg-white rounded-lg shadow-sm">
                                            <OverallAttendanceReport data={overallData} />
                                        </div>
                                    )}
                                    {activeTab === 'monthly' && monthlyData && (
                                        <div className="bg-white rounded-lg shadow-sm">
                                            <MonthlyAttendanceReport data={monthlyData} />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}

export default StudentReport;