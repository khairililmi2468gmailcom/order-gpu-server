import React from 'react';
import { Link } from 'react-router-dom';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScrool';

const dummyGPUData = [
    {
        imageUrl: '/images/landing/2.jpg', // Ganti dengan gambar GPU Anda
        merk: 'NVIDIA',
        nama: 'GeForce RTX 4090',
        deskripsi: 'Dikembangkan oleh NVIDIA, H100 SXM dengan 80GB memori HBM3 dirancang untuk memberikan performa luar biasa dalam AI dan Komputasi Berkinerja Tinggi (HPC). Solusi ini sangat ideal untuk aplikasi generatif AI dan tugas komputasi berat, memastikan kecepatan dan efisiensi terbaik untuk kebutuhan bisnis Anda.',
        harga: '15.000',
    },
    {
        imageUrl: '/images/landing/3.jpg', // Ganti dengan gambar GPU Anda
        merk: 'AMD',
        nama: 'Radeon RX 7900 XTX',
        deskripsi: 'Dengan 48GB memori GDDR6 dan 18.176 inti CUDA yang sangat kuat, L40S menghadirkan performa luar biasa untuk studio animasi dan rendering profesional. Dengan ray-tracing 212 teraflops, L40S dirancang untuk menghasilkan visualisasi berfidelitas tinggi dan render berkualitas menakjubkan, memastikan setiap detail animasi dan rendering Anda tampil dengan sempurna.',
        harga: '13.500',
    },
    // Tambahkan data GPU lainnya di sini
];

const ProdukLayananSection = React.forwardRef((props, ref) => {
    const [ctaRef, isCtaVisible] = useFadeInOnScroll({ threshold: 0.2 });
    const [cardRef1, isCard1Visible] = useFadeInOnScroll();
    const [cardRef2, isCard2Visible] = useFadeInOnScroll();

    return (
        <section ref={ref} id="produk-layanan-section" className="py-16 px-4  sm:px-6 lg:px-64">
            {/* Title dan Deskripsi Utama */}
            <div className="text-center mb-12 transition-all duration-700 translate-y-6 opacity-0"
                style={{
                    transform: isCard1Visible ? 'translateY(0)' : '',
                    opacity: isCard1Visible ? 1 : 0
                }}>
                <h2 className="lg:text-5xl text-3xl  font-bold text-black">Produk dan Layanan Kami</h2>
                <p className="mt-2 text-gray-600 text-sm">Jelajahi ragam layanan Teknologi Informasi dan Komunikasi inovatif dari kami untuk berbagai pilihan industri.</p>
            </div>

            {/* Daftar Produk GPU (2 Kolom) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 lg:px-48">
                {dummyGPUData.map((gpu, index) => (
                    <div key={index} ref={index === 0 ? cardRef1 : cardRef2}
                        className={`bg-white rounded-lg shadow-md p-6 transition-all duration-700 transform translate-y-6 opacity-0 ${(index === 0 && isCard1Visible) || (index === 1 && isCard2Visible)
                            ? '!translate-y-0 !opacity-100'
                            : ''
                            }`}
                        style={{ transitionDelay: `${index * 200}ms` }}
                    >
                        <img src={gpu.imageUrl} alt={gpu.nama} className="w-full rounded-md mb-4" />
                        <h3 className="text-primary-dark text-2xl font-semibold mb-2">{gpu.merk}</h3>
                        <h2 className="text-xl font-bold mb-2">{gpu.nama}</h2>
                        <p className="text-sm text-gray-700 mb-4">{gpu.deskripsi}</p>
                        <div className="flex space-x-4">
                            <button className="bg-secondary text-white text-xs font-bold py-2 px-2 rounded-full hover:bg-secondary-dark transition duration-300">
                                Pesan Sekarang
                            </button>
                            <span className="text-primary font-semibold rounded-full border-2 border-primary items-center justify-center  py-2 px-4 text-xs hover:bg-secondary hover:text-white">
                                <button>
                                    Mulai dari Rp {gpu.harga}rb / jam
                                </button>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

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

        </section>
    );
});

export default ProdukLayananSection;