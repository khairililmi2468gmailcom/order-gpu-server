import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    MagnifyingGlassIcon,
    ArrowsUpDownIcon,
    ArrowLeftIcon,
    ArrowRightIcon,

} from '@heroicons/react/24/outline';

import { Listbox, ListboxOption } from '@headlessui/react';
import OrderItem from './OrderItem';
const OrderList = ({ orders, onRefresh }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('created_at'); // Mengubah default sortBy menjadi 'created_at'
    const [sortOrder, setSortOrder] = useState('desc');  // Mengubah default sortOrder menjadi 'desc'
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const availablePageSizes = [5, 10, 25, 50, 100, 500, 1000];

    const sortOptions = [
        { value: 'user_name', label: 'Nama Pengguna' },
        { value: 'package_name', label: 'Nama Paket' },
        { value: 'total_cost', label: 'Total Biaya' },
        { value: 'duration_days', label: 'Durasi' },
        { value: 'created_at', label: 'Tanggal Pemesanan' }, // Menambahkan 'created_at' ke sortOptions
    ];

    const filteredOrders = orders.filter(order =>
        Object.values(order).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortOrders = useCallback((ordersToSort) => {
        return [...ordersToSort].sort((a, b) => {
            if (sortBy === 'user_name') {
                const nameA = a.user_name.toLowerCase();
                const nameB = b.user_name.toLowerCase();
                return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            } else if (sortBy === 'package_name') {
                const packageA = a.package_name.toLowerCase();
                const packageB = b.package_name.toLowerCase();
                return sortOrder === 'asc' ? packageA.localeCompare(packageB) : packageB.localeCompare(packageA);
            } else if (sortBy === 'total_cost') {
                const priceA = parseFloat(a.total_cost);
                const priceB = parseFloat(b.total_cost);
                return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
            } else if (sortBy === 'duration_days') {
                return sortOrder === 'asc' ? a.duration_days - b.duration_days : b.duration_days - a.duration_days;
            } else if (sortBy === 'created_at') { // Menambahkan logika pengurutan untuk 'created_at'
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }
            return 0;
        });
    }, [sortBy, sortOrder]);

    const sortedAndFilteredOrders = sortOrders(filteredOrders);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = sortedAndFilteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedAndFilteredOrders.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pageNumbers.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pageNumbers;
    };

    const handlePageSizeChange = (value) => {
        setItemsPerPage(parseInt(value, 10));
        setCurrentPage(1);
    };

    return (
        <div>
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-1/2 md:max-w-xs">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                        placeholder="Cari..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="sortBy" className="text-sm font-medium text-gray-700 sr-only">Urutkan berdasarkan</label>
                        <Listbox value={sortBy} onChange={setSortBy}>
                            <div className="relative">
                                <Listbox.Button className="bg-white relative border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 flex items-center justify-between min-w-[200px]">
                                    {sortOptions.find(option => option.value === sortBy)?.label || 'Urutkan'}
                                    <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </Listbox.Button>
                                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {sortOptions.map((option) => (
                                        <Listbox.Option
                                            key={option.value}
                                            className={({ active, selected }) =>
                                                `cursor-default select-none relative py-2 pl-4 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                                                } ${selected ? 'bg-indigo-200 font-semibold' : ''}`
                                            }
                                            value={option.value}
                                        >
                                            {({ selected }) => (
                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                    {option.label}
                                                </span>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                        {(sortBy === 'total_cost' || sortBy === 'user_name' || sortBy === 'duration_days' || sortBy === 'created_at') && ( // Memasukkan created_at ke dalam kondisi
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="ml-2 inline-flex items-center justify-center p-2 rounded-md border border-gray-300 shadow-sm bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors"
                                title={sortOrder === 'asc' ? 'Urutkan Menurun' : 'Urutkan Menaik'}
                            >
                                <ArrowsUpDownIcon className={`h-5 w-5 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="pageSize" className="text-sm font-medium text-gray-700 sr-only">
                            Tampilkan per halaman:
                        </label>
                        <Listbox value={itemsPerPage} onChange={handlePageSizeChange}>
                            <div className="relative">
                                <Listbox.Button className="bg-white relative border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 flex items-center justify-between min-w-[180px]">
                                    {itemsPerPage}
                                    <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </Listbox.Button>
                                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {availablePageSizes.map(size => (
                                        <Listbox.Option
                                            key={size}
                                            className={({ active, selected }) =>
                                                `cursor-default select-none relative py-2 pl-4 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                                                } ${selected ? 'bg-indigo-200 font-semibold' : ''}`
                                            }
                                            value={size}
                                        >
                                            {({ selected }) => (
                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                    {size}
                                                </span>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-md">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Pengguna
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Paket
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Biaya
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Durasi
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bukti Upload
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentOrders.map(order => (
                            <OrderItem key={order.id} order={order} />
                        ))}
                        {sortedAndFilteredOrders.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                    Tidak ada data pesanan yang sesuai.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {sortedAndFilteredOrders.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, sortedAndFilteredOrders.length)} dari {sortedAndFilteredOrders.length} data
                    </div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={handlePrevPage}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            disabled={currentPage === 1}
                        >
                            <span className="sr-only">Previous</span>
                            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {getPageNumbers().map((page, index) => (
                            <React.Fragment key={index}>
                                {typeof page === 'number' ? (
                                    <button
                                        onClick={() => setCurrentPage(page)}
                                        aria-current="page"
                                        className={`z-10 ${currentPage === page
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                                            : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-300'
                                            } relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                    >
                                        {page}
                                    </button>
                                ) : (
                                    <span className="relative inline-flex items-center px-4 py-2 border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        {page}
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                        <button
                            onClick={handleNextPage}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            disabled={currentPage === totalPages}
                        >
                            <span className="sr-only">Next</span>
                            <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default OrderList;
