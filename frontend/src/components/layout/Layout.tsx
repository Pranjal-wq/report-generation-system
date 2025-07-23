import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../../hooks/useAuth';

export default function Layout() {
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} logout={logout} isMobile={isMobile} />
      <main className={`flex-1 container mx-auto px-4 py-4 ${isMobile ? 'mb-16' : 'mt-20 md:mt-24'}`}>
        <Outlet />
      </main>
      {!isMobile && <Footer />}
    </div>
  );
}