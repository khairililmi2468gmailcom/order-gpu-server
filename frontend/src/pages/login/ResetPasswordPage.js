import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSearchParams } from 'react-router-dom'; // Import hook untuk query params
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPasswordPage = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams(); // Dapatkan objek query params

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token'); // Ambil nilai token dari query string
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const validateNewPassword = (password) => {
        if (password.length < 8) {
            return 'Password minimal 8 karakter';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password harus mengandung setidaknya satu huruf besar';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password harus mengandung setidaknya satu angka';
        }
        return ''; // Password valid
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setNewPasswordError('');
        setConfirmNewPasswordError('');
        let isValid = true;

        const newPasswordValidationError = validateNewPassword(newPassword);
        if (!newPassword) {
            setNewPasswordError('Password baru tidak boleh kosong');
            isValid = false;
        } else if (newPasswordValidationError) {
            setNewPasswordError(newPasswordValidationError);
            isValid = false;
        }

        if (!confirmNewPassword) {
            setConfirmNewPasswordError('Konfirmasi password tidak boleh kosong');
            isValid = false;
        } else if (newPassword !== confirmNewPassword) {
            setConfirmNewPasswordError('Konfirmasi password tidak cocok');
            isValid = false;
        }

        if (isValid) {
            Swal.fire({
                title: 'Konfirmasi',
                text: 'Apakah Anda yakin ingin mengubah password Anda?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, ubah password',
                cancelButtonText: 'Batal',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, { token, newPassword });
                        Swal.fire({
                            icon: 'success',
                            title: 'Password Berhasil Diubah',
                            text: response.data.message || 'Password Anda berhasil diubah. Silakan login dengan password baru Anda.',
                        }).then(() => {
                            navigate('/login');
                        });
                    } catch (error) {
                        let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
                        if (error.response) {
                            errorMessage = error.response.data.error || error.response.data.message || errorMessage;
                        } else if (error.request) {
                            errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
                        }
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal Mengubah Password',
                            text: errorMessage,
                        });
                    }
                }
            });
        }
    };


    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmNewPasswordVisibility = () => {
        setShowConfirmNewPassword(!showConfirmNewPassword);
    };
    return (
        <div className="bg-animated-bg bg-cover bg-center min-h-screen flex justify-center items-center">
            <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-6 text-center">Reset Password</h2>
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                        <label htmlFor="token" className="block text-gray-700 text-sm font-bold mb-2">
                            Token Reset Password
                        </label>
                        <input
                            type="text"
                            id="token"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            readOnly
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            Password Baru
                        </label>
                        <div className="relative">

                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                id="newPassword"
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${newPasswordError && 'border-red-500'}`}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer" onClick={toggleNewPasswordVisibility}>
                                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                            </div>
                        </div>
                        {newPasswordError && <p className="text-red-500 text-xs italic">{newPasswordError}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            Konfirmasi Password Baru
                        </label>
                        <div className="relative">

                            <input
                                type={showConfirmNewPassword ? 'text' : 'password'}
                                id="confirmNewPassword"
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${confirmNewPasswordError && 'border-red-500'}`}
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer" onClick={toggleConfirmNewPasswordVisibility}>
                                <FontAwesomeIcon icon={showConfirmNewPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                            </div>
                        </div>
                        {confirmNewPasswordError && <p className="text-red-500 text-xs italic">{confirmNewPasswordError}</p>}
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Reset Password
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Kembali ke <Link to="/login" className="text-indigo-600">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;