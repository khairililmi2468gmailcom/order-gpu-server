import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faCaretDown, faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar';

const Header = () => {
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('ID'); // Default language
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const toggleLanguageDropdown = () => setLanguageDropdownOpen(!languageDropdownOpen);
    const location = useLocation();
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const isActiveWithChildren = (path, childrenPaths = []) => {
        const currentPath = location.pathname;
        if (currentPath === path) return true;
        return childrenPaths.some(childPath => currentPath.startsWith(childPath));
    };
    const [activeMenu, setActiveMenu] = useState(null);

    const handleLanguageSelect = (lang) => {
        setSelectedLanguage(lang);
        setLanguageDropdownOpen(false);
        // Tambahkan logika untuk mengganti bahasa di sini
    };


    const navItemClass = (path) => `
    relative px-3 py-2
    ${isActive(path) ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 border-b-2 border-transparent'}
    hover:text-blue-500 hover:border-blue-500
    transition duration-200 cursor-pointer
  `;
    const parentNavItemClass = (path, childrenPaths) => `
  relative px-3 py-2
  ${isActiveWithChildren(path, childrenPaths)
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 border-b-2 border-transparent'
        }
  hover:text-blue-500 hover:border-blue-500
  transition duration-200 cursor-pointer
`;
    return (
        <header>
            {/* Kontak Bar */}
            <div className="bg-gradient-to-r from-primary-dark via-secondary to-primary py-2 text-base text-gray-900 flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-72 shadow-sm">
                {/* Desktop: Email & Telepon di kiri */}
                <div className="w-full animate-slideDown flex flex-col md:flex-row items-start md:items-center justify-between">
                    {/* Kontak kiri desktop */}
                    <div className="hidden md:flex items-center space-x-4 text-white font-bold">
                        <div className="flex items-center text-sm">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                            <span>info@usk.ac.id</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <FontAwesomeIcon icon={faPhone} className="mr-2" />
                            <span>+6221 230 2345</span>
                        </div>
                    </div>

                    {/* Kontak kiri mobile */}
                    <div className="flex md:hidden items-center text-white">
                        <div className="flex items-center text-xs mr-2">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-1" size="sm" />
                            <span>info@usk.ac.id</span>
                        </div>
                        <div className="flex items-center text-xs">
                            <FontAwesomeIcon icon={faPhone} className="mr-1" size="sm" />
                            <span>+6221 230 2345</span>
                        </div>
                    </div>

                    {/* Tombol & dropdown bahasa */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className="bg-transparent border-2 border-white text-white shadow-md rounded-full px-8 py-2.5 text-base font-bold hover:bg-gray-100 hover:text-primary transition duration-300">
                            Login
                        </button>
                        <button className="bg-white text-secondary shadow-md rounded-full px-8 py-2.5 text-base font-bold hover:bg-gray-100 transition duration-300">
                            Hubungi Kami
                        </button>
                        <div className="relative">
                            <button
                                onClick={toggleLanguageDropdown}
                                className="flex items-center gap-2 focus:outline-none text-white text-base font-bold"
                            >
                                {selectedLanguage === 'ID' ? '🇮🇩' : '🇺🇸'}
                                <span>{selectedLanguage}</span>
                                <FontAwesomeIcon icon={faCaretDown} className="text-xs" />
                            </button>
                            {languageDropdownOpen && (
                                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 px-2 py-1">
                                    <button
                                        onClick={() => handleLanguageSelect('ID')}
                                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left focus:outline-none text-base"
                                    >
                                        <span>🇮🇩</span>
                                        <span>ID</span>
                                    </button>
                                    <button
                                        onClick={() => handleLanguageSelect('EN')}
                                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left focus:outline-none text-base"
                                    >
                                        <span>🇺🇸</span>
                                        <span>EN</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Navbar */}
            <nav className="bg-white text-black shadow-md py-6 px-4 md:px-8">
                <div className="max-w-screen-lg mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <img
                            src="/images/usk.svg"
                            alt="USK Logo"
                            className="h-12 w-auto md:h-14 lg:h-16"
                        />
                    </Link>


                    {/* Nav Menu - Centered */}
                    <div className="hidden md:flex items-center space-x-3 mx-auto" onMouseLeave={() => setHoveredMenu(null)}>
                        {/* Beranda */}
                        <NavLink to="/" className={navItemClass('/')} onMouseEnter={() => setHoveredMenu(null)}
                            onClick={() => setActiveMenu('/')}
                        >
                            Beranda
                        </NavLink>

                        {/* Produk & Layanan */}
                        <div
                            className="relative"
                            onMouseEnter={() => setHoveredMenu('produk')}
                            onMouseLeave={() => setHoveredMenu(null)}
                        >
                            <NavLink
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent default link behavior
                                    const produkLayananSection = document.querySelector('#produk-layanan-section');
                                    if (produkLayananSection) {
                                        produkLayananSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                    setHoveredMenu(null); // Close dropdown on click
                                }}
                                className={parentNavItemClass('/semua-layanan', [
                                    '/connectivity',
                                    '/data-center',
                                    '/cybersec',
                                    '/cloudeka',
                                    '/collaboration',
                                    '/skota',
                                    '/healthcare',
                                    '/finance',
                                    '/resources',
                                    '/cross-industry',
                                    '/it-outsourcing'
                                ])}
                                onMouseEnter={() => setHoveredMenu('produk')}
                                onMouseLeave={(e) => {
                                    if (e.relatedTarget instanceof Node && !e.currentTarget.contains(e.relatedTarget)) {
                                        setHoveredMenu(null);
                                    }
                                }}
                            >
                                <span>Produk & Layanan</span>
                                <FontAwesomeIcon icon={faCaretDown} className="ml-1 text-xs" />
                            </NavLink>

                            {hoveredMenu === 'produk' && (
                                <div
                                    className="absolute top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg 
                                w-[90vw] max-w-2xl 
                                lg:w-screen lg:max-w-screen-lg 
                                left-0 right-0 mx-auto 
                                lg:left-1/2 lg:-translate-x-1/2 lg:right-auto lg:mx-0
                                z-20
                              "
                                    onMouseEnter={() => setHoveredMenu('produk')}
                                    onMouseLeave={() => setHoveredMenu(null)}
                                >

                                    <div className="px-8 py-8 grid grid-cols-3 gap-8 font-semibold">
                                        <div>
                                            <h3 className="text-4xl font-extrabold text-gray-700 mb-2">Produk & Layanan</h3>
                                            <NavLink
                                                to="/semua-layanan"
                                                className={({ isActive }) =>
                                                    `group flex items-center gap-2 px-4 py-2 font-semibold ${isActive
                                                        ? 'text-blue-500'
                                                        : 'text-transparent bg-gradient-to-r from-primary-dark via-secondary to-primary bg-clip-text hover:opacity-80'
                                                    }`
                                                }
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        <span>Semua Layanan</span>
                                                        <span className="ml-2 text-sm transition-all duration-500 ease-out group-hover:-translate-x-1">
                                                            <span className={isActive ? 'text-blue-500' : 'text-yellow-500'}>
                                                                <FontAwesomeIcon icon={faArrowRightLong} />
                                                            </span>
                                                        </span>
                                                    </>
                                                )}
                                            </NavLink>

                                            <img src="https://via.placeholder.com/150" alt="Product" className="mt-4 rounded-md" />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-extrabold text-gray-700 mb-2">Lintasarta Infrastructure Solutions</h4>
                                            <NavLink
                                                to="/connectivity"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
                                            >
                                                Lintasarta Connectivity
                                            </NavLink>
                                            <NavLink
                                                to="/data-center"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
                                            >
                                                Lintasarta Data Center
                                            </NavLink>
                                            <NavLink
                                                to="/cybersec"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}

                                            >
                                                SQURA Cybersec
                                            </NavLink>
                                            <NavLink
                                                to="/cloudeka"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}

                                            >
                                                Lintasarta Cloudeka
                                            </NavLink>
                                            <NavLink
                                                to="/collaboration"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}

                                            >
                                                Lintasarta Collaboration
                                            </NavLink>
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-extrabold text-gray-700 mb-2">Lintasarta Industry Solution</h4>
                                            <NavLink
                                                to="/skota"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}

                                            >
                                                SKOTA
                                            </NavLink>
                                            <NavLink
                                                to="/healthcare"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}

                                            >
                                                Owlexa Healthcare
                                            </NavLink>
                                            <NavLink
                                                to="/finance"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}

                                            >
                                                Finance Industry
                                            </NavLink>
                                            <NavLink
                                                to="/resources"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}

                                            >
                                                Resources Platform
                                            </NavLink>
                                            <NavLink
                                                to="/cross-industry"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}

                                            >
                                                Cross Industry
                                            </NavLink>
                                            <NavLink
                                                to="/it-outsourcing"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}

                                            >
                                                IT Outsourcing
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Solusi */}
                        <div
                            className="relative"
                            onMouseEnter={() => setHoveredMenu('solusi')}
                            onMouseLeave={() => setHoveredMenu(null)}
                        >
                            <NavLink
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent default link behavior
                                    const produkLayananSection = document.querySelector('#solusi-section');
                                    if (produkLayananSection) {
                                        produkLayananSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                    setHoveredMenu(null); // Close dropdown on click
                                }}
                                className={parentNavItemClass('/sumber-daya-alam', [
                                    '/sumber-daya-alam',
                                    '/keuangan',
                                    '/manufaktur-ritel-distribusi',
                                    '/sektor-publik'
                                ])}
                                onMouseEnter={() => setHoveredMenu('solusi')}
                                onMouseLeave={() => setHoveredMenu(null)}

                            >
                                <span>Solusi</span>
                                <FontAwesomeIcon icon={faCaretDown} className="ml-1 text-xs" />
                            </NavLink>
                            {hoveredMenu === 'solusi' && (
                                <div
                                    className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-48 z-20"
                                    onMouseEnter={() => setHoveredMenu('solusi')}
                                    onMouseLeave={() => setHoveredMenu(null)}
                                >
                                    <NavLink to="/sumber-daya-alam" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}>
                                        Sumber Daya Alam
                                    </NavLink>
                                    <NavLink to="/keuangan" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}>Keuangan
                                    </NavLink>
                                    <NavLink to="/manufaktur-ritel-distribusi" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}>
                                        Manufaktur, Ritel & Distribusi
                                    </NavLink>
                                    <NavLink to="/sektor-publik" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
                                    >
                                        Sektor Publik
                                    </NavLink>
                                </div>
                            )}
                        </div>

                        {/* Jangkauan Layanan */}
                        <NavLink to="/jangkauan-layanan" className={navItemClass('/jangkauan-layanan')} onMouseEnter={() => setHoveredMenu(null)}>
                            Jangkauan Layanan
                        </NavLink>

                        {/* Tentang Kami */}
                        <div
                            className="relative"
                            onMouseEnter={() => setHoveredMenu('tentang')}
                            onMouseLeave={() => setHoveredMenu(null)}
                        >
                            <NavLink
                                to="#"
                                className={parentNavItemClass('/mengenal-lintasarta', [
                                    '/mengenal-lintasarta',
                                    '/mengapa-lintasarta',
                                    '/karir',
                                    '/csr',
                                    '/whistleblowing'
                                ])} 
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent default link behavior
                                    const produkLayananSection = document.querySelector('#tentang-kami-section');
                                    if (produkLayananSection) {
                                        produkLayananSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                    setHoveredMenu(null); // Close dropdown on click
                                }}
                                onMouseEnter={() => setHoveredMenu('tentang')}
                                onMouseLeave={() => setHoveredMenu(null)}
                            >
                                <span>Tentang Kami</span>
                                <FontAwesomeIcon icon={faCaretDown} className="ml-1 text-xs" />
                            </NavLink>
                            {hoveredMenu === 'tentang' && (
                                <div
                                    className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-48 z-20"
                                    onMouseEnter={() => setHoveredMenu('tentang')}
                                    onMouseLeave={() => setHoveredMenu(null)}
                                >
                                    <NavLink to="/mengenal-lintasarta" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}>Mengenal Lintasarta</NavLink>
                                    <NavLink to="/mengapa-lintasarta" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}>Mengapa Lintasarta</NavLink>
                                    <NavLink to="/karir" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}>Karir</NavLink>
                                    <NavLink to="/csr" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}>CSR</NavLink>
                                    <NavLink to="/whistleblowing" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}>Whistleblowing</NavLink>
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Hamburger Menu (Mobile) */}
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="focus:outline-none text-white">
                            {/* Icon Hamburger (Anda perlu menginstal dan mengimpor icon hamburger) */}
                            <svg className="w-6 h-6 fill-black" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 0 1 1.414 1.414l-4.828 4.829z" />
                                ) : (
                                    <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
            <Sidebar
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                languageDropdownOpen={languageDropdownOpen}
                setLanguageDropdownOpen={setLanguageDropdownOpen}
                selectedLanguage={selectedLanguage}
                handleLanguageSelect={handleLanguageSelect}
            />
        </header>
    );
};

export default Header;