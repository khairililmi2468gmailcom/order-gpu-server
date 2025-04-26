import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import Gif from '../../assets/GIF/BGADMINLOGIN.gif'; 

const LoginAdminPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleLoginAdmin = async (e) => {
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

        if (!password) {
            setPasswordError('Password tidak boleh kosong');
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError('Password minimal 8 karakter');
            isValid = false;
        }

        if (isValid) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
                Swal.fire({
                    icon: 'success',
                    title: 'Login Admin Berhasil',
                    text: response.data.message || 'Anda berhasil login sebagai admin',
                });
                localStorage.setItem('token', response.data.token);
                navigate('/admin');
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Admin Gagal',
                    text: error.response?.data?.message || 'Email atau password salah',
                });
            }
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden flex w-4/5 md:w-3/4 lg:w-2/3">
                <div className="p-8 flex flex-col justify-center flex-1">
                    <h2 className="text-2xl font-semibold text-primary mb-6">Login Admin</h2>
                    <form onSubmit={handleLoginAdmin} className="space-y-4">
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
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${passwordError && 'border-red-500'}`}
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
                            Login Admin
                        </button>
                    </form>
                </div>
                <div className="hidden md:flex flex-1 bg-primary text-white justify-center items-center p-8">
                    <img src={"/assets/admin-login.svg"} alt="Admin Illustration" className="max-w-full h-auto" />
                </div>
            </div>
        </div>
    );
};

export default LoginAdminPage;