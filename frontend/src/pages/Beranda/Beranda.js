import React, { useState, useEffect, useRef } from 'react';
import styles from './css/Beranda.module.css';

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

  return (
    <div className="relative w-full h-[650px] overflow-hidden">
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
  );
};

export default Beranda;