import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginPage = ({ onLoginSuccess }) => { // Terima onLoginSuccess sebagai props
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const loginPageRef = useRef(null); 

    useEffect(() => {
        if (location.state?.registeredEmail) {
            setEmail(location.state.registeredEmail);
        }
        // Scroll ke atas setelah komponen di-mount
        if (loginPageRef.current) {
            loginPageRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.state?.registeredEmail]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');
        let isValid = true;

        if (!email) {
            setEmailError('Email tidak boleh kosong');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Format email tidak valid');
            isValid = false;
        }

        const passwordValidationError = validatePassword(password);
        if (!password) {
            setPasswordError('Password tidak boleh kosong');
            isValid = false;
        } else if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            isValid = false;
        }

        if (isValid) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
                Swal.fire({
                    icon: 'success',
                    title: 'Login Berhasil',
                    text: `Selamat datang, ${response.data.user.name || 'Pengguna'}!`,
                }).then(() => {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user)); // Kalau mau sekalian simpan user info
                    onLoginSuccess(); // Panggil fungsi props untuk update App.js
                    if (response.data.user.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/#produk-layanan-section'); 
                    }
                });

            } catch (error) {
                let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';

                if (error.response) {
                    const { status, data } = error.response;

                    switch (status) {
                        case 400:
                            errorMessage = data.message || 'Permintaan tidak valid. Periksa data Anda.';
                            break;
                        case 401:
                            errorMessage = data.message || 'Email atau password salah.';
                            break;
                        case 403:
                            errorMessage = data.message || 'Anda tidak memiliki izin untuk mengakses.';
                            break;
                        case 404:
                            errorMessage = data.message || 'Endpoint tidak ditemukan.';
                            break;
                        case 500:
                            errorMessage = 'Server sedang mengalami gangguan. Coba lagi nanti.';
                            break;
                        default:
                            errorMessage = data.message || 'Terjadi kesalahan yang tidak diketahui.';
                    }
                } else if (error.request) {
                    errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Login Gagal',
                    text: errorMessage,
                });
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div ref={loginPageRef} className="bg-animated-bg bg-cover bg-center min-h-screen flex justify-center items-center">
            <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-6 text-center">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
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
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className={`shadow appearance-none border rounded w-full py-2 pr-10 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${passwordError && 'border-red-500'}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                <FontAwesomeIcon icon={showPassword? faEyeSlash : faEye} className="h-5 w-5" />
                            </span>
                        </div>
                        {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <Link to="/forgot-password" className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800">
                            Lupa Password?
                        </Link>
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Belum punya akun? <Link to="/register" className="text-indigo-600">Daftar di sini</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;