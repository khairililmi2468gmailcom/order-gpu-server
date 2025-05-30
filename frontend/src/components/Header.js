import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faCaretDown, faArrowRightLong, faUserCircle, faBell } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar';
import Swal from 'sweetalert2';
import axios from 'axios';
import NotificationDropdown from '../pages/notifikasi/NotificationDropdown';

const Header = ({ toggleSidebar, isLoggedIn, onLogout, user }) => {
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('ID'); // Default language
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [contactBarVisible, setContactBarVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [navbarTranslateY, setNavbarTranslateY] = useState(0);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const contactBarHeight = 64;
    const scrollThreshold = 40;
    const desktopBreakpoint = 1024;
    const mediumBreakpoint = 768;

    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const [isLoggedInLocal, setIsLoggedInLocal] = useState(false);

    const profileRef = useRef(null);
    const langRef = useRef(null);

    // notifikasi
    const notificationRef = useRef(null); // Add ref for notification dropdown
    const [notifications, setNotifications] = useState([]);  // State for notifications
    const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false); // State for dropdown visibility


    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            
            
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    useEffect(() => {
        setIsLoggedInLocal(isLoggedIn);
    }, [isLoggedIn]);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > lastScrollY;
            const isDesktop = screenWidth >= desktopBreakpoint;
            const isMedium = screenWidth < desktopBreakpoint && screenWidth >= mediumBreakpoint;
            const desktopTranslateY = -contactBarHeight + 20;
            const mobileTranslateY = -contactBarHeight + 20;
            const mediumTranslateY = -contactBarHeight;

            let translationValue = 0;
            if (isDesktop) {
                translationValue = desktopTranslateY;
            } else if (isMedium) {
                translationValue = mediumTranslateY;
            } else {
                translationValue = mobileTranslateY;
            }

            if (currentScrollY > scrollThreshold) {
                setScrolled(true);
                if (isScrollingDown && contactBarVisible) {
                    setContactBarVisible(false);
                    setNavbarTranslateY(translationValue);
                } else if (!isScrollingDown && !contactBarVisible && currentScrollY <= scrollThreshold) {
                    setContactBarVisible(true);
                    setNavbarTranslateY(0);
                }
            } else {
                setScrolled(false);
                if (!contactBarVisible) {
                    setContactBarVisible(true);
                    setNavbarTranslateY(0);
                }
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, contactBarVisible, contactBarHeight, screenWidth]);

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
    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
        if (languageDropdownOpen) {
            setLanguageDropdownOpen(false);
        }
        if (notificationDropdownOpen) {
            setNotificationDropdownOpen(false);
        }
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


    const toggleLanguageDropdown = () => {
        if (profileDropdownOpen) {
            setProfileDropdownOpen(false);
        }
        setLanguageDropdownOpen(!languageDropdownOpen);
    };

    const toggleNotificationDropdown = () => {
        setNotificationDropdownOpen(!notificationDropdownOpen);
        if (profileDropdownOpen) {
            setProfileDropdownOpen(false);
        }
        if (languageDropdownOpen) {
            setLanguageDropdownOpen(false);
        }
    };
    const fetchNotifications = useCallback(async () => {
        if (isLoggedInLocal && user) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/notifications`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setNotifications(response.data);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
                // Handle error (e.g., show error message)
            }
        }
    }, [isLoggedInLocal, user]);

    const handleReadNotification = async (id) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/user/notifications/${id}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // Update state:
            setNotifications(prevNotifications =>
                prevNotifications.map(n =>
                    n.id === id ? { ...n, status: 'read' } : n
                )
            );
            // Fetch again to ensure consistency and get updated data
            fetchNotifications();

        } catch (error) {
            console.error("Failed to mark notification as read:", error);
            // Optionally, show an error message to the user
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleLogout = () => {
        Swal.fire({
            title: 'Apakah Anda yakin ingin keluar?',
            text: `Selamat tinggal, ${user?.name}!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, keluar',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                // Jika konfirmasi "Ya, keluar"
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setProfileDropdownOpen(false);
                navigate('/login');
                onLogout();
            }
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileRef]);
    return (
        <header className="sticky top-0 z-50">
            {/* Kontak Bar */}
            <div className={`bg-gradient-to-r from-primary-dark via-secondary to-primary py-2 text-base text-gray-900 flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-72 shadow-sm transition-all duration-300 ease-in-out z-50 relative // [!code focus]
  ${scrolled ? (contactBarVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0') : 'translate-y-0 opacity-100'}`}>
                {/* Desktop: Email & Telepon di kiri */}
                <div className="w-full animate-slideDown flex flex-col md:flex-row items-start md:items-center justify-between">

                    {/* Kontak kiri mobile */}
                    <div className="flex md:hidden items-center text-white">
                        <div className="flex items-center text-xs mr-2">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-1" size="sm" />
                            <span>support_gpu@cs.usk.ac.id</span>
                        </div>
                        <div className="flex items-center text-xs">
                            <FontAwesomeIcon icon={faPhone} className="mr-1" size="sm" />
                            <span>+62 851 0142 0565</span>
                        </div>
                    </div>


                </div>
            </div>
            {/* Navbar */}
            <nav className={`bg-white text-black shadow-md py-6 lg:py-5 px-4 md:px-8 transition-transform duration-300 ease-in-out z-10 relative`} style={{ transform: `translateY(${navbarTranslateY}px)` }}>
                <div className="max-w-screen-xl mx-auto flex justify-between items-center">
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
                                            <h4 className="text-2xl font-extrabold text-gray-700 mb-2">RentGPU Infrastructure Solutions</h4>
                                            <NavLink
                                                to="/connectivity"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
                                            >
                                                RentGPU Connectivity
                                            </NavLink>
                                            <NavLink
                                                to="/data-center"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}
                                            >
                                                RentGPU Data Center
                                            </NavLink>

                                            <NavLink
                                                to="/cloudeka"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}

                                            >
                                                RentGPU Cloudeka
                                            </NavLink>
                                            <NavLink
                                                to="/collaboration"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}

                                            >
                                                RentGPU Collaboration
                                            </NavLink>
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-extrabold text-gray-700 mb-2">RentGPU Industry Solution</h4>
                                            <NavLink
                                                to="/gpufmipausk"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}

                                            >
                                                GPU FMIPA USK
                                            </NavLink>

                                            <NavLink
                                                to="/finance"
                                                className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}

                                            >
                                                OrderGPU Finance Industry
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
                                className={parentNavItemClass('/mengenal-rentgpufmipausk', [
                                    '/mengenal-rentgpufmipausk',
                                    '/mengapa-rentgpufmipausk',
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
                                    <NavLink to="/mengenal-rentgpufmipausk" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}>Mengenal RentGPU</NavLink>
                                    <NavLink to="/mengapa-rentgpufmipausk" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}>Mengapa RentGPU</NavLink>
                                    <NavLink to="/karir" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}>Karir</NavLink>
                                    <NavLink to="/csr" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}>CSR</NavLink>
                                    <NavLink to="/whistleblowing" className={({ isActive }) => `block px-4 py-2 ${isActive ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'}`}>Whistleblowing</NavLink>
                                </div>
                            )}
                        </div>

                    </div>
                    {/* Tombol & dropdown bahasa */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!isLoggedInLocal ? (
                            <>
                                <NavLink
                                    to="/login"
                                    className="bg-transparent border-2 border-primary text-primary shadow-md rounded-full px-8 py-2.5 text-base font-bold hover:bg-secondary hover:text-white transition duration-300"
                                >
                                    Login
                                </NavLink>

                                <button className="bg-white text-secondary shadow-md border-1 border-gray-500 rounded-full px-8 py-2.5 text-base font-bold hover:bg-gray-100 transition duration-300">
                                    Hubungi Kami
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-6">
                                <div className="relative z-20" ref={notificationRef}>
                                    <button
                                        onClick={toggleNotificationDropdown}
                                        className="focus:outline-none text-gray-600 text-base font-bold relative"
                                    >
                                        <FontAwesomeIcon icon={faBell} className="text-xl" />
                                        {notifications.filter(n => n.status === 'unread').length > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full text-xs text-white w-4 h-4 flex items-center justify-center animate-pulse">
                                                {notifications.filter(n => n.status === 'unread').length}
                                            </span>
                                        )}
                                    </button>
                                    {notificationDropdownOpen && (
                                        <div className="absolute right-0 top-10 z-50">
                                            <NotificationDropdown
                                                notifications={notifications}
                                                onRead={handleReadNotification}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="relative z-20" ref={profileRef}>
                                    <button
                                        onClick={toggleProfileDropdown}
                                        className="flex items-center gap-2 focus:outline-none text-gray-500 text-base font-bold"
                                    >
                                        <FontAwesomeIcon icon={faUserCircle} className="text-xl" />
                                        <span>Profile</span>
                                        <FontAwesomeIcon
                                            icon={faCaretDown}
                                            className={`text-xs transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>
                                    {profileDropdownOpen && (
                                        <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-md shadow-md w-64 z-[1000]">
                                            {user?.role === 'admin' && (
                                                <Link
                                                    to="/admin"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none text-base"
                                                >
                                                    Dashboard
                                                </Link>
                                            )}
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none text-base"
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/listorders"
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none text-base"
                                            >
                                                List Order
                                            </Link>
                                            <Link
                                                to="/ubahpassword"
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none text-base"
                                            >
                                                Ubah Password
                                            </Link>
                                            <button
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left focus:outline-none text-base"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Hamburger Menu (Mobile) */}
                    <div className="md:hidden">
                        <div className='flex items-center min-w-full justify-between'>
                            <div className="flex items-center">
                                {isLoggedInLocal && (
                                    <div className="relative z-20 mr-4" ref={notificationRef}>
                                        <button
                                            onClick={toggleNotificationDropdown}
                                            className="focus:outline-none text-black text-base font-bold relative"
                                        >
                                            <FontAwesomeIcon icon={faBell} className="text-xl" />
                                            {notifications.filter(n => n.status === 'unread').length > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full text-xs text-white w-4 h-4 flex items-center justify-center animate-pulse">
                                                    {notifications.filter(n => n.status === 'unread').length}
                                                </span>
                                            )}
                                        </button>
                                        {notificationDropdownOpen && (
                                            <NotificationDropdown
                                                notifications={notifications}
                                                onRead={handleReadNotification}
                                            />
                                        )}
                                    </div>
                                )}
                                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="focus:outline-none text-white">
                                    {/* Icon Hamburger */}
                                    <svg className="w-6 h-6 fill-black" viewBox="0 0 24 24">
                                        {mobileMenuOpen ? (
                                            <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.41 l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 0 1 1.414 1.414l-4.828 4.829z" />
                                        ) : (
                                            <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
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
                setNotificationDropdownOpen={setNotificationDropdownOpen}
                notificationDropdownOpen={notificationDropdownOpen}
                isLoggedIn={isLoggedIn}
                onLogout={onLogout}
                user={user}
            />
        </header>
    );
};

export default Header;