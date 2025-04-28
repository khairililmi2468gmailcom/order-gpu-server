import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCaretDown, faCog, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const AdminHeader = ({ onToggleSidebar }) => {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const profileRef = useRef(null);

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'Apakah Anda yakin ingin keluar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, keluar',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Dispatch custom logout event
                window.dispatchEvent(new Event('adminLogout'));
                navigate('/login'); // Redirect ke halaman login user
            }
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileRef]);

    return (
        <header className="bg-primary text-white p-4 flex justify-between items-center">
            <button
                onClick={onToggleSidebar} // Panggil fungsi toggle sidebar
                className="relative text-white focus:outline-none mr-4 z-2" // Selalu tampil
            >
                <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="relative" ref={profileRef}>
                <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center gap-2 focus:outline-none"
                >
                    <FontAwesomeIcon icon={faUserCircle} className="text-2xl" />
                    <FontAwesomeIcon icon={faCaretDown} />
                </button>
                {profileDropdownOpen && (
                    <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-md shadow-md w-40 z-10">
                        <Link
                            to="/admin/settings" // Anda bisa ganti dengan path yang sesuai
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
                        >
                            <FontAwesomeIcon icon={faCog} className="mr-2" />
                            Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none w-full text-left"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default AdminHeader;