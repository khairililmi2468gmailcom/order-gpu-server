import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { HomeIcon, ShoppingBagIcon, ServerIcon } from '@heroicons/react/24/solid';

const AdminSidebar = ({ isOpen, onToggleSidebar }) => {
    const location = useLocation();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const mobileOpenWidth = 'w-60';
    const sidebarClasses = `top-0 left-0 h-screen text-gray-700 shadow-md z-20 fixed bg-blue-900 transition-transform duration-300 ease-in-out ${ // Latar belakang biru tua USK
        isDesktop ? 'w-64 translate-x-0' : (isOpen ? `${mobileOpenWidth} translate-x-0` : '-translate-x-full')
        }`;
    const activeLinkClasses = 'bg-green-700 text-white hover:bg-green-800';
    const linkClasses = 'flex items-center p-4 hover:bg-blue-800 transition-colors rounded-md text-gray-300';
    const logoTextClasses = `${isOpen ? 'block' : 'hidden'} text-lg font-bold text-white`;
    const logoIconColor = 'text-white';
    const hamburgerButtonClasses = 'text-gray-300 focus:outline-none p-2';

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={sidebarClasses}>
            <div className="p-4 flex items-center justify-between">
                <Link to="/admin" className={`flex items-center ${isOpen ? 'block' : (isDesktop ? 'block' : 'hidden')}`}>
                    <img src="/images/usk.svg" alt="Logo USK" className={`h-8 w-8 mr-3 ${logoIconColor}`} />
                    <span className={logoTextClasses}>Admin</span>
                </Link>
                {!isDesktop && isOpen && (
                    <button onClick={onToggleSidebar} className={hamburgerButtonClasses}>
                        <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                    </button>
                )}
            </div>
            <nav className="mt-6">
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/admin"
                            className={`${linkClasses} ${location.pathname === '/admin' ? activeLinkClasses : ''}`}
                        >
                            <HomeIcon className={`h-5 w-5 mr-2 ${logoIconColor}`} />
                            <span className={`${isOpen ? 'block' : (isDesktop ? 'block' : 'hidden')} font-medium`}>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/orders"
                            className={`${linkClasses} ${location.pathname.startsWith('/admin/orders') ? activeLinkClasses : ''}`}
                        >
                            <ShoppingBagIcon className={`h-5 w-5 mr-2 ${logoIconColor}`} />
                            <span className={`${isOpen ? 'block' : (isDesktop ? 'block' : 'hidden')} font-medium`}>Pesanan</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/packages"
                            className={`${linkClasses} ${location.pathname.startsWith('/admin/packages') ? activeLinkClasses : ''}`}
                        >
                            <ServerIcon className={`h-5 w-5 mr-2 ${logoIconColor}`} />
                            <span className={`${isOpen ? 'block' : (isDesktop ? 'block' : 'hidden')} font-medium`}>Paket Server</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            {!isDesktop && !isOpen && (
                <div className="absolute top-4 right-4">
                    <button onClick={onToggleSidebar} className={hamburgerButtonClasses}>
                        <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminSidebar;