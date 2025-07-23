import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person'; 
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'; // Added
import ScheduleIcon from '@mui/icons-material/Schedule'; // Added for Timetable

const ServicesLayout: React.FC = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const services = [
        {
            name: 'Department Management',
            path: '/admin/services/department',
            icon: <BusinessIcon className="w-8 h-8" />,
            description: 'Manage academic departments and faculty'
        },
        {
            name: 'Branch Management',
            path: '/admin/services/branch',
            icon: <AccountTreeIcon className="w-8 h-8" />,
            description: 'Coordinate multiple campus branches'
        },
        {
            name: 'Session Management',
            path: '/admin/services/session',
            icon: <CalendarTodayIcon className="w-8 h-8" />,
            description: 'Schedule and organize academic sessions'
        },
        {
            name: 'Config Management',
            path: '/admin/services/config',
            icon: <SettingsIcon className="w-8 h-8" />,
            description: 'Configure academic year and semester settings'
        },
        {
            name: 'Course Management',
            path: '/admin/services/course',
            icon: <MenuBookIcon className="w-8 h-8" />,
            description: 'Handle course creation and curriculum'
        },
        {
            name: 'Subject Management',
            path: '/admin/services/subject',
            icon: <LibraryBooksIcon className="w-8 h-8" />,
            description: 'Manage academic subjects and electives'
        },
        {
            name: 'Timetable Management',
            path: '/admin/services/timetable',
            icon: <ScheduleIcon className="w-8 h-8" />,
            description: 'Manage and view faculty timetables'
        },
        {
            name: 'Faculty Management',
            path: '/admin/services/faculty',
            icon: <PersonIcon className="w-8 h-8" />,
            description: 'Manage faculty accounts and details'
        },
        

        // Commented out - Testing Phase
        /*
        {
            name: 'Semester Configuration',
            path: '/admin/services/semester',
            icon: <SettingsIcon className="w-8 h-8" />,
            description: 'Configure semester settings and timelines'
        },
        {
            name: 'Student Management',
            path: '/admin/services/student',
            icon: <SchoolIcon className="w-8 h-8" />,
            description: 'Handle student records and enrollment'
        },
        {
            name: 'User Management',
            path: '/admin/services/users',
            icon: <PeopleIcon className="w-8 h-8" />,
            description: 'Manage user accounts and permissions'
        },
        {
            name: 'Reports',
            path: '/admin/services/reports',
            icon: <AssessmentIcon className="w-8 h-8" />,
            description: 'Generate and view institutional reports'
        },
        */
    ];

    return (
        <div className="container mx-auto px-4 py-8 sm:py-12 bg-slate-50 min-h-screen">
            <h1 className="text-4xl font-bold mb-4 text-blue-900 drop-shadow-lg">Administrative Services</h1>
            <p className="text-gray-700 mb-10 text-lg max-w-3xl">
                Manage your educational institution efficiently with our comprehensive administrative tools.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {services.map((service) => (
                    <Link
                        key={service.path}
                        to={service.path}
                        className={`group p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-2 ${currentPath === service.path
                            ? 'bg-blue-100 border-2 border-blue-600 shadow-xl shadow-blue-300/50'
                            : 'bg-white border border-gray-300 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-200/60 shadow-lg'
                            }`}
                        aria-label={`Go to ${service.name}`}
                    >
                        <div className="flex flex-col items-start gap-4">
                            <div className={`p-3.5 rounded-full ${currentPath === service.path
                                ? 'bg-blue-200 text-blue-700'
                                : 'bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-600'
                                } transition-colors duration-300`}>
                                {React.cloneElement(service.icon, { className: "w-7 h-7 sm:w-8 sm:h-8" })}
                            </div>
                            <div className="text-left">
                                <h2 className="text-xl font-semibold text-gray-800 mb-1.5 group-hover:text-blue-700 transition-colors">{service.name}</h2>
                                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">{service.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-10 sm:mt-12 p-4 sm:p-5 bg-yellow-50 border-l-4 border-yellow-400 rounded-md text-sm shadow">
                <div className="text-yellow-800 flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 sm:h-6 sm:w-6 mr-2.5 sm:mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-semibold text-sm sm:text-base">Important Note:</p>
                        <span className="ml-1 text-xs sm:text-sm text-yellow-700">
                            Features like Semester Configuration, Student Management, User Management, and Reports are currently under development and will be available soon.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesLayout;