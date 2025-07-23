import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Card, CardContent } from '../../../components/ui/Card';
import { Building2, GraduationCap, BookOpen, Users, Calendar, Layers, Database, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAdminDashboardStats } from '../../../api/services/Admin/admin';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();    const [stats, setStats] = useState({
        departments: 0,
        courses: 0,
        branches: 0,
        faculties: 0,
        subjects: 0,
        students: 0,
        activeSemester: 'None'
    });
    const [loading, setLoading] = useState(true);    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await getAdminDashboardStats();
                
                if (response.status === 'success') {
                    const { summary } = response.data;
                    setStats({
                        departments: summary.departments,
                        courses: summary.courses,
                        branches: summary.branches,
                        faculties: summary.faculty,
                        subjects: summary.subjects,
                        students: summary.students,
                        activeSemester: `${summary.activeSemester.type} - ${new Date(summary.activeSemester.startDate).getFullYear()}-${new Date(summary.activeSemester.endDate).getFullYear().toString().slice(-2)}`
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                // Keep default values on error
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const navigateToService = (service: string) => {
        navigate(`/admin/services/${service}`);
    };    const statCards = [
        { title: 'Departments', value: stats.departments, icon: Building2, color: 'bg-blue-500' },
        { title: 'Courses', value: stats.courses, icon: GraduationCap, color: 'bg-green-500' },
        { title: 'Branches', value: stats.branches, icon: Layers, color: 'bg-purple-500' },
        { title: 'Faculty Members', value: stats.faculties, icon: Users, color: 'bg-yellow-500' },
        { title: 'Subjects', value: stats.subjects, icon: BookOpen, color: 'bg-red-500' },
        { title: 'Students', value: stats.students, icon: Users, color: 'bg-indigo-500' },
        { title: 'Active Semester', value: stats.activeSemester, icon: Clock, color: 'bg-teal-500', isText: true }
    ];return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">            <div className="max-w-7xl mx-auto">
                {/* Show heading only on mobile */}
                <div className="flex justify-between items-center mb-8 block sm:hidden">
                    <h1 className="text-2xl font-bold text-blue-800 drop-shadow-md">
                        Dashboard
                        <div className="text-lg font-medium text-blue-600 mt-1">Welcome, {user?.name}</div>
                    </h1>
                </div>                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    {statCards.map((card, index) => (
                        <Card key={index} className="hover:shadow-lg hover:shadow-blue-200/30 transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                            <CardContent className="p-0">
                                <div className="flex items-center">
                                    <div className={`${card.color} p-4 text-white rounded-l-lg`}>
                                        <card.icon size={24} />
                                    </div>
                                    <div className="p-4 flex-1">
                                        <p className="text-xs sm:text-sm font-medium text-gray-500">{card.title}</p>
                                        <p className="text-lg sm:text-xl font-bold">
                                            {loading ? (
                                                <span className="animate-pulse">Loading...</span>
                                            ) : (
                                                card.isText ? card.value : card.value.toLocaleString()
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-4 drop-shadow-sm">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { title: 'Add Department', desc: 'Create new academic departments', icon: Building2, service: 'department' },
                        { title: 'Add Course', desc: 'Add BTech, MTech, MBA, etc.', icon: GraduationCap, service: 'course' },
                        { title: 'Manage Sessions', desc: 'Add or edit academic sessions', icon: Calendar, service: 'session' },
                        { title: 'Add Branch', desc: 'Create branches for courses', icon: Layers, service: 'branch' },
                        { title: 'Semester Settings', desc: 'Configure Even/Odd semesters', icon: Clock, service: 'semester' },
                        { title: 'Faculty Management', desc: 'Add or edit faculty members', icon: Users, service: 'faculty' },
                        { title: 'Subject Management', desc: 'Manage course subjects', icon: BookOpen, service: 'subject' },
                        { title: 'Timetable Management', desc: 'Set up class schedules', icon: Database, service: 'timetable' },
                        { title: 'Student Management', desc: 'Add or edit student records', icon: Users, service: 'student' },
                    ].map((action, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 sm:p-5 rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-200/40 transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
                            onClick={() => navigateToService(action.service)}
                        >
                            <div className="flex items-center mb-2">
                                <div className="bg-blue-50 p-2 rounded-lg mr-3 text-blue-600">
                                    <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{action.title}</h3>
                            </div>
                            <p className="text-sm text-gray-500 ml-1">{action.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
