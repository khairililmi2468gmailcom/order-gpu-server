import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrashIcon, GiftIcon, PhotoIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { AiOutlineSortDescending, AiOutlineSortAscending } from "react-icons/ai";
import {
    ShimmerTitle,
    ShimmerText,
    ShimmerTable,
    ShimmerButton,
    ShimmerThumbnail
} from 'react-shimmer-effects';
import { ClockIcon, DownloadIcon, PlayIcon } from 'lucide-react';
import moment from 'moment';
import InvoiceButton, { generateOrderPDF } from '../../../utils/generateInvoicePDF';
import countdownSound from '../../../assets/audio/10sec-digital-countdown.mp3';

const statusAlias = {
    pending_payment: 'Pending',
    pending_approval: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    active: 'Active',
    completed: 'Completed',
};

const paymentStatusAlias = {
    pending: 'Pending',
    paid: 'Paid',
    rejected: 'Rejected',
    verified: 'Terverifikasi',
};

const filterOptions = [
    { value: 'package_name', label: 'Nama Paket' },
    { value: 'duration_hours', label: 'Durasi' },
    { value: 'total_cost', label: 'Harga' },
    { value: 'is_active', label: 'Status Token', hasSubOptions: true },
    { value: 'status', label: 'Status Pesanan', hasSubOptions: true },
    { value: 'payment_status', label: 'Status Pembayaran', hasSubOptions: true },
    { value: 'created_at', label: 'Tanggal Pesan' },
];

const ListOrders = () => {
    const [refreshInterval, setRefreshInterval] = useState(5000);
    const [remainingTimes, setRemainingTimes] = useState({});
    const [expiredOrders, setExpiredOrders] = useState({});
    const [isCountingDown, setIsCountingDown] = useState({});
    const audioRef = useRef(new Audio(countdownSound));
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [showJustExpiredMessage, setShowJustExpiredMessage] = useState({});

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    // Paginasi
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [pageCount, setPageCount] = useState(0);

    // Filter dan Sort
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState({ created_at: null }); // Default filter tanggal
    const [sortDirection, setSortDirection] = useState('desc'); // Default urutkan terbaru dulu
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [filterDropdownRef, setFilterDropdownRef] = useState(null);
    const [filterLabel, setFilterLabel] = useState('Tanggal Pesan'); // Label default filter
    const [openSubMenu, setOpenSubMenu] = useState(null);

    // Modal Token
    const [selectedToken, setSelectedToken] = useState(null);
    const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
    const [isOpeningGift, setIsOpeningGift] = useState(false);
    const giftModalRef = useRef(null);
    const [selectedDomain, setSelectedDomain] = useState(null);

    // Modal Edit Bukti Pembayaran
    const [isEditProofModalOpen, setIsEditProofModalOpen] = useState(false);
    const [selectedOrderForProof, setSelectedOrderForProof] = useState(null);
    const [paymentProofFile, setPaymentProofFile] = useState(null);



    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Efek untuk menandai interaksi pengguna pertama
    useEffect(() => {
        const handleInteraction = () => {
            setHasUserInteracted(true);
            document.removeEventListener('mousedown', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
        };

        document.addEventListener('mousedown', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);
        document.addEventListener('keydown', handleInteraction);

        return () => {
            document.removeEventListener('mousedown', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newRemainingTimes = {};
            const currentExpiredOrders = { ...expiredOrders };
            const newIsCountingDown = {};
            const newShowJustExpiredMessage = { ...showJustExpiredMessage };

            orders.forEach(order => {
                if (order.end_date) {
                    const endTime = moment(order.end_date);
                    const now = moment();
                    const duration = moment.duration(endTime.diff(now));
                    const remainingSeconds = Math.floor(duration.asSeconds());

                    if (remainingSeconds >= 0) {
                        newRemainingTimes[order.id] = {
                            hours: duration.hours(),
                            minutes: duration.minutes(),
                            seconds: duration.seconds(),
                            isAboutToExpire: remainingSeconds <= 30,
                            isExpired: remainingSeconds === 0,
                            isWithinCountdown: remainingSeconds <= 10 && remainingSeconds > 0,
                        };
                        // Aktifkan animasi hanya pada detik saat berada dalam 10 detik terakhir
                        newIsCountingDown[order.id] = newRemainingTimes[order.id].isWithinCountdown;

                        // Putar suara hanya sekali saat tepat mencapai 10 detik terakhir dan setelah interaksi
                        if (remainingSeconds === 10 && hasUserInteracted) {
                            // console.log("Audio diputar");
                            audioRef.current.play().catch(error => {
                                // console.error("Gagal memutar audio:", error);
                            });
                        }

                        // Set showJustExpiredMessage hanya jika order baru pertama kali expired
                        if (remainingSeconds === 0 && !currentExpiredOrders[order.id]) {
                            currentExpiredOrders[order.id] = true;
                            newShowJustExpiredMessage[order.id] = true;
                            setTimeout(() => {
                                const updatedShowJustExpiredMessage = { ...showJustExpiredMessage };
                                updatedShowJustExpiredMessage[order.id] = false;
                                setShowJustExpiredMessage(updatedShowJustExpiredMessage);
                            }, 1500);
                            // fetch(...)
                        }
                    } else {
                        newRemainingTimes[order.id] = {
                            hours: 0,
                            minutes: 0,
                            seconds: 0,
                            isAboutToExpire: true,
                            isExpired: true,
                            isWithinCountdown: false,
                        };
                        currentExpiredOrders[order.id] = true;
                        newIsCountingDown[order.id] = false;
                        // Set showJustExpiredMessage hanya jika order baru pertama kali expired
                        if (!currentExpiredOrders[order.id]) {
                            newShowJustExpiredMessage[order.id] = true;
                            setTimeout(() => {
                                const updatedShowJustExpiredMessage = { ...showJustExpiredMessage };
                                updatedShowJustExpiredMessage[order.id] = false;
                                setShowJustExpiredMessage(updatedShowJustExpiredMessage);
                            }, 1500);
                        }
                    }
                }
            });
            setRemainingTimes(newRemainingTimes);
            setExpiredOrders(currentExpiredOrders);
            setIsCountingDown(newIsCountingDown);
            setShowJustExpiredMessage(newShowJustExpiredMessage);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [orders, fetchOrders, expiredOrders, isCountingDown, showJustExpiredMessage]);

    useEffect(() => {
        fetchOrders();
        // const intervalId = setInterval(fetchOrders, refreshInterval);
        // return () => clearInterval(intervalId);
    }, [fetchOrders]);

    useEffect(() => {
        let results = [...orders];

        if (searchQuery) {
            results = results.filter(order =>
                order.package_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (activeFilter) {
            const [filterKey, filterValue] = Object.entries(activeFilter)[0];
            if (filterKey === 'package_name') {
                results = results.sort((a, b) => sortDirection === 'asc' ? a.package_name.localeCompare(b.package_name) : b.package_name.localeCompare(a.package_name));
            } else if (filterKey === 'duration_hours') {
                results = results.sort((a, b) => sortDirection === 'asc' ? a.duration_hours - b.duration_hours : b.duration_hours - a.duration_hours);
            } else if (filterKey === 'total_cost') {
                results = results.sort((a, b) => sortDirection === 'asc' ? a.total_cost - b.total_cost : b.total_cost - a.total_cost);
            } else if (filterKey === 'is_active') {
                results = results.filter(order => order.is_active === filterValue);
            } else if (filterKey === 'status') {
                results = results.filter(order => order.status === filterValue);
            } else if (filterKey === 'payment_status') {
                results = results.filter(order => order.payment_status === filterValue);
            } else if (filterKey === 'created_at') {
                results = results.sort((a, b) => sortDirection === 'asc' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at));
            }
        } else if (!searchQuery) {
            // Default sort by created_at desc jika tidak ada filter aktif dan tidak ada pencarian
            results = results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        setFilteredOrders(results);
        setCurrentPage(0);
    }, [orders, activeFilter, sortDirection, searchQuery]);

    useEffect(() => {
        setPageCount(Math.ceil(filteredOrders.length / itemsPerPage));
    }, [filteredOrders, itemsPerPage]);

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

    const toggleFilterDropdown = () => {
        setIsFilterDropdownOpen(!isFilterDropdownOpen);
        setOpenSubMenu(null); // Tutup submenu saat dropdown ditutup
    };

    const selectFilter = (filter) => {
        if (filter.hasSubOptions) {
            setOpenSubMenu(openSubMenu === filter.value ? null : filter.value);
        } else {
            setActiveFilter({ [filter.value]: null }); // Reset filter sebelumnya
            setSortDirection('desc'); // Default sort direction untuk filter baru
            setIsFilterDropdownOpen(false);
            setFilterLabel(filter.label); // Set label dropdown
            setOpenSubMenu(null);
        }
    };

    const applySubFilter = (filterKey, filterValue, filterLabelSub) => {
        setActiveFilter({ [filterKey]: filterValue });
        setIsFilterDropdownOpen(false);
        setFilterLabel(filterLabelSub); // Set label dropdown dengan nilai sub-filter
        setOpenSubMenu(null);
    };

    const handleSortDirectionChange = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const handleDeleteOrder = async (id) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Anda tidak akan dapat mengembalikan tindakan ini!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/orders/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    Swal.fire(
                        'Dihapus!',
                        'Pesanan berhasil dihapus.',
                        'success'
                    );
                    fetchOrders();
                } catch (err) {
                    Swal.fire(
                        'Gagal!',
                        'Terjadi kesalahan saat menghapus pesanan.',
                        'error'
                    );
                    console.error('Error deleting order:', err);
                }
            }
        });
    };

    const openTokenModal = (tokenValue, domainValue) => {
        setSelectedToken(tokenValue);
        setIsTokenModalOpen(true);
        setSelectedDomain(domainValue);
        setIsOpeningGift(true);
        setTimeout(() => {
            setIsOpeningGift(false);
        }, 1500);
    };

    const closeTokenModal = () => {
        setIsTokenModalOpen(false);
        setSelectedToken(null);
        setIsOpeningGift(false);
    };

    const openEditProofModal = (order) => {
        setSelectedOrderForProof(order);
        setPaymentProofFile(null);
        setIsEditProofModalOpen(true);
    };

    const closeEditProofModal = () => {
        setIsEditProofModalOpen(false);
        setSelectedOrderForProof(null);
        setPaymentProofFile(null);
    };

    const handlePaymentProofChange = (event) => {
        const file = event.target.files[0];
        setPaymentProofFile(file);
    };

    const handleUpdatePaymentProof = async () => {
        if (!paymentProofFile || !selectedOrderForProof) {
            Swal.fire('Peringatan!', 'Silakan pilih file bukti pembayaran.', 'warning');
            return;
        }

        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Anda ingin memperbarui bukti pembayaran untuk pesanan ini?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Unggah!',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('order_id', selectedOrderForProof.id);
                formData.append('paymentProof', paymentProofFile);

                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/orders/payment-proof`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Gagal mengunggah bukti pembayaran'}`);
                    }

                    Swal.fire(
                        'Berhasil!',
                        'Bukti pembayaran berhasil diunggah.',
                        'success'
                    ).then(() => {
                        closeEditProofModal();
                        fetchOrders();
                    });
                } catch (err) {
                    Swal.fire(
                        'Gagal!',
                        'Terjadi kesalahan saat mengunggah bukti pembayaran.',
                        'error'
                    );
                    console.error('Error updating payment proof:', err);
                }
            }
        });
    };

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    const visiblePages = 5;
    const pageRangeDisplayed = Math.min(visiblePages, pageCount);

    let startPage = Math.max(1, currentPage + 1 - Math.floor(visiblePages / 2));
    let endPage = Math.min(pageCount, currentPage + 1 + Math.floor((visiblePages - 1) / 2));

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i - 1)}
                    className={`px-2 py-1 rounded-md ${currentPage + 1 === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterDropdownRef && !filterDropdownRef.contains(event.target)) {
                setIsFilterDropdownOpen(false);
                setOpenSubMenu(null); // Tutup submenu saat dropdown ditutup
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [filterDropdownRef]);

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <h2 className="text-2xl font-semibold mb-4"><ShimmerTitle line={2} gap={10} /></h2>
                <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
                    <div className="flex items-center">
                        <label htmlFor="itemsPerPage" className="mr-2 text-gray-700"><ShimmerText line={1} width={80} /></label>
                        <select
                            id="itemsPerPage"
                            className="border rounded-md py-1 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled
                        >
                            <option>Loading...</option>
                        </select>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <ShimmerThumbnail height={38} rounded width="100%" />
                    </div>
                </div>
                <div className="mb-4 flex items-center space-x-2">
                    <div className="relative" ref={setFilterDropdownRef}>
                        <button
                            onClick={toggleFilterDropdown}
                            className="flex bg-gray-100 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            type="button"
                            aria-expanded="false"
                            aria-haspopup="true"
                        >
                            Filter: <span className="font-semibold"></span>
                            <svg className="ml-2 -mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {isFilterDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-button">
                                    {filterOptions.map(option => (
                                        <button
                                            key={option.value}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                                            role="menuitem"
                                        >
                                            <ShimmerText line={1} width={100} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <ShimmerButton size="sm" />
                </div>
                <ShimmerTable row={5} col={9} /> {/* Tambah 1 kolom untuk Bukti Pembayaran */}
                <div className="mt-4 flex items-center justify-between">
                    <ShimmerText line={1} width={120} />
                    <div className="flex items-center space-x-2">
                        <ShimmerButton size="xs" />
                        <ShimmerButton size="xs" />
                    </div>
                </div>
            </div>
        );
    }


    const handleDomainOrTokenInteraction = async (orderId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/start-usage`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Atau token pengguna jika ini di sisi pengguna
                },
                body: JSON.stringify({ orderId: orderId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            // console.log('Penggunaan dimulai:', responseData.message);
            // Mungkin perlu memicu re-fetch data pesanan di frontend
            fetchOrders(responseData.order); // Jika backend mengembalikan data pesanan yang diperbarui
        } catch (error) {
            console.error("Gagal mencatat awal penggunaan:", error);
            Swal.fire('Error!', 'Gagal mencatat awal penggunaan.', 'error');
        }
    };
    const handleStartUsageConfirmation = (order) => {
        Swal.fire({
            title: 'Konfirmasi Mulai Penggunaan',
            text: 'Anda yakin ingin memulai penggunaan layanan ini? Setelah dimulai, waktu akan terus berjalan dan tidak dapat diulang.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Mulai!',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDomainOrTokenInteraction(order.id);
            }
        });
    };





    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Terjadi kesalahan: {error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Daftar Pesanan Anda</h2><div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
                <div className="flex items-center">
                    <label htmlFor="itemsPerPage" className="mr-2 text-gray-700">Tampilkan:</label>
                    <select
                        id="itemsPerPage"
                        className="border rounded-md py-1 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                    >
                        {[5, 10, 25, 50, 100, 1000].map(value => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </select>
                </div>
                <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        className="border rounded-md py-2 px-3 pl-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        placeholder="Cari nama paket"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-6a7 7 0 10-14 0 7 7 0 0014 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="mb-4 flex items-center space-x-2">
                <div className="relative" ref={setFilterDropdownRef}>
                    <button
                        onClick={toggleFilterDropdown}
                        className="flex bg-gray-100 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        type="button"
                        aria-expanded="false"
                        aria-haspopup="true"
                    >
                        <span className="font-semibold">{filterLabel}</span>
                        <svg className="ml-2 -mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {isFilterDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-button">
                                {filterOptions.map(option => (
                                    <div key={option.value}>
                                        <button
                                            onClick={() => selectFilter(option)}
                                            className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900 ${activeFilter && Object.keys(activeFilter)[0] === option.value ? 'bg-gray-100 font-semibold' : ''}`}
                                            role="menuitem"
                                        >
                                            {option.label}
                                            {option.hasSubOptions && (
                                                <svg className="ml-2 -mr-1 h-5 w-5 inline-block text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M7.293 9.293a1 1 0 011.414 0L10 10.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                        {openSubMenu === 'is_active' && option.value === 'is_active' && (
                                            <div className="ml-2">
                                                <button
                                                    onClick={() => applySubFilter('is_active', 1, 'Status Token: Aktif')}
                                                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900 ${activeFilter && activeFilter.is_active === true ? 'bg-gray-100 font-semibold' : ''}`}
                                                    role="menuitem"
                                                >
                                                    Aktif
                                                </button>
                                                <button
                                                    onClick={() => applySubFilter('is_active', 0, 'Status Token: Tidak Aktif')}
                                                    className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900 ${activeFilter && activeFilter.is_active === false ? 'bg-gray-100 font-semibold' : ''}`}
                                                    role="menuitem"
                                                >
                                                    Tidak Aktif
                                                </button>
                                            </div>
                                        )}
                                        {openSubMenu === 'status' && option.value === 'status' && (
                                            <div className="ml-2">
                                                {Object.keys(statusAlias).map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => applySubFilter('status', status, `Status Pesanan: ${statusAlias[status]}`)}
                                                        className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900 ${activeFilter && activeFilter.status === status ? 'bg-gray-100 font-semibold' : ''}`}
                                                        role="menuitem"
                                                    >
                                                        {statusAlias[status]}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {openSubMenu === 'payment_status' && option.value === 'payment_status' && (
                                            <div className="ml-2">
                                                {Object.keys(paymentStatusAlias).map(pStatus => (
                                                    <button
                                                        key={pStatus}
                                                        onClick={() => applySubFilter('payment_status', pStatus, `Status Pembayaran: ${paymentStatusAlias[pStatus]}`)}
                                                        className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900 ${activeFilter && activeFilter.payment_status === pStatus ? 'bg-gray-100 font-semibold' : ''}`}
                                                        role="menuitem"
                                                    >
                                                        {paymentStatusAlias[pStatus]}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {activeFilter && (activeFilter.package_name !== undefined || activeFilter.duration_hours !== undefined || activeFilter.total_cost !== undefined || activeFilter.created_at !== undefined) && (
                    <button onClick={handleSortDirectionChange} className="focus:outline-none text-gray-700 hover:text-gray-900 text-sm flex items-center ml-2">
                        Urutkan {filterLabel}: {sortDirection === 'asc' ? <AiOutlineSortAscending className="h-4 w-4 ml-1" /> : <AiOutlineSortDescending className="h-4 w-4 ml-1" />}
                    </button>
                )}
            </div>

            <div className="overflow-x-auto shadow-md rounded-md">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                            <th className="px-5 py-3 text-left cursor-pointer" onClick={() => selectFilter({ value: 'package_name', label: 'Nama Paket' })}>
                                Nama Paket {activeFilter && activeFilter.package_name !== undefined && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                            <th className="px-5 py-3 text-left cursor-pointer" onClick={() => selectFilter({ value: 'duration_hours', label: 'Durasi' })}>
                                Durasi {activeFilter && activeFilter.duration_hours !== undefined && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                            <th className="px-5 py-3 text-left cursor-pointer" onClick={() => selectFilter({ value: 'total_cost', label: 'Harga' })}>
                                Total Biaya {activeFilter && activeFilter.total_cost !== undefined && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                            <th className="px-5 py-3 text-left">Status</th>
                            <th className="px-5 py-3 text-left">Token & Domain</th>
                            <th className="px-5 py-3 text-left">Status Token</th>
                            <th className="px-5 py-3 text-left">Status Pembayaran</th>
                            <th className="px-5 py-3 text-left cursor-pointer" onClick={() => selectFilter({ value: 'created_at', label: 'Tanggal Pesan' })}>
                                Tanggal Pesan {activeFilter && activeFilter.created_at !== undefined && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                            <th className="px-5 py-3 text-left">Bukti Pembayaran</th>
                            <th className="px-5 py-3 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {currentOrders.length > 0 ? (
                            currentOrders.map(order => (
                                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-5 py-3 text-left">{order.package_name}</td>
                                    <td className="px-5 py-3 text-left">{order.duration_hours} jam</td>
                                    <td className="px-5 py-3 text-left">Rp {order.total_cost.toLocaleString('id-ID')}</td>
                                    <td className="px-5 py-3 text-left">
                                        <span className={`relative inline-block px-3 py-1 font-semibold text-sm rounded-full ${order.status === 'pending_payment' ? 'bg-yellow-200 text-yellow-700' :
                                            order.status === 'pending_approval' ? 'bg-blue-200 text-blue-700' :
                                                order.status === 'approved' ? 'bg-green-200 text-green-700' :
                                                    order.status === 'rejected' ? 'bg-red-200 text-red-700' :
                                                        order.status === 'active' ? 'bg-purple-200 text-purple-700' :
                                                            order.status === 'completed' ? 'bg-gray-300 text-gray-700' :
                                                                'bg-gray-200 text-gray-700'
                                            }`}>
                                            {statusAlias[order.status]}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-left">
                                        {order.token ? (
                                            <button onClick={() => openTokenModal(order.token, order.domain)} className="text-blue-500 hover:text-blue-700 focus:outline-none flex items-center">
                                                <GiftIcon className="h-5 w-5 inline-block mr-1" /> Lihat Token
                                            </button>
                                        ) : (
                                            <span className="text-gray-500 italic">Tidak Ada</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-left">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${order.is_active ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                                            {order.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-left">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${order.payment_status === 'pending' ? 'bg-yellow-200 text-yellow-700' :
                                            order.payment_status === 'paid' ? 'bg-green-200 text-green-700' :
                                                order.payment_status === 'rejected' ? 'bg-red-200 text-red-700' :
                                                    order.payment_status === 'verified' ? 'bg-blue-200 text-blue-700' :
                                                        'bg-gray-200 text-gray-700'
                                            }`}>
                                            {paymentStatusAlias[order.payment_status] || order.payment_status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-left">
                                        <div>
                                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleTimeString('id-ID', {
                                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-left">
                                        {order.proof_url ? (
                                            <div className="items-center space-y-2">
                                                <button
                                                    onClick={() => window.open(`http://localhost:4000/${order.proof_url}`, '_blank')}
                                                    className="text-green-500 hover:text-green-700 focus:outline-none flex items-center"
                                                >
                                                    <PhotoIcon className="h-5 w-5 inline-block mr-1" /> Lihat
                                                </button>
                                                <InvoiceButton order={order} userName={currentUser} />
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 italic">Belum diupload</span>
                                        )}
                                    </td>
                                    <td className="px-2 py-3 text-left">
                                        <div className="flex flex-col items-start">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <button
                                                    onClick={() => openEditProofModal(order)}
                                                    className="text-blue-500 hover:text-blue-700 focus:outline-none flex items-center"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5 inline-block mr-1" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="text-red-500 hover:text-red-700 focus:outline-none flex items-center"
                                                >
                                                    <TrashIcon className="h-5 w-5 inline-block" /> Hapus
                                                </button>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                {!order.start_date && order.token && (
                                                    <button
                                                        onClick={() => handleStartUsageConfirmation(order)}
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline flex items-center"
                                                    >
                                                        <PlayIcon className="h-4 w-4 mr-1" /> Mulai
                                                    </button>
                                                )}

                                                {order.token && order.start_date && remainingTimes[order.id] && (
                                                    <div className="flex flex-col space-y-2"> 
                                                        <span className="flex items-center whitespace-nowrap">
                                                            <ClockIcon className="h-4 w-4 mr-1 text-green-500" />
                                                            Mulai:{" "}
                                                            {new Date(order.start_date).toLocaleTimeString("id-ID", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </span>
                                                        {!remainingTimes[order.id]?.isExpired ? (
                                                            <span className="flex items-center font-light whitespace-nowrap">
                                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                                Sisa:{" "}
                                                                {remainingTimes[order.id]?.isWithinCountdown ? (
                                                                    <span className={`text-red-500 animate-ping-custom text-sm font-semibold`}>
                                                                        {remainingTimes[order.id]?.seconds}s
                                                                    </span>
                                                                ) : (
                                                                    <>
                                                                        {remainingTimes[order.id]?.hours > 0 && (
                                                                            <span className={remainingTimes[order.id]?.isAboutToExpire ? "text-red-500" : "text-green-500"}>
                                                                                {remainingTimes[order.id]?.hours}j{" "}
                                                                            </span>
                                                                        )}
                                                                        {remainingTimes[order.id]?.minutes > 0 && (
                                                                            <span className={remainingTimes[order.id]?.isAboutToExpire ? "text-red-500" : "text-green-500"}>
                                                                                {remainingTimes[order.id]?.minutes}m{" "}
                                                                            </span>
                                                                        )}
                                                                        <span className={remainingTimes[order.id]?.isAboutToExpire ? "text-red-500" : "text-green-500"}>
                                                                            {remainingTimes[order.id]?.seconds}s
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center font-medium whitespace-nowrap text-red-500">
                                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                                {showJustExpiredMessage[order.id] ? (
                                                                    "Waktu Habis"
                                                                ) : (
                                                                    <>
                                                                        Berakhir pada:{" "}
                                                                        {order.end_date &&
                                                                            new Date(order.end_date).toLocaleTimeString("id-ID", {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            })}
                                                                    </>
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr><td className="px-5 py-3 text-center" colSpan="10">Tidak ada pesanan ditemukan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {filteredOrders.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-gray-700 text-sm">
                        Halaman {currentPage + 1} dari {pageCount}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={currentPage === 0}
                        >
                            Prev
                        </button>
                        {renderPageNumbers()}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))}
                            className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={currentPage === pageCount - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Token Modal */}
            {isTokenModalOpen && selectedToken && (
                <div className="fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div ref={giftModalRef} className={`bg-white rounded-lg shadow-xl transform transition-all duration-500 ease-in-out ${isOpeningGift ? 'animate-gift-open' : 'scale-100'}`}>
                        <div className="relative p-6 flex flex-col items-center">
                            <div className="relative w-24 h-24 mb-4">
                                <GiftIcon className={`absolute top-0 left-0 w-full h-full text-green-500 transition-all duration-500 ${isOpeningGift ? 'transform rotate-12 scale-125' : 'transform scale-100'}`} aria-hidden="true" />
                                {isOpeningGift && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping w-24 h-24 rounded-full bg-green-500 opacity-75"></div>
                                )}
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Selamat! Token Akses Anda:
                            </h3>
                            {isOpeningGift ? (
                                <div className="animate-pulse text-center text-xl font-semibold text-blue-500">
                                    Membuka hadiah...
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <p className="text-sm text-gray-500 mb-2 text-center">
                                        Token Anda adalah: <span className="font-semibold text-blue-600">{selectedToken}</span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(selectedToken);
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: 'Berhasil!',
                                                    text: 'Token berhasil disalin ke clipboard.',
                                                    timer: 1500,
                                                    showConfirmButton: false,
                                                });
                                            }}
                                            className="ml-2 text-green-500 hover:text-green-700 focus:outline-none text-xs"
                                        >
                                            (Salin)
                                        </button>
                                    </p>
                                    {selectedDomain && (
                                        <p className="text-sm text-gray-500 mb-4 text-center">
                                            Domain Anda adalah: <span className="font-semibold text-indigo-600">{selectedDomain}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(selectedDomain);
                                                    Swal.fire({
                                                        icon: 'success',
                                                        title: 'Berhasil!',
                                                        text: 'Domain berhasil disalin ke clipboard.',
                                                        timer: 1500,
                                                        showConfirmButton: false,
                                                    });
                                                }}
                                                className="ml-2 text-green-500 hover:text-green-700 focus:outline-none text-xs"
                                            >
                                                (Salin)
                                            </button>
                                        </p>
                                    )}
                                </div>
                            )}
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                    onClick={closeTokenModal}
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Edit Bukti Pembayaran Modal */}
            {isEditProofModalOpen && selectedOrderForProof && (
                <div className="fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Unggah Bukti Pembayaran
                        </h2>
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Klik untuk mengunggah</span> atau tarik dan lepas</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">(PNG, JPG)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" onChange={handlePaymentProofChange} required />
                        </label>

                        {paymentProofFile && (
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-700">Preview Bukti Pembayaran:</h3>
                                <img
                                    src={URL.createObjectURL(paymentProofFile)}
                                    alt="Preview Bukti Pembayaran"
                                    className="mt-2 rounded-md w-full h-auto max-h-48 object-cover"
                                />
                            </div>
                        )}

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm mr-2"
                                onClick={closeEditProofModal}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm disabled:bg-indigo-300 disabled:cursor-not-allowed"
                                onClick={handleUpdatePaymentProof}
                                disabled={!paymentProofFile}
                            >
                                Unggah
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListOrders;