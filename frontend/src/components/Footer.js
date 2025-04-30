import React from 'react';
import { Link } from 'react-router-dom';
import LogoUSK from '../assets/usk.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-400 text-white py-16 px-5 sm:px-16 md:px-24 lg:px-72">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo dan Deskripsi */}
        <div className="flex flex-col items-start">
          <Link to="/" className="flex items-center mb-4">
            <img src={LogoUSK} alt="Universitas Syiah Kuala" className="h-10 w-auto mr-3" />
            <span className="text-xl font-bold">Universitas Syiah Kuala</span>
          </Link>
          <p className="text-gray-200 leading-relaxed">
            Kampus Jantung Hati Rakyat Aceh, bertekad mencetak lulusan yang berintegritas, profesional, dan berdaya saing global.
          </p>
          <div className="mt-4 flex space-x-4">
            <a href="https://facebook.com/unsyiah1" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </a>
            <a href="https://twitter.com/unsyiah" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
            <a href="https://instagram.com/unsyiahofficial" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300">
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
          </div>
        </div>

        {/* Kontak */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Kontak Kami</h3>
          <ul className="text-gray-200 space-y-2">
            <li className="flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3" />
              <span>Jl. Teuku Nyak Arief, Darussalam, Banda Aceh, 23111</span>
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="mr-3" />
              <span>info@usk.ac.id</span>
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faPhone} className="mr-3" />
              <span>+62 651 7551275</span>
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faGlobe} className="mr-3" />
              <Link to="/" className="hover:text-white">www.usk.ac.id</Link>
            </li>
          </ul>
        </div>

        {/* Tautan Cepat */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
          <ul className="text-gray-200 space-y-2">
            <li>
              <Link to="/tentang" className="hover:text-white">Tentang USK</Link>
            </li>
            <li>
              <Link to="/fakultas" className="hover:text-white">Fakultas</Link>
            </li>
            <li>
              <Link to="/akademik" className="hover:text-white">Akademik</Link>
            </li>
            <li>
              <Link to="/penelitian" className="hover:text-white">Penelitian</Link>
            </li>
            <li>
              <Link to="/layanan" className="hover:text-white">Layanan</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Langganan Newsletter</h3>
          <p className="text-gray-200 mb-2">
            Dapatkan berita terbaru dan pengumuman penting dari Universitas Syiah Kuala langsung ke *inbox* Anda.
          </p>
          <div className="flex w-96">
            <input
              type="email"
              className="bg-white border border-gray-100 rounded-l-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 lg:w-full w-48"
              placeholder="Alamat email Anda"
            />
            <button className="bg-secondary hover:bg-primary rounded-r-md py-2 px-4 font-semibold transition-colors duration-300">
              Berlangganan
            </button>
          </div>
        </div>
      </div>
      <div className="mt-12 text-center text-gray-100 border-t border-gray-100 pt-8">
        <p>&copy; {new Date().getFullYear()} Universitas Syiah Kuala. Hak Cipta Dilindungi.</p>
        <p className="text-sm mt-2">Dikembangkan oleh Tim Kreatif USK</p>
      </div>
    </footer>
  );
};

export default Footer;