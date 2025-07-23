import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, PieChart, BarChart, Calendar, User } from 'lucide-react';

const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState('attendance');

    const tabs = [
        { id: 'attendance', name: 'Attendance Reports', icon: User },
        { id: 'academic', name: 'Academic Reports', icon: FileText },
        { id: 'analysis', name: 'Analysis Reports', icon: PieChart }
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>
            <p className="text-gray-600 mb-6">
                Generate, analyze, and export reports for attendance, academics, and more.
            </p>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
                        >
                            <tab.icon className="mr-2 h-5 w-5" />
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Attendance Reports Tab */}
            {activeTab === 'attendance' && (
                <div className="space-y-6">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium mb-4">Student Attendance Reports</h2>
                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="w-full sm:w-64">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select Department</option>
                                    <option value="cse">Computer Science</option>
                                    <option value="ece">Electronics</option>
                                    <option value="me">Mechanical</option>
                                </select>
                            </div>
                            <div className="w-full sm:w-64">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                                <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select Course</option>
                                    <option value="btech">B.Tech</option>
                                    <option value="mtech">M.Tech</option>
                                </select>
                            </div>
                            <div className="w-full sm:w-64">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                                <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select Branch</option>
                                    <option value="cse">CSE</option>
                                    <option value="it">IT</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                Generate Report
                            </button>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium mb-4">Faculty Attendance Reports</h2>
                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="w-full sm:w-64">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select Department</option>
                                    <option value="cse">Computer Science</option>
                                    <option value="ece">Electronics</option>
                                    <option value="me">Mechanical</option>
                                </select>
                            </div>
                            <div className="w-full sm:w-64">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                                <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select Faculty</option>
                                    <option value="faculty1">Dr. Deepak Singh Tomar</option>
                                    <option value="faculty2">Dr. Ramesh Kumar Thakur</option>
                                </select>
                            </div>
                            <div className="w-full sm:w-64">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                                <input type="date" className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Academic Reports Tab */}
            {activeTab === 'academic' && (
                <div className="space-y-6">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium mb-4">Academic Performance Reports</h2>
                        <p className="text-gray-600">
                            Generate reports on academic performance across departments, courses, and branches.
                        </p>
                        <div className="mt-4">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Analysis Reports Tab */}
            {activeTab === 'analysis' && (
                <div className="space-y-6">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium mb-4">Attendance Analysis</h2>
                        <p className="text-gray-600">
                            Analyze attendance patterns and generate insights for better decision making.
                        </p>
                        <div className="mt-4">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
                                <PieChart className="mr-2 h-4 w-4" />
                                Generate Analysis
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsPage;
