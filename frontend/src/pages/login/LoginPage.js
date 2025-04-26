import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (location.state?.registeredEmail) {
            setEmail(location.state.registeredEmail);
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
                    text: response.data.message || 'Anda berhasil login',
                }).then(() => {
                    localStorage.setItem('token', response.data.token);
                    onLoginSuccess(); // Panggil fungsi props untuk memperbarui state di App.js
                    if (response.data.isAdmin) {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Gagal',
                    text: error.response?.data?.message || 'Email atau password salah',
                });
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="bg-animated-bg bg-cover bg-center min-h-screen flex justify-center items-center">
            <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-semibold text-primary mb-6 text-center">Login</h2>
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
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                            </span>
                        </div>
                        {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
                    </div>
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Belum punya akun? <Link to="/register" className="text-primary">Daftar di sini</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;