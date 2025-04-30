import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import LoadingGif from '../../assets/GIF/loading.gif'; // Import GIF

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State untuk loading
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setEmailError('');
        let isValid = true;

        if (!email) {
            setEmailError('Email tidak boleh kosong');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Format email tidak valid');
            isValid = false;
        }

        if (isValid) {
            Swal.fire({
                title: 'Konfirmasi',
                text: `Apakah Anda yakin email ini benar: ${email}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, kirim link reset',
                cancelButtonText: 'Batal',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setIsLoading(true); // Set loading menjadi true saat proses dimulai
                    try {
                        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
                        setIsLoading(false); // Set loading menjadi false setelah berhasil
                        Swal.fire({
                            icon: 'success',
                            title: 'Email Terkirim',
                            text: response.data.message || 'Link reset password telah dikirim ke email Anda. Silakan periksa inbox atau spam.',
                        });
                    } catch (error) {
                        setIsLoading(false); // Set loading menjadi false jika terjadi error
                        let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
                        if (error.response) {
                            errorMessage = error.response.data.error || error.response.data.message || errorMessage;
                        } else if (error.request) {
                            errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
                        }
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal Mengirim Email',
                            text: errorMessage,
                        });
                    }
                }
            });
        }
    };

    if (isLoading) {
        return (
            <div className="bg-animated-bg bg-cover bg-center min-h-screen flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <img src={LoadingGif} alt="Loading..." />
                    <p className="mt-4 text-gray-600">Mengirim link reset...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-animated-bg bg-cover bg-center min-h-screen flex justify-center items-center">
            <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-6 text-center">Lupa Password</h2>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${emailError && 'border-red-500'}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        disabled={isLoading} // Disable tombol saat loading
                    >
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Kirim Link Reset
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Kembali ke <Link to="/login" className="text-indigo-600">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;