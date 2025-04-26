import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVenusMars, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

const menuConfig = {
    produk: {
        parentPath: '/semua-layanan',
        childPaths: [
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
        ]
    },
    solusi: {
        parentPath: '/sumber-daya-alam',
        childPaths: [
            '/sumber-daya-alam',
            '/keuangan',
            '/manufaktur-ritel-distribusi',
            '/sektor-publik'
        ]
    },
    tentang: {
        parentPath: '/mengenal-lintasarta',
        childPaths: [
            '/mengenal-lintasarta',
            '/mengapa-lintasarta',
            '/karir',
            '/csr',
            '/whistleblowing'
        ]
    }
};

const Sidebar = ({ isOpen, onClose, languageDropdownOpen, setLanguageDropdownOpen, selectedLanguage, handleLanguageSelect }) => {
    const [expandedMenu, setExpandedMenu] = useState(null);
    const location = useLocation(); // Menggunakan hook useLocation
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose();
            }
        };

        // Handle resize
        const handleResize = () => {
            if (window.innerWidth >= 768 && isOpen) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen, onClose]);

    const scrollbarStyle = {
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    };
    const linkStyle = ({ isActive }, parentConfig) => ({
        color: isActive ? '#227fc0' : '#374151',
        display: 'block',
        padding: '10px 15px',
        textDecoration: 'none',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: parentConfig?.childPaths.includes(location.pathname) ? '#f0f8ff' : 'transparent',
        transition: 'all 0.2s ease',
        ':hover': {
            backgroundColor: '#f3f4f6',
        },
    });
    const linkClasses = (isActive) =>
        `block px-4 py-2 transition-colors duration-200 ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'
        }`;

    const isParentActive = (pathConfig) => {
        return location.pathname === pathConfig.parentPath ||
            pathConfig.childPaths.some(path => location.pathname.startsWith(path));
    };
    const formatMenuName = (path) => {
        const name = path.split('/')[1];
        return name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };


    const renderDropdownMenu = (menuKey) => {
        const config = menuConfig[menuKey];
        return (
            <div className="relative">
                <div
                    className="flex justify-between items-center cursor-pointer hover:bg-gray-100 rounded-md"
                    onClick={() => setExpandedMenu(expandedMenu === menuKey ? null : menuKey)}
                >
                    <NavLink
                        to={config.parentPath}
                        style={(props) => linkStyle(props, config)}
                        isActive={() => isParentActive(config)}
                        className="flex-1"
                        onClick={(e) => {
                            e.preventDefault();
                            setExpandedMenu(expandedMenu === menuKey ? null : menuKey);
                        }}
                    >
                        {menuKey === 'produk' && 'Produk & Layanan'}
                        {menuKey === 'solusi' && 'Solusi'}
                        {menuKey === 'tentang' && 'Tentang Kami'}
                    </NavLink>
                    <FontAwesomeIcon
                        icon={expandedMenu === menuKey ? faCaretUp : faCaretDown}
                        className="text-xs mr-2"
                    />
                </div>
                {expandedMenu === menuKey && (
                    <div className="ml-4" style={scrollbarStyle}>
                        {config.childPaths.map((path, index) => (
                            <NavLink
                                key={index}
                                to={path}
                                style={(props) => linkStyle(props)}
                                onClick={onClose}
                                className={`block pl-6 ${linkClasses(false)} hover:bg-gray-50`} // Tambahkan hover
                            >
                                {formatMenuName(path)}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" />
            )}
            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out 
          ${isOpen ? 'translate-x-0' : 'translate-x-full'} 
          md:hidden z-50 overflow-y-auto`}
                style={scrollbarStyle}
            >
                {/* <button onClick={onClose} className="absolute top-4 left-4 focus:outline-none">
                    <svg className="w-6 h-6 fill-current text-gray-700" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 0 1 1.414 1.414l-4.828 4.829z" />
                    </svg>
                </button> */}
                <div className="p-8">
                    {/* Beranda */}
                    <NavLink
                        to="/"
                        style={(props) => linkStyle(props)}
                        onClick={onClose}
                    >
                        Beranda
                    </NavLink>

                    {/* Produk & Layanan */}
                    {renderDropdownMenu('produk')}

                    {/* Solusi */}
                    {renderDropdownMenu('solusi')}

                    {/* Jangkauan Layanan */}
                    <NavLink
                        to="/jangkauan-layanan"
                        style={(props) => linkStyle(props)}
                        onClick={onClose}
                    >
                        Jangkauan Layanan
                    </NavLink>

                    {/* Tentang Kami */}
                    {renderDropdownMenu('tentang')}

                    <hr className="my-4 border-t border-gray-300" />

                    {/* Bagian bawah tetap */}
                    <Link to="/my-la-network" className="block px-4 py-2 text-gray-700 hover:text-blue-500 transition duration-300"
                        onClick={onClose}>
                        My LA Network
                    </Link>
                    <Link to="/hubungi-kami" className="block px-4 py-2 text-blue-500 hover:text-blue-700 transition duration-300"
                        onClick={onClose}>
                        Hubungi Kami
                    </Link>

                    {/* Dropdown Bahasa */}
                    <div className="relative mt-2">
                        <button
                            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                            className="flex items-center space-x-2 focus:outline-none text-gray-700 py-2 px-4 w-full text-left"
                        >
                            <span className="text-lg">
                                {selectedLanguage === 'ID' ? '🇮🇩' : '🇺🇸'}
                            </span>
                            <span>{selectedLanguage}</span>
                            <FontAwesomeIcon icon={languageDropdownOpen ? faCaretUp : faCaretDown} className="text-xs" />
                        </button>
                        {languageDropdownOpen && (
                            <div className="ml-4 mt-1">
                                <button
                                    onClick={() => {
                                        handleLanguageSelect('ID');
                                        onClose();
                                    }}
                                    className="block px-4 py-2 text-gray-700 hover:text-blue-500 transition duration-300 w-full text-left"
                                >
                                    🇮🇩 ID
                                </button>
                                <button
                                    onClick={() => {
                                        handleLanguageSelect('EN');
                                        onClose();
                                    }}
                                    className="block px-4 py-2 text-gray-700 hover:text-blue-500 transition duration-300 w-full text-left"
                                >
                                    🇺🇸 EN
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>

    );
};

export default Sidebar;