import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

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

    const handleRegister = async (e) => {
        e.preventDefault();
        setUsernameError('');
        setEmailError('');
        setPhoneError('');
        setPasswordError('');
        setConfirmPasswordError('');
        let isValid = true;

        if (!username) {
            setUsernameError('Username tidak boleh kosong');
            isValid = false;
        }

        if (!email) {
            setEmailError('Email tidak boleh kosong');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Format email tidak valid');
            isValid = false;
        }

        if (!phone) {
            setPhoneError('Nomor telepon tidak boleh kosong');
            isValid = false;
        } else if (phone.length > 15) {
            setPhoneError('Nomor telepon maksimal 15 karakter');
            isValid = false;
        }

        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            isValid = false;
        }

        if (!confirmPassword) {
            setConfirmPasswordError('Konfirmasi password tidak boleh kosong');
            isValid = false;
        } else if (confirmPassword !== password) {
            setConfirmPasswordError('Konfirmasi password tidak sesuai');
            isValid = false;
        }

        if (isValid) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
                    name: username,
                    email,
                    password,
                    phone,
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Registrasi Berhasil',
                    text: response.data.message || 'Akun Anda berhasil dibuat',
                }).then(() => {
                    navigate('/login', { state: { registeredEmail: email } }); // Kirim email sebagai state
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Registrasi Gagal',
                    text: error.response?.data?.message || 'Terjadi kesalahan saat mendaftar',
                });
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="register-page bg-cover bg-center min-h-screen flex justify-center items-center">
            <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-semibold text-primary mb-6 text-center">Daftar Akun</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${usernameError && 'border-red-500'}`}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {usernameError && <p className="text-red-500 text-xs italic">{usernameError}</p>}
                    </div>
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
                        <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                            Nomor Telepon
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            maxLength="15"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${phoneError && 'border-red-500'}`}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        {phoneError && <p className="text-red-500 text-xs italic">{phoneError}</p>}
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            className={`shadow appearance-none border rounded w-full py-2 pr-10 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${passwordError && 'border-red-500'}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className="absolute inset-y-0 mt-4 right-0 pr-3 flex items-center text-gray-500 cursor-pointer" onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                        </span>
                        {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
                    </div>
                    <div className="relative">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            Konfirmasi Password
                        </label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            className={`shadow appearance-none border rounded w-full py-2 pr-10 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${confirmPasswordError && 'border-red-500'}`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span className="absolute inset-y-0 mt-4 right-0 pr-3 flex items-center text-gray-500 cursor-pointer" onClick={toggleConfirmPasswordVisibility}>
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                        </span>
                        {confirmPasswordError && <p className="text-red-500 text-xs italic">{confirmPasswordError}</p>}
                    </div>
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Daftar
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Sudah punya akun? <Link to="/login" className="text-primary">Login di sini</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;