import React from 'react';
import { useFadeInOnScroll } from '../../../hooks/useFadeInOnScrool';
import { Link } from 'react-router-dom';
import { ShimmerTitle, ShimmerText } from 'react-shimmer-effects'; // Ganti ShimmerParagraph dengan ShimmerText

const AboutProdukLayanan = React.forwardRef((props, ref) => {
    const [ctaRef, isCtaVisible] = useFadeInOnScroll({ threshold: 0.2 });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleTentangKamiClick = (e) => {
        e.preventDefault();
        const tentangKamiSection = document.getElementById('tentang-kami-section');
        if (tentangKamiSection) {
            tentangKamiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="relative rounded-lg overflow-hidden ">
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
                className={`relative rounded-lg overflow-hidden text-center text-white py-24 px-6 sm:px-12 lg:px-8 transition-opacity duration-1000 ${isCtaVisible ? 'opacity-100' : 'opacity-0'}`}
            >
                {loading ? (
                    <div className="flex flex-col items-center max-w-xl mx-auto">
                        <ShimmerTitle className="mb-4 w-3/4" line={2} variant="primary" /> {/* Lebar shimmer judul */}
                        <div className="mb-8 w-3/4"> {/* Lebar shimmer paragraf */}
                            <ShimmerText line={1} variant="primary" />
                            <ShimmerText line={1} className="mt-2" variant="primary" />
                            <ShimmerText line={1} className="mt-2 w-1/2" variant="primary" /> {/* Baris terakhir lebih pendek */}
                        </div>
                        <div className="inline-block">
                            <ShimmerText width={120} height={40} rounded variant="primary" /> {/* Shimmer tombol */}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-2xl md:text-4xl font-bold mb-4 select-none">
                                Tingkatkan Produktivitas Bisnis dengan Layanan Kami
                            </h2>
                            <p className="mb-8 max-w-2xl mx-auto select-none">
                                GPU USK telah berdedikasi selama lebih dari 30 tahun dalam mengembangkan ragam produk dan layanan untuk memudahkan sistem informasi dan komunikasi korporat.
                            </p>
                            <Link
                                to="#tentang-kami-section" // Ubah 'to' menjadi '#tentang-kami-section'
                                className="bg-white text-primary-dark font-bold py-3 px-6 rounded-full hover:bg-gray-100 border border-primary transition duration-300"
                                onClick={handleTentangKamiClick} // Tambahkan event handler onClick
                            >
                                Tentang Kami
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>

    );
});
export default AboutProdukLayanan;