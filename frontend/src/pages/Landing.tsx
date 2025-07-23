import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebookF,
    faTwitter,
    faYoutube,
    faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import {
    Eye, Info,
    MapPin,
    Phone,
    Printer,
    Mail,
    Globe,
    AtSign,
    UserCheck,
    GraduationCap
} from 'lucide-react'; // using ClipboardCheck as alternative
import Footer from '../components/layout/Footer';
function NavBar() {
    const handleNavClick = () => {
        if (window.innerWidth < 768) {
            window.location.href = "https://www.manit.ac.in";
        }
    }

    return (
        <header onClick={handleNavClick} className="sticky top-0 z-50 cursor-pointer">
            <div className="bg-gradient-to-r from-[#002147] to-[#00315f] text-white py-4 px-6 shadow-lg">
                <div className="container mx-auto flex flex-wrap items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img
                            src="/manit_sm.png"
                            alt="MANIT Logo"
                            className="h-12 w-auto"
                            loading="lazy"
                        />
                        <div>
                            <h1 className="text-xl font-bold tracking-wider shine-effect" style={{ color: "#ffd700" }}>MANIT BHOPAL</h1>
                            <p className="text-sm font-medium text-blue-200">
                                Maulana Azad National Institute of Technology
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <a
                            href="https://www.manit.ac.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex text-sm flex items-center text-yellow-300 hover:text-yellow-200 transition-colors duration-300 font-medium"
                        >
                            <span>Visit MANIT Website</span>
                            <i data-lucide="external-link" className="ml-1" width="14" height="14"></i>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}

// function Footer() {
//     return (
//         <footer className="bg-gradient-to-b from-black via-gray-900 to-[#1a1a1a] pt-2 pb-1 text-xs relative">
//             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-50"></div>

//             <div className="container mx-auto px-4 relative z-10">
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//                     <div className="transform hover:scale-105 transition-transform duration-300">
//                         <h2 className="text-xl font-bold mb-4 text-blue-400 tracking-wide">
//                             CONTACT US
//                         </h2>
//                         <div className="space-y-3 text-gray-300 hover:text-white transition-colors duration-200">
//                             <p className="flex items-start">
//                                 <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
//                                 <span>Link Road Number 3, Near Kali Mata Mandir, Bhopal, Madhya Pradesh, India 462003</span>
//                             </p>
//                             <p className="flex items-center">
//                                 <Phone className="w-5 h-5 mr-2" />
//                                 <span>+91 755 4051000, 4052000</span>
//                             </p>
//                             <p className="flex items-center">
//                                 <Printer className="w-5 h-5 mr-2" />
//                                 <span>+91-755 2670562</span>
//                             </p>
//                         </div>
//                     </div>

//                     <div className="transform hover:scale-105 transition-transform duration-300">
//                         <h2 className="text-xl font-bold mb-4 text-blue-400 tracking-wide">
//                             GET IN TOUCH
//                         </h2>
//                         <div className="space-y-3 text-gray-300 hover:text-white transition-colors duration-200">
//                             <p className="flex items-center">
//                                 <Mail className="w-5 h-5 mr-2" />
//                                 <span>pro[at]manit[dot]ac[dot]in</span>
//                             </p>
//                             <p className="flex items-center">
//                                 <AtSign className="w-5 h-5 mr-2" />
//                                 <span>officeofdirector[at]manit[dot]ac[dot]in</span>
//                             </p>
//                             <p className="flex items-center">
//                                 <Globe className="w-5 h-5 mr-2" />
//                                 <a
//                                     className="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline"
//                                     href="https://www.manit.ac.in"
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                 >
//                                     www.manit.ac.in
//                                 </a>
//                             </p>
//                         </div>
//                     </div>

//                     <div className="transform hover:scale-105 transition-transform duration-300">
//                         <h2 className="text-xl font-bold mb-4 text-blue-400 tracking-wide">
//                             FOLLOW US
//                         </h2>
//                         <div className="flex justify-center md:justify-start space-x-6">
//                             <a
//                                 href="https://www.facebook.com/people/MANIT-Bhopal/100057525636119/"
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center transform hover:scale-110 hover:bg-blue-500 transition-all duration-300"
//                             >
//                                 <FontAwesomeIcon icon={faFacebookF} className="text-white text-lg" />
//                             </a>
//                             <a
//                                 href="https://www.youtube.com/channel/UCXzZC99puUZuJDiQ09p72cw"
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center transform hover:scale-110 hover:bg-red-500 transition-all duration-300"
//                             >
//                                 <FontAwesomeIcon icon={faYoutube} className="text-white text-lg" />
//                             </a>
//                             <a
//                                 href="https://twitter.com/manitbpl"
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center transform hover:scale-110 hover:bg-blue-300 transition-all duration-300"
//                             >
//                                 <FontAwesomeIcon icon={faTwitter} className="text-white text-lg" />
//                             </a>
//                             <a
//                                 href="https://www.instagram.com/manitbhopl/"
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center transform hover:scale-110 hover:from-purple-500 hover:to-pink-400 transition-all duration-300"
//                             >
//                                 <FontAwesomeIcon icon={faInstagram} className="text-white text-lg" />
//                             </a>
//                         </div>
//                     </div>

//                     <div className="transform hover:scale-105 transition-transform duration-300">
//                         <h2 className="text-xl font-bold mb-4 text-blue-400 tracking-wide">
//                             COLLABORATORS
//                         </h2>
//                         <ul className="list-disc pl-5 space-y-2 text-gray-300 hover:text-white transition-colors duration-200">
//                             <li className="flex items-center">
//                                 <UserCheck className="w-4 h-4 mr-2" />
//                                 Dr. Deepak Singh Tomar , HOD CSE
//                             </li>
//                             <li className="flex items-center">
//                                 <GraduationCap className="w-4 h-4 mr-2" />
//                                 Sudheer  Sir, Rakesh Kundan (MANIT'25)
//                             </li>
//                             <li className="flex items-center">
//                                 <GraduationCap className="w-4 h-4 mr-2" />
//                                 V.Yogananda Reddy, Palak Agrawal (MANIT'26)
//                             </li>
//                             <li className="flex items-center">
//                                 <GraduationCap className="w-4 h-4 mr-2" />
//                                 Pranjal Jain, Mansi Upadhyay (MANIT'26)
//                             </li>
//                             <li className="flex items-center">
//                                 <GraduationCap className="w-4 h-4 mr-2" />
//                                 Sakshi Rai (MANIT'26)
//                             </li>
//                         </ul>
//                     </div>
//                 </div>

//                 <div className="pt-2 mt-2 border-t border-gray-700/50 text-center"></div>
//                 <p className="text-yellow-400 hover:text-white transition-colors duration-200">
//                     © {new Date().getFullYear()} MANIT Bhopal. All Rights Reserved |
//                     <a href="#" className="ml-1 text-blue-400 hover:text-blue-300 transition-colors duration-200">
//                         Terms of Use
//                     </a> and
//                     <a href="#" className="ml-1 text-blue-400 hover:text-blue-300 transition-colors duration-200">
//                         Privacy Policy
//                     </a>
//                 </p>
//             </div>
//         </footer>
//     );
// };

function Landing() {
    const navigate = useNavigate();
    const [isLowConnectivity, setIsLowConnectivity] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }

        const connection = navigator.connection as any;
        if (connection) {
            const updateConnectionStatus = () => {
                const isLow = connection.downlink <= 1 || connection.effectiveType === '2g';
                setIsLowConnectivity(isLow);
                document.body.classList.toggle('low-connectivity', isLow);
            };

            connection.addEventListener('change', updateConnectionStatus);
            updateConnectionStatus();

            return () => connection.removeEventListener('change', updateConnectionStatus);
        }
    }, []);

    useEffect(() => {
        // Simulate a loading delay for better UX
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const goToLogin = () => {
        navigate('/login');
    };

    if (isLoading) {
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
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f8f8f0] to-[#f0f0e8]">
            <NavBar />
            {/* Updated main background color */}
            <main className="flex-1 flex flex-col items-center justify-start py-12 px-4 bg-gradient-to-r from-[#d7e1ec] to-[#f7f9fa]">
                {isLowConnectivity && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded">
                        <div className="flex items-center">
                            <Info size={18} className="mr-2" />
                            <span>Low connectivity mode active</span>
                        </div>
                    </div>
                )}

                <div className="text-center mb-16 max-w-4xl mx-auto">
                    {/* Changed header styling */}
                    <h1 className="text-4xl md:text-5xl font-black mb-6 shine-effect drop-shadow-[0_0_8px_black] ">
                        WELCOME TO MANIT
                    </h1>
                    
                    <div className="space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#002147]">
                            ATTENDANCE
                        </h2>
                        <h3 className="text-xl md:text-2xl font-semibold text-[#004a94]">
                            MANAGEMENT PORTAL
                        </h3>
                        <img src="/eye-with-eyelash.png" alt="Eye Icon" className="mx-auto my-4" style={{ width: '40px', height: '40px' }} />
                    </div>
                </div>

                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
                    <div className="hidden lg:block">
                        <img
                            src="/reportBg1_no_back.png"
                            alt="Attendance BG 1"
                            className="rounded-2xl shadow-lg animate-float"
                            loading="lazy"
                        />
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg card-hover">
                            <h3 className="text-2xl font-bold text-[#002147] mb-4">
                                Attendance Management
                            </h3>
                            <p className="text-gray-700">
                                Streamline your attendance tracking with our intuitive management system.
                                Mark and monitor attendance seamlessly.
                            </p>
                        </div>
                        
                        <div
                            onClick={goToLogin}
                            className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg cursor-pointer card-hover"
                        >
                            <h3 className="text-2xl font-bold text-[#002147] mb-4">
                                Report Generation
                            </h3>
                            <p className="text-gray-700">
                                Generate detailed attendance reports with just a few clicks.
                                Get insights and analytics instantly.
                            </p>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <img
                            src="/reportBg2_no_back.png"
                            alt="Attendance BG 2"
                            className="rounded-2xl shadow-lg animate-float"
                            loading="lazy"
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Landing;