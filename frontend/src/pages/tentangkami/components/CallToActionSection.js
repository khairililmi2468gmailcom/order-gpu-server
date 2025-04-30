import React from 'react';
import { Link } from 'react-router-dom';
import { ShimmerButton, ShimmerThumbnail, ShimmerTitle } from 'react-shimmer-effects';

const CallToActionSection = ({ loading, handleSewaGPUClick }) => {
    return (
        <div className="mt-16 bg-blue-500 rounded-xl py-12 px-8 sm:px-16 text-center">
            {loading ? (
                <div className="flex flex-col items-center">
                    <ShimmerTitle className="mb-4" line={2} variant="secondary" />
                    <div className="w-3/4 mb-6">
                        <ShimmerThumbnail height={15} rounded variant="secondary" />
                        <ShimmerThumbnail height={15} className="mt-2" rounded variant="secondary" />
                        <ShimmerThumbnail height={15} className="mt-2" rounded variant="secondary" />
                    </div>
                    <ShimmerButton size="lg" className="mt-4" variant="secondary" />
                </div>
            ) : (
                <>
                    <h2 className="lg:text-4xl  text-2xl font-semibold text-white mb-6">Siap Memulai Penyewaan GPU Anda?</h2>
                    <p className="text-gray-200 mb-8 leading-relaxed">
                        Akses kekuatan komputasi yang Anda butuhkan untuk mempercepat proyek riset, pengembangan AI, *deep learning*, dan tugas komputasi intensif lainnya.
                    </p>
                    <Link
                        to="#produk-layanan-section"
                        className="bg-secondary hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-md"
                        onClick={handleSewaGPUClick}
                    >
                        Sewa GPU Sekarang
                    </Link>
                </>
            )}
        </div>
    );
};

export default CallToActionSection;