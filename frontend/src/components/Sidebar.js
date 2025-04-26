import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faVenusMars, faCaretDown } from '@fortawesome/free-solid-svg-icons'; // Import faCaretDown

const Sidebar = ({
    isOpen,
    onClose,
    languageDropdownOpen,
    setLanguageDropdownOpen,
    selectedLanguage,
    handleLanguageSelect
}) => {
    const activeLinkStyleMobile = ({ isActive }) => ({
        color: isActive ? '#227fc0' : 'gray-700',
        display: 'block',
        padding: '10px 15px',
        textDecoration: 'none',
        borderBottom: '1px solid #e2e8f0',
    });

    return (
        <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <button onClick={onClose} className="absolute top-4 left-4 focus:outline-none">
                {/* Icon Close (Anda perlu menginstal dan mengimpor icon close) */}
                <svg className="wfaEnvelope, faPhone,-6 h-6 fill-current text-gray-700" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 0 1 1.414 1.414l-4.828 4.829z" />
                </svg>
            </button>
            <div className="p-4">
                {/* Link Menu dari Navbar (Mobile) */}
                <NavLink to="/" style={activeLinkStyleMobile}>Beranda</NavLink>
                <NavLink to="/produk-layanan" style={activeLinkStyleMobile}>Produk & Layanan</NavLink>
                {/* Dropdown Produk & Layanan (Jika perlu tampilan list di sidebar) */}
                <NavLink to="/solusi" style={activeLinkStyleMobile}>Solusi</NavLink>
                {/* Dropdown Solusi (Jika perlu tampilan list di sidebar) */}
                <NavLink to="/jangkauan-layanan" style={activeLinkStyleMobile}>Jangkauan Layanan</NavLink>
                <NavLink to="/tentang-kami" style={activeLinkStyleMobile}>Tentang Kami</NavLink>
                {/* Dropdown Tentang Kami (Jika perlu tampilan list di sidebar) */}

                <hr className="my-4 border-t border-gray-300" />

                {/* Tombol dan Dropdown Bahasa (Mobile - 3 Terbawah) */}
                <Link to="/my-la-network" className="block px-4 py-2 text-gray-700 hover:text-blue-500 transition duration-300">My LA Network</Link>
                <Link to="/hubungi-kami" className="block px-4 py-2 text-blue-500 hover:text-blue-700 transition duration-300">Hubungi Kami</Link>
                <div className="relative">
                    <button onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)} className="flex items-center space-x-2 focus:outline-none text-gray-700 py-2 px-4 w-full text-left">
                        {selectedLanguage === 'ID' ? <FontAwesomeIcon icon={faVenusMars} /> : <FontAwesomeIcon icon={faVenusMars} />}
                        <span>{selectedLanguage}</span>
                        <FontAwesomeIcon icon={faCaretDown} className="text-xs" />
                    </button>
                    {languageDropdownOpen && (
                        <div className="ml-4 mt-1">
                            <button onClick={() => handleLanguageSelect('ID')} className="block px-4 py-2 text-gray-700 hover:text-blue-500 transition duration-300 w-full text-left focus:outline-none">
                                {/* <FontAwesomeIcon icon={faFlagId} /> */}
                                <span>ID</span>
                            </button>
                            <button onClick={() => handleLanguageSelect('EN')} className="block px-4 py-2 text-gray-700 hover:text-blue-500 transition duration-300 w-full text-left focus:outline-none">
                                {/* <FontAwesomeIcon icon={faFlagUs} /> */}
                                <span>EN</span>
                            </button>
                            {/* Tambahkan pilihan bahasa lainnya di sini */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;