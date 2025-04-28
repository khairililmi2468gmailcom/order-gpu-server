import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { useNavigate, useLocation } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const LoadingScreen = () => (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-200 flex justify-center items-center z-50">
        <div className="relative w-16 h-16">
            <svg className="animate-spin h-16 w-16 text-indigo-500" viewBox="0 0 38 38" stroke="currentColor">
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(1 1)" strokeWidth="2">
                        <circle strokeOpacity=".5" cx="18" cy="18" r="18" stroke="currentColor" />
                        <path d="M36 18c0-9.94-8.06-18-18-18" transform="rotate(30 18 18)" stroke="currentColor" strokeDasharray="46.4955,20.7018" />
                    </g>
                </g>
            </svg>
        </div>
    </div>
);

const AdminLayout = ({ children }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isSidebarOpen, setIsSidebarOpen] = useState(localStorage.getItem('isSidebarOpen') === 'true' || window.innerWidth >= 768);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        localStorage.setItem('isSidebarOpen', !isSidebarOpen);
    };
    useEffect(() => {
        const checkAuth = () => {
            const user = localStorage.getItem('user');
            if (token && user && JSON.parse(user)?.role === 'admin') {
                setIsAdminAuthenticated(true);
            } else {
                setIsAdminAuthenticated(false);
            }
        };
    
        checkAuth();
    }, [token]);
    
    // Props untuk Header dan Sidebar pengguna
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('ID');
    const handleLanguageSelect = (lang) => {
        setSelectedLanguage(lang);
        setLanguageDropdownOpen(false);
    };
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const onLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        navigate('/login');
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true);
                localStorage.setItem('isSidebarOpen', 'true');
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (token && user && JSON.parse(user)?.role === 'admin') {
                setIsAdminAuthenticated(true);
            } else {
                setIsAdminAuthenticated(false);
            }
        };

        checkAuth(); // Cek saat komponen mount

        const handleStorageChange = (event) => {
            if (event.key === 'token' || event.key === 'user') {
                checkAuth(); // Cek lagi saat ada perubahan di localStorage
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Tampilkan loading screen saat memeriksa autentikasi
    if (isAdminAuthenticated === null) {
        return <LoadingScreen />;
    }

    // Jika tidak terautentikasi, render hanya NotFound
     if (!isAdminAuthenticated) {
        return (
            <>
                <Header
                    toggleSidebar={toggleSidebar}
                    isLoggedIn={isLoggedIn}
                    onLogout={onLogout}
                    user={user}
                />
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={toggleSidebar}
                    languageDropdownOpen={languageDropdownOpen}
                    setLanguageDropdownOpen={setLanguageDropdownOpen}
                    selectedLanguage={selectedLanguage}
                    handleLanguageSelect={handleLanguageSelect}
                    scrollToSection={scrollToSection}
                />
                <div className="flex-1 overflow-y-auto bg-gray-100 p-2">
                    <NotFound />
                </div>
            </>
        );
    }

    // Jika terautentikasi, render layout admin
    return (
        <div className="flex h-screen overflow-hidden">
            {isSidebarOpen && <AdminSidebar isOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />}
            <div
                className={`flex-1 flex flex-col overflow-hidden transition-padding duration-300 ease-in-out ${isSidebarOpen && !isMobile ? 'pl-64' : 'pl-0'
                    }`}
            >
                <AdminHeader onToggleSidebar={toggleSidebar} setToken={setToken}/>
                <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;