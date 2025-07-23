import React, { useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth'
import Navlinks from './Navlinks';
import { LogoutButton } from './LogoutButton';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navbarRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      <div
        ref={navbarRef}
        className={`w-full bg-[#003366] text-white`}
      >
        <div className="bg-[#003366]">
          <div className="max-w-[1200px] mx-auto px-8 max-sm:px-2 flex flex-col">
            <span className="py-1">
              <p className="font-bold">Complaint Management Portal (v1.0.0)</p>
            </span>
            {user?.role && (
              <div className="rounded-lg px-4 max-sm:px-2 py-1 flex justify-between items-center sm:border-2 sm:border-white mb-4">
                {/* Desktop Navigation */}
                <div className="hidden sm:flex items-center justify-between w-full">
                  <Navlinks role={user.role} />
                  <LogoutButton onLogout={logout} />
                </div>

                {/* Mobile Trigger */}
                <div className="sm:hidden flex items-center justify-between w-full">
                  <button onClick={toggleMenu} className="text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <LogoutButton onLogout={logout} />
                </div>

                {/* Slide-Out Menu */}
                {isMenuOpen && (
                  <div
                    onClick={closeMenu}
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
                  />
                )}
                <div
                  className={`sm:hidden fixed top-0 left-0 h-full w-64 bg-[#003366]
                  transform transition-transform duration-300 z-50
                  ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                  <div className="p-4 flex flex-col gap-4">
                    <button onClick={toggleMenu} className="self-end text-white">
                      {/* Cross icon */}
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <Navlinks role={user.role} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;