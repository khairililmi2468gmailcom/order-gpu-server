import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faEye, faEyeSlash, faExclamationTriangle);

function AdminUbahPassword() {
    const [password, setPassword] = useState('');
    const [verifikasiPassword, setVerifikasiPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [verifikasiPasswordVisible, setVerifikasiPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleVerifikasiPasswordVisibility = () => {
        setVerifikasiPasswordVisible(!verifikasiPasswordVisible);
    };

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        return password.length >= 8 && password.length <= 100 && hasUpperCase && hasLowerCase && hasNumber;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (!password.trim()) {
            setError("Password harus diisi.");
            setLoading(false);
            return;
        }

        if (!validatePassword(password)) {
            setError("Password harus minimal 8 karakter, maksimal 100 karakter, dan mengandung huruf besar, huruf kecil, dan angka.");
            setLoading(false);
            return;
        }

        if (!verifikasiPassword.trim()) {
            setError("Verifikasi Password harus diisi.");
            setLoading(false);
            return;
        }

        if (password !== verifikasiPassword) {
            setError("Password dan Verifikasi Password tidak cocok.");
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!token || !user) {
            setError("Token tidak ditemukan atau data pengguna tidak tersedia. Silakan login kembali.");
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
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/password/${user.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ password }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Gagal memperbarui password.");
                    }

                    const responseData = await response.json();
                    Swal.fire(
                        'Berhasil!',
                        responseData.message || 'Password Anda telah berhasil diperbarui.',
                        'success'
                    );
                    setPassword('');
                    setVerifikasiPassword('');

                } catch (error) {
                    setError(error.message);
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-8">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Ubah Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ubah password Anda untuk meningkatkan keamanan.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                                    onClick={togglePasswordVisibility}
                                    title={passwordVisible ? 'Sembunyikan Password' : 'Tampilkan Password'}
                                >
                                    <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} className="h-5 w-5" />
                                </button>
                            </div>
                            {error && error.includes("Password harus diisi") && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                    Password harus diisi.
                                </p>
                            )}
                            {error && error.includes("minimal 8 karakter") && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                    Password harus minimal 8 karakter, maksimal 100 karakter, dan mengandung huruf besar, huruf kecil, dan angka.
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="verifikasiPassword" className="block text-sm font-medium text-gray-700">
                                Verifikasi Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={verifikasiPasswordVisible ? 'text' : 'password'}
                                    id="verifikasiPassword"
                                    value={verifikasiPassword}
                                    onChange={(e) => setVerifikasiPassword(e.target.value)}
                                    className={`w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    placeholder="Verifikasi Password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                                    onClick={toggleVerifikasiPasswordVisibility}
                                    title={verifikasiPasswordVisible ? 'Sembunyikan Verifikasi Password' : 'Tampilkan Verifikasi Password'}
                                >
                                    <FontAwesomeIcon icon={verifikasiPasswordVisible ? faEyeSlash : faEye} className="h-5 w-5" />
                                </button>
                            </div>
                            {error && error.includes("Verifikasi Password harus diisi") && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                    Verifikasi Password harus diisi.
                                </p>
                            )}
                            {error && error.includes("tidak cocok") && (
                                 <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                    Password dan Verifikasi Password tidak cocok.
                                </p>
                            )}
                        </div>
                    </div>

                    {error && !error.includes("Password harus diisi") && !error.includes("Verifikasi Password harus diisi") && !error.includes("tidak cocok") && !error.includes("minimal 8 karakter") && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error! </strong>
                            <span className="block sm:inline">{error}</span>
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
    );
}

export default AdminUbahPassword;
