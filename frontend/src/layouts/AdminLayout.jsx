import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isSidebarOpen, setIsSidebarOpen] = useState(localStorage.getItem('isSidebarOpen') === 'true' || window.innerWidth >= 768);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        localStorage.setItem('isSidebarOpen', !isSidebarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true); // Default terbuka di desktop
                localStorage.setItem('isSidebarOpen', 'true');
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const checkAuthOnMount = () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (!token || !user || JSON.parse(user)?.role !== 'admin') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login-admin'); // Atau '/login'
            }
        };

        checkAuthOnMount();

        const handleStorageChange = (event) => {
            if (event.key === 'token' && !localStorage.getItem('token')) {
                localStorage.removeItem('user');
                navigate('/login-admin');
            }
            if (event.key === 'user' && localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))?.role !== 'admin') {
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [navigate]);

    return (
        <div className="flex h-screen overflow-hidden">
            {isSidebarOpen && <AdminSidebar isOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />}
            <div
                className={`flex-1 flex flex-col overflow-hidden transition-padding duration-300 ease-in-out ${isSidebarOpen && !isMobile ? 'pl-64' : 'pl-0'
                    }`}
            >
                <AdminHeader onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;