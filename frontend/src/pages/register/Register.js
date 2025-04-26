import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './css/Register.module.css'; // Import file CSS untuk styling background

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setUsernameError('');
        setEmailError('');
        setPhoneError('');
        setPasswordError('');
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
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
                    name: username,
                    email,
                    password,
                    phone,
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Registrasi Berhasil',
                    text: response.data.message || 'Akun Anda berhasil dibuat',
                });
                navigate('/');
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Registrasi Gagal',
                    text: error.response?.data?.message || 'Terjadi kesalahan saat mendaftar',
                });
            }
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h2>Daftar Akun</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            className={`form-control ${usernameError && 'is-invalid'}`}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {usernameError && <div className="invalid-feedback">{usernameError}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className={`form-control ${emailError && 'is-invalid'}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <div className="invalid-feedback">{emailError}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Nomor Telepon</label>
                        <input
                            type="tel"
                            id="phone"
                            className={`form-control ${phoneError && 'is-invalid'}`}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        {phoneError && <div className="invalid-feedback">{phoneError}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className={`form-control ${passwordError && 'is-invalid'}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Daftar</button>
                </form>
                <p className="mt-3 text-center">
                    Sudah punya akun? <Link to="/login" className="text-primary">Login di sini</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;