import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    Home,
    Settings,
    X,
    LogOut,
    Layout,
    CheckSquare
} from 'lucide-react';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const sidebarItems = [
        { name: 'Dashboard', icon: Home, path: '/admin/dashboard' },
        { name: 'Services', icon: Layout, path: '/admin/services' },
        { name: 'Approvals', icon: CheckSquare, path: '/admin/approvals' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isActive = (path: string) => {
        if (path === '/admin/services' && location.pathname.includes('/admin/services')) {
            return true;
        }
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Hidden on mobile by default, only shown on desktop */}
            <div className={`
                fixed top-0 left-0 h-full bg-[#002147] text-white z-40 transition-all duration-300 
                -translate-x-full md:translate-x-0 md:shadow-lg md:shadow-blue-900/20 md:relative md:w-64
            `}>
                <div className="p-4 border-b border-white/20 flex items-center justify-center">
                    <h1 className="text-xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] shine-effect">MANIT ATM-RGS</h1>
                </div>

                <div className="overflow-y-auto h-[calc(100%-64px)]">
                    <nav className="mt-6 px-4">
                        <ul className="space-y-2">
                            {sidebarItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className={`
                                            flex items-center px-4 py-3 rounded-lg transition-all duration-200
                                            ${isActive(item.path)
                                                ? 'bg-white/15 text-white font-medium shadow-inner'
                                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                            }
                                        `}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="px-4 mt-12 absolute bottom-4 left-0 right-0">
                        <div className="border-t border-white/20 pt-4">
                            <button
                                className="flex items-center w-full px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 shadow-md shadow-blue-100/50 p-4 flex items-center justify-between sticky top-0 z-30">
                    {/* Center MANIT ATM-RGS for Mobile, Left-aligned for Desktop */}
                    <h1 className={`text-xl font-bold ${isMobile ? 'mx-auto' : 'text-blue-800'} drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]`}
                        style={isMobile ? {color: 'rgba(255, 215, 0, 0.7)'} : {}}>
                        {isMobile ? 'MANIT ATM-RGS' : 'Admin Portal'}
                    </h1>

                    {/* User profile - Only visible on desktop */}
                    {!isMobile && (
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-4">Welcome, {user?.name}</span>
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                                {user?.name?.substring(0, 1).toUpperCase() || 'A'}
                            </div>
                        </div>
                    )}
                </header>

                {/* Content Area */}
                <main className={`flex-1 overflow-y-auto bg-gray-50 p-4 ${isMobile ? 'pb-20' : ''}`}>
                    <Outlet />
                </main>

                {/* Mobile Bottom Navigation */}
                {isMobile && (
                    <nav className="fixed bottom-0 left-0 right-0 bg-[#002147] text-white z-30 shadow-lg shadow-blue-900/30">
                        <div className="flex justify-around">
                            {sidebarItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex flex-col items-center py-3 px-3 ${isActive(item.path)
                                            ? 'text-white font-medium bg-white/10 rounded-t-lg'
                                            : 'text-white/70 hover:text-white'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5 mb-1" />
                                    <span className="text-xs">{item.name}</span>
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex flex-col items-center py-3 px-3 text-white/70 hover:text-white"
                            >
                                <LogOut className="w-5 h-5 mb-1" />
                                <span className="text-xs">Logout</span>
                            </button>
                        </div>
                    </nav>
                )}
            </div>
        </div>
    );
};

export default AdminLayout;
