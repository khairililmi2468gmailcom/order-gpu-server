import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import bgAdminLoginGif from '../../assets/GIF/BGADMINLOGIN.gif'; // Import GIF

library.add(faEye, faEyeSlash, faExclamationTriangle);

function UbahPassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verifyNewPassword, setVerifyNewPassword] = useState('');
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [verifyNewPasswordVisible, setVerifyNewPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const toggleCurrentPasswordVisibility = () => {
        setCurrentPasswordVisible(!currentPasswordVisible);
    };

    const toggleNewPasswordVisibility = () => {
        setNewPasswordVisible(!newPasswordVisible);
    };

    const toggleVerifyNewPasswordVisibility = () => {
        setVerifyNewPasswordVisible(!verifyNewPasswordVisible);
    };

    const validateNewPassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        return password.length >= 8 && password.length <= 100 && hasUpperCase && hasLowerCase && hasNumber;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (!currentPassword.trim()) {
            setError("Password lama harus diisi.");
            setLoading(false);
            return;
        }

        if (!newPassword.trim()) {
            setError("Password baru harus diisi.");
            setLoading(false);
            return;
        }

        if (!validateNewPassword(newPassword)) {
            setError("Password baru harus minimal 8 karakter, maksimal 100 karakter, dan mengandung huruf besar, huruf kecil, dan angka.");
            setLoading(false);
            return;
        }

        if (!verifyNewPassword.trim()) {
            setError("Verifikasi Password baru harus diisi.");
            setLoading(false);
            return;
        }

        if (newPassword !== verifyNewPassword) {
            setError("Password baru dan Verifikasi Password baru tidak cocok.");
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError("Token tidak ditemukan. Silakan login kembali.");
            setLoading(false);
            return;
        }

        Swal.fire({
            title: 'Konfirmasi',
            text: 'Apakah Anda yakin ingin memperbarui password Anda?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Perbarui',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile/password`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ currentPassword, newPassword }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        if (errorData && errorData.error) {
                            setError(errorData.error);
                        } else {
                            throw new Error("Gagal memperbarui password.");
                        }
                    } else {
                        const responseData = await response.json();
                        Swal.fire(
                            'Berhasil!',
                            responseData.message || 'Password Anda telah berhasil diperbarui.',
                            'success'
                        );
                        setCurrentPassword('');
                        setNewPassword('');
                        setVerifyNewPassword('');
                    }

                } catch (error) {
                    setError(error.message || 'Terjadi kesalahan saat memperbarui password.');
                    Swal.fire(
                        'Gagal!',
                        error.message || 'Terjadi kesalahan saat memperbarui password.',
                        'error'
                    );
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-2 sm:px-4 lg:px-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex max-w-screen-md">
                {/* Gambar/GIF di Samping */}
                <div className="hidden md:block w-1/2 bg-gray-200">
                    <img
                        src={bgAdminLoginGif}
                        alt="Background"
                        className="object-cover h-full w-full"
                    />
                </div>

                {/* Form Ubah Password */}
                <div className="p-8 space-y-8 w-full md:w-1/2">
                    <div>
                        <h2 className="text-center text-2xl font-extrabold text-gray-900">
                            Ubah Password
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Ubah password Anda untuk meningkatkan keamanan.
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                    Password Lama
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type={currentPasswordVisible ? 'text' : 'password'}
                                        id="currentPassword"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className={`w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${error && error.includes("Password lama") ? 'border-red-500 focus:ring-red-500' : ''}`}
                                        placeholder="Password Lama"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                                        onClick={toggleCurrentPasswordVisibility}
                                        title={currentPasswordVisible ? 'Sembunyikan Password Lama' : 'Tampilkan Password Lama'}
                                    >
                                        <FontAwesomeIcon icon={currentPasswordVisible ? faEyeSlash : faEye} className="h-5 w-5" />
                                    </button>
                                </div>
                                {error && error.includes("Password lama harus diisi") && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                        Password lama harus diisi.
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                    Password Baru
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type={newPasswordVisible ? 'text' : 'password'}
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={`w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${error && (error.includes("Password baru") || error.includes("minimal 8 karakter")) ? 'border-red-500 focus:ring-red-500' : ''}`}
                                        placeholder="Password Baru"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                                        onClick={toggleNewPasswordVisibility}
                                        title={newPasswordVisible ? 'Sembunyikan Password Baru' : 'Tampilkan Password Baru'}
                                    >
                                        <FontAwesomeIcon icon={newPasswordVisible ? faEyeSlash : faEye} className="h-5 w-5" />
                                    </button>
                                </div>
                                {error && error.includes("Password baru harus diisi") && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                        Password baru harus diisi.
                                    </p>
                                )}
                                {error && error.includes("minimal 8 karakter") && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                        Password baru harus minimal 8 karakter, maksimal 100 karakter, dan mengandung huruf besar, huruf kecil, dan angka.
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="verifyNewPassword" className="block text-sm font-medium text-gray-700">
                                    Verifikasi Password Baru
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type={verifyNewPasswordVisible ? 'text' : 'password'}
                                        id="verifyNewPassword"
                                        value={verifyNewPassword}
                                        onChange={(e) => setVerifyNewPassword(e.target.value)}
                                        className={`w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${error && error.includes("Verifikasi Password baru") ? 'border-red-500 focus:ring-red-500' : ''}`}
                                        placeholder="Verifikasi Password Baru"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                                        onClick={toggleVerifyNewPasswordVisibility}
                                        title={verifyNewPasswordVisible ? 'Sembunyikan Verifikasi Password Baru' : 'Tampilkan Verifikasi Password Baru'}
                                    >
                                        <FontAwesomeIcon icon={verifyNewPasswordVisible ? faEyeSlash : faEye} className="h-5 w-5" />
                                    </button>
                                </div>
                                {error && error.includes("Verifikasi Password baru harus diisi") && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                        Verifikasi Password baru harus diisi.
                                    </p>
                                )}
                                {error && error.includes("tidak cocok") && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                        Password baru dan Verifikasi Password baru tidak cocok.
                                    </p>
                                )}
                            </div>
                        </div>

                        {error && !error.includes("Password lama harus diisi") && !error.includes("Password baru harus diisi") && !error.includes("Verifikasi Password baru harus diisi") && !error.includes("tidak cocok") && !error.includes("minimal 8 karakter") && !error.includes("Password lama dan baru wajib diisi") && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error! </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        {error && error.includes("Password lama dan baru wajib diisi") && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error! </strong>
                                <span className="block sm:inline">Password lama dan baru wajib diisi.</span>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memperbarui...
                                    </div>
                                ) : (
                                    'Perbarui Password'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UbahPassword;