import React, { useState } from 'react';
import { Settings, Bell, Key, Shield, Clock, Calendar, Save, Database } from 'lucide-react';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', name: 'General Settings', icon: Settings },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'security', name: 'Security & Access', icon: Shield },
        { id: 'backup', name: 'Backup & Restore', icon: Database },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6 text-blue-800 drop-shadow-md">System Settings</h1>

            <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
                <div className="w-full md:w-64">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 hover:shadow-blue-200/50 transition-shadow duration-300">
                        <nav className="p-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    flex items-center w-full px-3 py-3 text-left rounded-md mb-1 transition-all
                    ${activeTab === tab.id
                                            ? 'bg-blue-100 text-blue-700 font-medium shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-100'}
                  `}
                                >
                                    <tab.icon className="mr-3 h-5 w-5" />
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="bg-white shadow-lg rounded-lg p-5 sm:p-6 border border-gray-100 hover:shadow-blue-200/50 transition-shadow duration-300">
                        {/* General Settings Tab */}
                        {activeTab === 'general' && (
                            <div>
                                <h2 className="text-xl font-bold mb-5 text-blue-700">General Settings</h2>

                                <div className="space-y-6">
                                    {/* Institute Information */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 border-l-4 border-blue-500 pl-2">Institute Information</h3>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    defaultValue="Maulana Azad National Institute of Technology"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    defaultValue="MANIT"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                                <textarea
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    defaultValue="Link Road Number 3, Near Kali Mata Mandir, Bhopal, Madhya Pradesh, India 462003"
                                                    rows={2}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                                <input
                                                    type="text"
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    defaultValue="https://www.manit.ac.in"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Academic Settings */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 border-l-4 border-blue-500 pl-2">Academic Settings</h3>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Academic Year</label>
                                                <input
                                                    type="text"
                                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    defaultValue="2023-2024"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Semester</label>
                                                <select className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                                    <option value="odd">Odd Semester</option>
                                                    <option value="even" selected>Even Semester</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md flex items-center shadow-md hover:shadow-blue-300 transition-all">
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div>
                                <h2 className="text-xl font-bold mb-5 text-blue-700">Notification Settings</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                                        <div>
                                            <p className="font-medium">Email Notifications</p>
                                            <p className="text-sm text-gray-500">Receive email notifications for important events</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                                        <div>
                                            <p className="font-medium">System Alerts</p>
                                            <p className="text-sm text-gray-500">Important system alerts and notifications</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                                        <div>
                                            <p className="font-medium">Low Attendance Alerts</p>
                                            <p className="text-sm text-gray-500">Send alerts when student attendance falls below threshold</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 border-l-4 border-blue-500 pl-2">Notification Thresholds</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Low Attendance Threshold (%)</label>
                                            <input
                                                type="number"
                                                className="w-full max-w-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                defaultValue="75"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md flex items-center shadow-md hover:shadow-blue-300 transition-all">
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Settings
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div>
                                <h2 className="text-xl font-bold mb-5 text-blue-700">Security & Access Settings</h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 border-l-4 border-blue-500 pl-2">Password Policy</h3>
                                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">Enforce Strong Passwords</p>
                                                    <p className="text-sm text-gray-500">Require complex passwords for all users</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (days)</label>
                                                <input
                                                    type="number"
                                                    className="w-full max-w-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    defaultValue="90"
                                                />
                                                <p className="mt-1 text-xs text-gray-500">Set to 0 for no expiry</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 border-l-4 border-blue-500 pl-2">Session Settings</h3>
                                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                                                <input
                                                    type="number"
                                                    className="w-full max-w-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    defaultValue="30"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">Force Re-login After Timeout</p>
                                                    <p className="text-sm text-gray-500">Require users to log in again after session timeout</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md flex items-center shadow-md hover:shadow-blue-300 transition-all">
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Security Settings
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Backup & Restore Tab */}
                        {activeTab === 'backup' && (
                            <div>
                                <h2 className="text-xl font-bold mb-5 text-blue-700">Backup & Restore</h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 border-l-4 border-blue-500 pl-2">Database Backup</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="mb-4 text-gray-600">Create backup of all system data</p>
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md flex items-center shadow-md hover:shadow-blue-300 transition-all">
                                                <Database className="mr-2 h-4 w-4" />
                                                Create Backup Now
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 border-l-4 border-blue-500 pl-2">Automatic Backups</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">Enable Automatic Backups</p>
                                                    <p className="text-sm text-gray-500">System will create backups automatically</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                                                <select className="w-full max-w-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                                    <option value="daily">Daily</option>
                                                    <option value="weekly" selected>Weekly</option>
                                                    <option value="monthly">Monthly</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 border-l-4 border-blue-500 pl-2">Restore Data</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="mb-4 text-gray-600">Restore system from previous backup</p>
                                            <div className="flex flex-wrap items-center gap-4">
                                                <input
                                                    type="file"
                                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
                                                />
                                                <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md flex items-center shadow-md hover:shadow-amber-300 transition-all">
                                                    <Database className="mr-2 h-4 w-4" />
                                                    Restore
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
