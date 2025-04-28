import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

// Fungsi utilitas untuk validasi email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

function AdminSettings() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Mendapatkan data admin dari local storage saat komponen di-mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
                const storedUser = localStorage.getItem('user');
                const user = storedUser ? JSON.parse(storedUser) : null;
                console.log(user.email + ' ' + user.phone);
                if (user) {
                    setAdminData({
                        id: decodedToken.id,
                        name: user.name,
                        email: user.email,
                    });
                    setName(user.name);
                    setEmail(user.email);
                    setPhone(user.phone || '');
                }

            } catch (error) {
                console.error("Gagal mendekode token:", error);
                setError("Gagal mengambil data admin. Token tidak valid.");
            }
        } else {
            setError("Admin belum login.");
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

        const token = localStorage.getItem('token');
        if (!token || !adminData) {
            setError("Token tidak ditemukan atau data admin tidak tersedia.");
            setLoading(false);
            return;
        }

        // Tambahkan konfirmasi SweetAlert di sini
        Swal.fire({
            title: 'Konfirmasi',
            text: 'Apakah Anda yakin ingin memperbarui profil Anda?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Perbarui',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Jika pengguna mengkonfirmasi, lanjutkan dengan pembaruan data
                try {
                    const response = await fetch(`http://localhost:4000/api/admin/users/${adminData.id}`, {
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
                        throw new Error(errorData.message || "Gagal memperbarui data admin.");
                    }

                    const responseData = await response.json();

                    // Update data di local storage
                    localStorage.setItem('user', JSON.stringify({
                        ...JSON.parse(localStorage.getItem('user') || '{}'), // Pertahankan data lain
                        name: name,
                        email: email,
                        phone: phone
                    }));

                    Swal.fire({
                        title: "Berhasil!",
                        text: responseData.message || "Data admin berhasil diperbarui.",
                        icon: "success",
                        confirmButtonText: "OK",
                    });

                } catch (error) {
                    setError(error.message);
                    Swal.fire({
                        title: "Gagal!",
                        text: error.message || "Terjadi kesalahan saat memperbarui data admin.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                } finally {
                    setLoading(false);
                }
            } else {
                // Jika pengguna membatalkan, hentikan proses
                setLoading(false); // Penting untuk mengatur loading state
                return;
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-8">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Pengaturan Admin
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Perbarui profil Anda untuk pengalaman yang lebih baik.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nama
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value.substring(0, 100))}
                                    className={`w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm
                                        ${error === "Nama harus diisi." || error === "Nama maksimal 100 karakter." ? "border-red-500 focus:ring-red-500" : ""}`}
                                    placeholder="Nama Lengkap"
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
                                    className={`w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm
                                        ${error === "Email harus diisi." || error === "Email tidak valid." || error === "Email maksimal 100 karakter." ? "border-red-500 focus:ring-red-500" : ""}`}
                                    placeholder="Alamat Email"
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
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                                    placeholder="Nomor Telepon"
                                />
                            </div>
                        </div>
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
                                <span className="flex items-center">
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2 h-5 w-5" />
                                    Perbarui Data
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminSettings;
