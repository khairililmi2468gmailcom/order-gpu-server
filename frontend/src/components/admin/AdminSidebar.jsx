import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(window.innerWidth >= 768); // Buka di desktop, tutup di mobile
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            setIsOpen(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-screen bg-white text-secondary shadow-md z-20 transition-transform duration-300 ease-in-out ${isOpen ? 'w-64 transform-none' : '-translate-x-full w-16'
                } md:transform-none md:w-64`} // Selalu tampil dan lebar di desktop
        >
            <div className="p-4 flex items-center justify-between">
                <Link to="/admin" className={`flex items-center ${isOpen ? 'block' : 'hidden'}`}>
                    <img src="/images/usk.svg" alt="Logo" className="h-8 w-8 mr-2" />
                    <span className="text-lg font-bold">Admin</span>
                </Link>
                <button
                    onClick={toggleSidebar}
                    className="text-white focus:outline-none block md:hidden"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
            <nav className="mt-6">
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/admin"
                            className={`flex items-center p-4 hover:bg-gray-100 transition-colors ${location.pathname === '/admin' ? 'bg-secondary text-white hover:bg-primary' : ''
                                }`}
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0l6-6" />
                            </svg>
                            <span className={`${isOpen ? 'block' : 'hidden'} font-semibold`}>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/orders"
                            className={`flex items-center p-4 hover:bg-gray-100 transition-colors ${location.pathname.startsWith('/admin/orders') ? 'bg-secondary text-white hover:bg-primary' : ''
                                }`}
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-4-4H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2v-5m-1-5l-6-6m0 0L6 9m7 7l6-6" />
                            </svg>
                            <span className={`${isOpen ? 'block' : 'hidden'} font-semibold`}>Pesanan</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/packages"
                            className={`flex items-center p-4 hover:bg-gray-100 transition-colors ${location.pathname.startsWith('/admin/paket-server') ? 'bg-secondary text-white hover:bg-primary' : ''
                                }`}
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>

                            <span className={`${isOpen ? 'block' : 'hidden'} font-semibold`}>Paket Server</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;