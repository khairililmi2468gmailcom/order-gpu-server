import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faLightbulb, faChartBar, faUsers, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScrool';
import { ShimmerThumbnail, ShimmerTitle, ShimmerButton } from 'react-shimmer-effects';

const FileSolusi = () => {
    const [solusiRef, isSolusiVisible] = useFadeInOnScroll({ threshold: 0.2 });
    const [loading, setLoading] = useState(true); // Inisialisasi loading menjadi true
    const [contentLoaded, setContentLoaded] = useState(false); // State untuk menandakan konten selesai di-load pertama kali

    useEffect(() => {
        // Efek untuk loading awal
        if (loading) {
            const timer = setTimeout(() => {
                setLoading(false);
                setContentLoaded(true); // Set konten selesai di-load
            }, 1000); // Durasi shimmer loading awal
            return () => clearTimeout(timer);
        }
    }, [loading]); // Hanya berjalan saat 'loading' berubah (dari true ke false)

    const handleSewaGPUClick = (e) => {
        e.preventDefault();
        const produkLayananSection = document.getElementById('produk-layanan-section');
        if (produkLayananSection) {
            produkLayananSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div ref={solusiRef} className={`py-16 transition-opacity duration-700 ${isSolusiVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="container mx-auto text-center">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-8 md:px-16 lg:px-32">
                        {[...Array(4)].map((_, index) => (
                            <div key={index}>
                                <ShimmerThumbnail height={150} rounded />
                                <div className="mt-4">
                                    <ShimmerThumbnail height={20} width={150} />
                                    <ShimmerThumbnail height={15} width={100} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-8 md:px-16 lg:px-32">
                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300 border-b-4 border-primary">
                            <div className="w-16 h-16 mx-auto rounded-full bg-primary text-white flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faFileAlt} size="2x" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Manajemen File Digital</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Kelola dokumen Anda secara efisien, aman, dan terorganisir dalam satu platform terpusat.
                            </p>
                            <Link to="/fitur/manajemen-file" className="mt-4 inline-block text-accent-DEFAULT hover:text-accent-dark font-semibold transition-colors duration-300">
                                Pelajari Lebih Lanjut <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300 border-b-4 border-accent-DEFAULT">
                            <div className="w-16 h-16 mx-auto rounded-full bg-primary text-white flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faChartBar} size="2x" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Analisis Data Mendalam</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Ubah data mentah menjadi wawasan berharga dengan alat analisis kami yang canggih dan mudah digunakan.
                            </p>
                            <Link to="/fitur/analisis-data" className="mt-4 inline-block text-primary-DEFAULT hover:text-primary-dark font-semibold transition-colors duration-300">
                                Lihat Fitur <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300 border-b-4 border-primary">
                            <div className="w-16 h-16 mx-auto rounded-full bg-primary text-white flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faUsers} size="2x" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Kolaborasi Tim Efektif</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Tingkatkan produktivitas tim Anda dengan fitur kolaborasi yang memungkinkan kerja bersama secara *real-time*.
                            </p>
                            <Link to="/fitur/kolaborasi-tim" className="mt-4 inline-block text-accent-DEFAULT hover:text-accent-dark font-semibold transition-colors duration-300">
                                Kolaborasi Sekarang <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                            </Link>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300 border-b-4 border-accent-DEFAULT">
                            <div className="w-16 h-16 mx-auto rounded-full bg-primary text-white flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faLightbulb} size="2x" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Inovasi Solusi Berkelanjutan</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Kami terus berinovasi untuk memberikan solusi digital terbaru yang sesuai dengan kebutuhan Anda yang terus berkembang.
                            </p>
                            <Link to="/fitur/inovasi-solusi" className="mt-4 inline-block text-primary-DEFAULT hover:text-primary-dark font-semibold transition-colors duration-300">
                                Jelajahi Inovasi <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                            </Link>
                        </div>
                    </div>
                )}

                <div className="mt-16 bg-secondary rounded-xl py-12 px-8 sm:px-16">
                    {loading ? (
                        <div className="flex flex-col items-center">
                            <ShimmerTitle className="mb-4" line={2} variant="secondary" />
                            <div className="w-3/4 mb-6">
                                <ShimmerThumbnail height={15} rounded />
                                <ShimmerThumbnail height={15} className="mt-2" rounded />
                                <ShimmerThumbnail height={15} className="mt-2" rounded />
                            </div>
                            <ShimmerButton size="lg" className="mt-4" />
                        </div>
                    ) : (
                        <>
                            <h2 className="lg:text-4xl text-2xl font-semibold text-white mb-6">Siap Menyewa GPU untuk Kebutuhan Anda?</h2>
                            <p className="text-gray-200 mb-8 leading-relaxed">
                                Dapatkan akses ke performa komputasi tinggi dengan pilihan GPU yang fleksibel dan terjangkau. Tingkatkan efisiensi riset dan pengembangan Anda.
                            </p>
                            <Link
                                to="#produk-layanan-section"
                                className="bg-blue-500 hover:bg-blue-600 text-white hover:text-gray-100 font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-md"
                                onClick={handleSewaGPUClick}
                            >
                                Sewa GPU Sekarang
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileSolusi;