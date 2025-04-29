import React from 'react';
import { useFadeInOnScroll } from '../../../hooks/useFadeInOnScrool';
import { Link } from 'react-router-dom';

const AboutProdukLayanan = React.forwardRef((props, ref) => {
    const [ctaRef, isCtaVisible] = useFadeInOnScroll({ threshold: 0.2 });
    return (
        <div className="relative rounded-lg overflow-hidden lg:px-96">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('/images/landing/2.jpg')`,
                    opacity: 0.7, // opacity background
                }}
            />

            {/* Overlay tambahan */}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>

            {/* Content */}
            <div
                ref={ctaRef}
                className={`relative rounded-lg overflow-hidden text-center text-white py-24 px-4 sm:px-6 lg:px-8 transition-opacity duration-1000 ${isCtaVisible ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <h2 className="text-2xl md:text-4xl font-bold mb-4 select-none">
                    Tingkatkan Produktivitas Bisnis dengan Layanan Kami
                </h2>
                <p className="mb-8 max-w-2xl mx-auto select-none">
                    GPU USK t elah berdedikasi selama lebih dari 30 tahun dalam mengembangkan ragam produk dan layanan untuk memudahkan sistem informasi dan komunikasi korporat.
                </p>
                <Link to="/tentang-kami">
                    <button className="bg-white text-primary-dark font-bold py-3 px-6 rounded-full hover:bg-gray-100 border border-primary transition duration-300">
                        Tentang Kami
                    </button>
                </Link>
            </div>
        </div>

    );
});
export default AboutProdukLayanan;
