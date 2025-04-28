import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { HomeIcon, ShoppingBagIcon, ServerIcon } from '@heroicons/react/24/outline'; // Menggunakan outline icons
import { ChevronDownIcon } from '@heroicons/react/20/solid'; // Untuk dropdown (jika diperlukan)

const AdminSidebar = ({ isOpen, onToggleSidebar }) => {
    const location = useLocation();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const mobileOpenWidth = 'w-64'; // Lebar sedikit lebih besar untuk kenyamanan sentuh
    const sidebarClasses = `top-0 left-0 h-screen bg-gray-50 text-gray-700 shadow-md z-20 fixed transition-transform duration-300 ease-in-out ${
        isDesktop ? 'w-64 translate-x-0' : (isOpen ? `${mobileOpenWidth} translate-x-0` : '-translate-x-full')
    }`;
    const activeLinkClasses = 'bg-indigo-50 text-indigo-600 font-semibold hover:bg-indigo-100 rounded-md'; // Warna aktif lebih menonjol
    const linkClasses = 'flex items-center p-3 hover:bg-gray-100 transition-colors rounded-md text-sm font-medium text-gray-600'; // Padding lebih kecil, ukuran font lebih kecil
    const logoTextClasses = `${isOpen ? 'block' : 'hidden'} text-lg font-semibold text-indigo-700`; // Warna logo lebih menarik
    const logoIconColor = 'text-indigo-500';
    const hamburgerButtonClasses = 'text-gray-500 focus:outline-none p-2';
    const subMenuLinkClasses = 'flex items-center p-2 pl-8 hover:bg-gray-100 transition-colors rounded-md text-sm text-gray-500'; // Style untuk sub-menu (jika ada)

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
                    <span className={logoTextClasses}>Admin Panel</span>
                </Link>
                {!isDesktop && isOpen && (
                    <button onClick={onToggleSidebar} className={hamburgerButtonClasses}>
                        <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                    </button>
                )}
            </div>
            <nav className="mt-4">
                <ul className="space-y-1 p-4">
                    <li>
                        <Link
                            to="/admin"
                            className={`${linkClasses} ${location.pathname === '/admin' ? activeLinkClasses : ''}`}
                        >
                            <HomeIcon className={`h-5 w-5 mr-2 ${logoIconColor}`} />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/orders"
                            className={`${linkClasses} ${location.pathname.startsWith('/admin/orders') ? activeLinkClasses : ''}`}
                        >
                            <ShoppingBagIcon className={`h-5 w-5 mr-2 ${logoIconColor}`} />
                            <span>Pesanan</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/payments"
                            className={`${linkClasses} ${location.pathname.startsWith('/admin/payments') ? activeLinkClasses : ''}`}
                        >
                            <FontAwesomeIcon icon={faCheck} className={`h-5 w-5 mr-2 ${logoIconColor}`} /> {/* Ikon yang lebih sesuai */}
                            <span>Persetujuan</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/packages"
                            className={`${linkClasses} ${location.pathname.startsWith('/admin/packages') ? activeLinkClasses : ''}`}
                        >
                            <ServerIcon className={`h-5 w-5 mr-2 ${logoIconColor}`} />
                            <span>Paket Server</span>
                        </Link>
                    </li>
                    {/* Contoh dengan sub-menu (jika diperlukan di masa depan) */}
                    {/* <li>
                        <div className="relative">
                            <button
                                className={`${linkClasses} w-full justify-between`}
                                onClick={() => console.log('Toggle Sub Menu')} // Tambahkan logika toggle
                            >
                                <FontAwesomeIcon icon={faCog} className={`h-5 w-5 mr-2 ${logoIconColor}`} />
                                <span>Pengaturan</span>
                                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                            </button>
                            <ul className="space-y-1 mt-1 ml-2">
                                <li>
                                    <Link to="/admin/settings/users" className={subMenuLinkClasses}>
                                        <span>Pengguna</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/settings/roles" className={subMenuLinkClasses}>
                                        <span>Peran</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </li> */}
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