import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faUserCircle } from '@fortawesome/free-solid-svg-icons';

// Fungsi utilitas untuk validasi email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

function Profile() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setUserData(user);
                setName(user.name || '');
                setEmail(user.email || '');
                setPhone(user.phone || '');
            } catch (error) {
                console.error("Gagal memproses data pengguna dari localStorage:", error);
                setError("Gagal mengambil data profil.");
            }
        } else {
            setError("Pengguna belum login.");
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (!name.trim()) {
            setError("Nama harus diisi.");
            setLoading(false);
            return;
        }
        if (name.length > 100) {
            setError("Nama maksimal 100 karakter.");
            setLoading(false);
            return;
        }
        if (!email.trim()) {
            setError("Email harus diisi.");
            setLoading(false);
            return;
        }
        if (email.length > 100) {
            setError("Email maksimal 100 karakter.");
            setLoading(false);
            return;
        }
        if (!isValidEmail(email)) {
            setError("Email tidak valid.");
            setLoading(false);
            return;
        }
        if (phone.length > 12) {
            setError("Nomor telepon maksimal 12 karakter.");
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
            text: 'Apakah Anda yakin ingin memperbarui profil Anda?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Perbarui',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            name: name,
                            email: email,
                            phone: phone,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Gagal memperbarui profil.");
                    }

                    const responseData = await response.json();

                    localStorage.setItem('user', JSON.stringify({
                        ...JSON.parse(localStorage.getItem('user') || '{}'),
                        name: name,
                        email: email,
                        phone: phone
                    }));

                    Swal.fire({
                        title: "Berhasil!",
                        text: responseData.message || "Profil Anda berhasil diperbarui.",
                        icon: "success",
                        confirmButtonText: "OK",
                    });

                } catch (error) {
                    setError(error.message);
                    Swal.fire({
                        title: "Gagal!",
                        text: error.message || "Terjadi kesalahan saat memperbarui profil.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-lg w-full">
                <div className="py-6 px-4 sm:px-6 bg-gray-100 border-b border-gray-200">
                    <h2 className="text-center text-xl font-semibold tracking-tight text-gray-800">
                        <FontAwesomeIcon icon={faUserCircle} className="mr-2 text-gray-500" />
                        Edit Profil
                    </h2>
                    <p className="mt-1 text-center text-sm text-gray-600">
                        Perbarui informasi akun Anda.
                    </p>
                </div>
                <div className="p-6 space-y-4">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nama Lengkap
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value.substring(0, 100))}
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3`}
                                    placeholder="Masukkan nama lengkap Anda"
                                />
                            </div>
                            {error === "Nama harus diisi." && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                    Nama harus diisi.
                                </p>
                            )}
                            {error === "Nama maksimal 100 karakter." && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                    Nama maksimal 100 karakter.
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value.substring(0, 100))}
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3`}
                                    placeholder="Masukkan alamat email Anda"
                                />
                            </div>
                            {error === "Email harus diisi." && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                    Email harus diisi.
                                </p>
                            )}
                            {error === "Email tidak valid." && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                    Email tidak valid.
                                </p>
                            )}
                            {error === "Email maksimal 100 karakter." && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                    Email maksimal 100 karakter.
                                </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Nomor Telepon
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 12) {
                                            setPhone(e.target.value);
                                        }
                                    }}
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 ${error === "Nomor telepon maksimal 12 karakter." ? "border-red-500 focus:ring-red-500" : ""}`}
                                    placeholder="Masukkan nomor telepon Anda (maks. 12 digit)"
                                />
                            </div>
                            {error === "Nomor telepon maksimal 12 karakter." && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1 h-4 w-4" />
                                    Nomor telepon maksimal 12 karakter.
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error! </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memperbarui...
                                    </div>
                                ) : (
                                    <span className="flex items-center">
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2 h-5 w-5 text-indigo-500" />
                                        Simpan Perubahan
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;