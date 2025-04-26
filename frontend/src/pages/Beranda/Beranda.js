import React, { useState, useEffect, useRef } from 'react';
import styles from './css/Beranda.module.css';
import ProdukLayananSection from '../produklayanan/ProdukLayanan';
import { faArrowUpLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const slidesData = [
  {
    imageUrl: '/images/landing/1.jpg',
    title: 'Pilihan GPU Terlengkap',
    description: 'Temukan berbagai pilihan GPU terbaru dan terbaik untuk kebutuhan komputasi Anda.',
    buttonText: 'Lihat Semua GPU',
    link: '/gpu'
  },
  {
    imageUrl: '/images/landing/2.jpg',
    title: 'Performa Terbaik untuk Gaming',
    description: 'Tingkatkan pengalaman gaming Anda dengan GPU berperforma tinggi dari merek terkemuka.',
    buttonText: 'GPU Gaming',
    link: '/gpu/gaming'
  },
  {
    imageUrl: '/images/landing/3.jpg',
    title: 'GPU untuk Profesional Kreatif',
    description: 'Dapatkan GPU yang mendukung kinerja optimal untuk desain grafis, video editing, dan rendering 3D.',
    buttonText: 'GPU Workstation',
    link: '/gpu/workstation'
  },
  {
    imageUrl: '/images/landing/4.jpg',
    title: 'Penawaran dan Diskon Spesial Hari Ini',
    description: 'Jangan lewatkan promo menarik dan diskon khusus untuk berbagai jenis GPU pilihan.',
    buttonText: 'Promo Terbaru',
    link: '/promo'
  }
];
const Beranda = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const textRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const dotsRef = useRef([]);
  const produkLayananRef = useRef(null); // Ref untuk ProdukLayananSection
  const solusiRef = useRef(null);
  const tentangKamiRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) { // kalau sudah scroll lebih dari setengah layar
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const goToPreviousSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slidesData.length - 1 : prevIndex - 1));
    setAnimate(true);
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slidesData.length - 1 ? 0 : prevIndex + 1));
    setAnimate(true);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setAnimate(true);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      goToNextSlide();
    }, 5000); // Ganti gambar setiap 5 detik

    return () => clearInterval(intervalId); // Membersihkan interval saat komponen unmount
  }, []);

  useEffect(() => {
    setAnimate(true);
    const timeoutId = setTimeout(() => {
      setAnimate(false);
    }, 500); // Durasi animasi
    return () => clearTimeout(timeoutId);
  }, [currentIndex]);


  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <><div className="relative w-full h-[700px] overflow-hidden">
      {slidesData.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* Lapisan Warna dengan Opasitas */}
          {index === currentIndex && (
            <div
              className="absolute top-0 left-0 w-full h-full  opacity-20 z-1" // Ubah opacity sesuai keinginan Anda
            />
          )}
          <div
            className="absolute top-0 left-0 w-full h-[60vh] md:h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.imageUrl})`, filter: 'brightness(0.7)' }}
          ></div>

          <div className={`absolute top-1/2 left-5 md:left-10 -translate-y-1/2 text-white z-20 p-5 md:p-12 lg:p-24 xl:p-72 ${animate ? 'slide-in-left' : ''}`}>
            <h2 className="text-2xl md:text-7xl max-w-sm md:max-w-5xl font-bold select-none" ref={textRef}>
              {slide.title}
            </h2>
            <p className="mt-2 select-none max-w-xs md:max-w-xl text-sm md:text-xl" ref={descriptionRef}>
              {slide.description}
            </p>
            <button
              className="mt-4 bg-white text-secondary shadow-md rounded-full px-6 py-2 text-sm md:px-8 md:py-2.5 md:text-base font-bold hover:bg-gray-100 transition duration-300"
              ref={buttonRef}
            >
              {slide.buttonText}
            </button>
          </div>

        </div>
      ))}

      {/* Tombol Navigasi */}
      <div className="absolute bottom-5 left-5 flex space-x-4 z-20">
        <button
          onClick={goToPreviousSlide}
          className={`bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer opacity-75 hover:opacity-100 ${animate ? 'slide-in-left' : ''}`}
          ref={prevButtonRef}
        >
          &lt;
        </button>
        <button
          onClick={goToNextSlide}
          className={`bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer opacity-75 hover:opacity-100 ${animate ? 'slide-in-right' : ''}`}
          ref={nextButtonRef}
        >
          &gt;
        </button>
      </div>

      {/* Tanda Bulat Navigasi */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slidesData.map((_, index) => (
          <button
            key={index}
            className={`rounded-full w-3 h-3 focus:outline-none ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
              } ${animate ? 'slide-in-bottom' : ''}`}
            onClick={() => goToSlide(index)}
            ref={(el) => (dotsRef[index] = el)}
          ></button>
        ))}
      </div>
    </div>
      {/* Bagian Produk & Layanan */}
      <section ref={produkLayananRef} id="produk-layanan-section" className="py-16 bg-gray-100">
        <div >
          <ProdukLayananSection />
        </div>
      </section>
      {/* Bagian Solusi (Asumsi Anda akan menambahkan ini) */}
      <section ref={solusiRef} id="solusi-section" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Solusi Kami</h2>
          {/* Isi bagian solusi di sini */}
          <p>Berbagai solusi inovatif untuk kebutuhan bisnis Anda.</p>
        </div>
      </section>

      {/* Bagian Tentang Kami (Asumsi Anda akan menambahkan ini) */}
      <section ref={tentangKamiRef} id="tentang-kami-section" className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Tentang Kami</h2>
          {/* Isi bagian tentang kami di sini */}
          <p>Lebih lanjut tentang perusahaan dan visi kami.</p>
        </div>
      </section>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-primary hover:bg-secondary text-white rounded-full lg:py-4 lg:px-5 py-2 px-3 shadow-lg transition-opacity duration-300"
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={faArrowUpLong} />
        </button>
      )}
    </>

  );
};

export default Beranda;