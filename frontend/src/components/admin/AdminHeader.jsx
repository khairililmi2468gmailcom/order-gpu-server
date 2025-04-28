import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCaretDown, faCog, faSignOutAlt, faBars, faRefresh } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';

const AdminHeader = ({ onToggleSidebar }) => {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const navigate = useNavigate();
    const profileRef = useRef(null);

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
        setIsOverlayVisible(!profileDropdownOpen); // Tampilkan overlay saat dropdown terbuka
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
                window.dispatchEvent(new Event('adminLogout'));
                navigate('/login');
            }
        });
    };
    const handleRefreshToken = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                Swal.fire('Error', 'Token tidak ditemukan', 'error');
                return;
            }

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/auth/refresh`, // Menggunakan variabel lingkungan
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { token: newToken } = response.data;
            localStorage.setItem('token', newToken);
            Swal.fire('Berhasil', 'Token berhasil diperbarui!', 'success');
        } catch (error) {
            console.error('Error refreshing token', error);
            Swal.fire('Error', 'Gagal memperbarui token, mohon login ulang.', 'error');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            console.log('Klik di luar:', event.target);
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
        <header className="bg-white shadow-sm p-5  flex justify-between items-center border-b border-gray-200">
            {isOverlayVisible && (
                <div
                    className="fixed top-0 left-0 w-full h-full z-9" // Di bawah dropdown (z-index 10)
                    onClick={() => {
                        setProfileDropdownOpen(false);
                        setIsOverlayVisible(false);
                    }}
                ></div>
            )}
            <div className="flex items-center">
                <button
                    onClick={onToggleSidebar}
                    className="relative text-gray-500 focus:outline-none mr-4" // Hamburger selalu ada
                >
                    <FontAwesomeIcon icon={faBars} className="text-xl" />
                </button>
                <h1 className="text-lg font-semibold text-indigo-700">Admin Dashboard</h1>
            </div>

            <div className="relative mr-4">
                <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center gap-2 focus:outline-none"
                >
                    <FontAwesomeIcon icon={faUserCircle} className="text-xl text-gray-400" />
                    <FontAwesomeIcon icon={faCaretDown} className="text-gray-400" />
                </button>
                {profileDropdownOpen && (
                    <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-md shadow-md w-40 z-10">
                        <button
                            onClick={handleRefreshToken}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none w-full text-left text-sm"
                        >
                            <FontAwesomeIcon icon={faRefresh} className="mr-2 text-gray-400" />
                            Refresh
                        </button>
                        <Link
                            to="/admin/settings"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none text-sm"
                        >
                            <FontAwesomeIcon icon={faCog} className="mr-2 text-gray-400" />
                            Pengaturan
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none w-full text-left text-sm"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-gray-400" />
                            Keluar
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default AdminHeader;