import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';
import { Building2, GraduationCap, Info, ExternalLink, Eye, EyeOff } from 'lucide-react'; // Added Eye and EyeOff
import Footer from '../../components/layout/Footer';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [role, setRole] = useState<UserRole>('DIRECTOR');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Added state for password visibility
  const [error, setError] = useState('');
  const [isLowConnectivity, setIsLowConnectivity] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const connection = navigator.connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      const updateConnectionStatus = () => {
        const isLow = connection.downlink <= 1 || connection.effectiveType === '2g';
        setIsLowConnectivity(isLow);
      };
      connection.addEventListener('change', updateConnectionStatus);
      updateConnectionStatus();
      return () => connection.removeEventListener('change', updateConnectionStatus);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password, role);
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate(`/${role.toLowerCase()}/dashboard`);
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#f8f8f0] to-[#f0f0e8]">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <div className="text-lg font-semibold text-blue-600">Loading, please wait...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative ">

      {/* Navbar: Improved UI */}
      <div className="bg-[#002147] text-white py-4 px-6 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-10">
        {/* Left: Logo & Institute Name */}
        <div className="flex items-center space-x-4">
          <img src="/manit_sm.png" alt="MANIT Logo" className="h-10 w-auto" />
          <div>
            <h1 className="text-lg font-semibold shine-effect">MANIT BHOPAL</h1>
            <p className="text-xs md:text-sm">Maulana Azad National Institute of Technology</p>
          </div>
        </div>
        {/* Right: Home Icon */}
        <div className="flex items-center space-x-6">
          <a
            href="https://www.manit.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm flex items-center text-yellow-400 hover:text-blue-200 transition-colors duration-200"
          >
            <span>MANIT</span>
            <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
      </div>
      {/* Navbar spacer to avoid content overlap */}
      <div className="h-16"></div>

      {/* Center: Tagline */}
      <div className="flex justify-center items-center bg-[#1F3C5D] md:block text-yellow-400 font-semibold text-sm tracking-wide pt-8 pb-4 md:text-center">
        <span className="shine-effect">ATMRGS - Analyze, Automate & Generate</span>
      </div>

      {isLowConnectivity && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded">
          <div className="flex items-center">
            <Info size={18} className="mr-2" />
            <span>Low connectivity mode active</span>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[url('/bg.png')] bg-cover bg-no-repeat bg-center ">

        <div className="container mx-auto px-4 py-8 md:py-12 flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="w-full max-w-md">


            {/* Login Card */}
            <div className=" bg-white rounded-2xl shadow-3xl p-6 md:p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto mb-6 transform hover:rotate-3 transition-transform duration-300">
                  <img
                    src="/manit_sm.png"
                    alt="MANIT Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                {/*<h2 className="text-3xl font-bold text-black mb-2 tracking-tight">MANIT Bhopal</h2> */}
                <p className="text-black text-xl font-bold  ">Attendance Report Generation System</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-black/60 backdrop-blur-sm border border-black/80 text-yellow-400 p-4 rounded-lg text-sm text-center animate-shake">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-4 py-3.5 bg-white border border-white rounded-xl text-black placeholder-black/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-blue-200/25"
                  >
                    <option value="FACULTY" style={{ color: "black" }}>Faculty Member</option>
                    <option value="HOD_CSE" style={{ color: "black" }}>HOD</option>
                    <option value="DIRECTOR" style={{ color: "black" }}>Director</option>
                    <option value="ADMIN" style={{ color: "black" }}>Administrator</option>
                  </select>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3.5 bg-white border border-white rounded-xl text-black placeholder-black/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-blue-200/25"
                  />

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'} // Changed type based on showPassword state
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full px-4 py-3.5 bg-white border border-white rounded-xl text-black placeholder-black/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-blue-200/25 pr-10" // Added pr-10 for icon spacing
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-black/60 hover:text-blue-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-[#002147] hover:bg-[#003166] text-yellow-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#1F3C5D] transition-all duration-300 disabled:opacity-50 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="text-center mt-4">
                <a
                  href="https://userid.manit.ac.in/"
                  className="text-black hover:text-gray-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Forgot Password?
                </a>
              </div>

              <div className="mt-8 p-5 bg-blue-100 rounded-xl border border-white/10 hover:bg-blue-200/25 transition-colors duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <Info size={18} className="text-blue-400" />
                  <span className="text-sm text-blue-400 font-medium">Demo Credentials</span>
                </div>
                <div className="space-y-2 text-sm text-blue-400/80">
                  <div className="hover:text-blue-200/25 transition-colors duration-200">Director: director@manit.ac.in</div>
                  <div className="hover:text-blue-200/25 transition-colors duration-200">HOD: hodcse@manit.ac.in</div>
                  <div className="hover:text-blue-200/25 transition-colors duration-200">Faculty: faculty@manit.ac.in</div>
                  <div className="hover:text-blue-200/25 transition-colors duration-200">Admin: admin@manit.ac.in</div>
                  <div className="text-xs text-blue-400/60 mt-3 pt-2 border-t border-white/10">
                    Password for all accounts: password123
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}