import React from 'react';
import { Link } from 'react-router-dom';
import NotFoundImage from '../assets/404.png'; 
function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <img src={NotFoundImage} alt="404 Not Found" className="w-6xl mb-8" />
            <h1 className="text-4xl font-bold mb-4">404 - Halaman Tidak Ditemukan</h1>
            <p className="mb-8 text-gray-500">Sepertinya halaman yang kamu cari tidak ada.</p>
            <Link to="/" className="text-primary-dark font-semibold underline">
                Kembali ke Beranda
            </Link>
        </div>
    );
}

export default NotFound;
