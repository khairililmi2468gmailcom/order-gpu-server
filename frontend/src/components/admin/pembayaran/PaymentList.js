import React, { useCallback, useState } from 'react';
import { MagnifyingGlassIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { Listbox } from '@headlessui/react';
import PaymentItem from './PaymentItem';
import Pagination from './Pagination'; // Asumsi Anda memiliki komponen Pagination terpisah

const itemsPerPageOptions = [5, 10, 25, 50, 100];

const PaymentList = ({ orders, onVerifyPayment, handleUpdateOrder  }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('default'); // Default state untuk pengurutan kombinasi
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

    const sortOptions = [
        { value: 'default', label: 'Default (Update Terbaru)' },
        { value: 'order_created_at', label: 'Tanggal Order' },
        { value: 'order_updated_at', label: 'Tanggal Update' },
        { value: 'pending', label: 'Status: Pending' },
        { value: 'approved', label: 'Status: Disetujui' },
        { value: 'rejected', label: 'Status: Ditolak' },
        { value: 'total_cost', label: 'Total Biaya' },
        { value: 'user_name', label: 'Nama Pengguna' },
    ];

    const filteredOrders = orders.filter(order =>
        Object.values(order).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortOrders = useCallback((ordersToSort) => {
        return [...ordersToSort].sort((a, b) => {
            if (sortBy === 'default') {
                // Prioritaskan order yang memiliki order_updated_at terbaru
                if (a.order_updated_at && b.order_updated_at) {
                    return new Date(b.order_updated_at) - new Date(a.order_updated_at);
                } else if (a.order_updated_at) {
                    return -1; // a yang diupdate lebih dulu
                } else if (b.order_updated_at) {
                    return 1; // b yang diupdate lebih dulu
                }
                // Jika tidak ada order_updated_at, urutkan berdasarkan order_created_at terbaru
                return new Date(b.order_created_at) - new Date(a.order_created_at);
            } else if (sortBy === 'order_created_at') {
                return sortOrder === 'asc' ? new Date(a.order_created_at) - new Date(b.order_created_at) : new Date(b.order_created_at) - new Date(a.order_created_at);
            } else if (sortBy === 'order_updated_at' && a.order_updated_at && b.order_updated_at) {
                return sortOrder === 'asc' ? new Date(a.order_updated_at) - new Date(b.order_updated_at) : new Date(b.order_updated_at) - new Date(a.order_updated_at);
            } else if (sortBy === 'pending') {
                const statusOrder = { pending: 0, verified: 1, rejected: 2 };
                return statusOrder[a.payment_status] - statusOrder[b.payment_status];
            } else if (sortBy === 'approved') {
                const statusOrder = { verified: 0, pending: 1, rejected: 2 };
                return statusOrder[a.payment_status] - statusOrder[b.payment_status];
            } else if (sortBy === 'rejected') {
                const statusOrder = { rejected: 0, pending: 1, verified: 2 };
                return statusOrder[a.payment_status] - statusOrder[b.payment_status];
            } else if (sortBy === 'total_cost') {
                const priceA = parseFloat(a.total_cost);
                const priceB = parseFloat(b.total_cost);
                return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
            } else if (sortBy === 'user_name') {
                const nameA = a.user_name.toLowerCase();
                const nameB = b.user_name.toLowerCase();
                return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            }
            return 0;
        });
    }, [sortBy, sortOrder]);

    const sortedAndFilteredOrders = sortOrders(filteredOrders);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = sortedAndFilteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedAndFilteredOrders.length / itemsPerPage);

    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(1); // Reset page on sort
        if (value === 'pending' || value === 'approved' || value === 'rejected') {
            setSortOrder('asc'); // Default asc for status
        } else {
            setSortOrder('desc'); // Default desc for other sorts
        }
    };

    const handleSortOrderChange = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-1/2 md:max-w-xs">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                        placeholder="Cari pesanan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="sortBy" className="text-sm font-medium text-gray-700 sr-only">Urutkan berdasarkan</label>
                    <Listbox value={sortBy} onChange={handleSortChange}>
                        <div className="relative">
                            <Listbox.Button className="bg-white relative border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 flex items-center justify-between">
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
                    {(sortBy === 'order_created_at' || sortBy === 'order_updated_at' || sortBy === 'total_cost' || sortBy === 'user_name') && (
                        <button onClick={handleSortOrderChange} className="ml-2 focus:outline-none">
                            <ArrowsUpDownIcon className={`h-5 w-5 text-gray-500 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto shadow-sm rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th scope="col" className="px-3 py-2">Bukti</th>
                            <th scope="col" className="px-3 py-2">Pengguna</th>
                            <th scope="col" className="px-3 py-2">Paket</th>
                            <th scope="col" className="px-3 py-2">Durasi</th>
                            <th scope="col" className="px-3 py-2">Status Pesanan</th>
                            <th scope="col" className="px-3 py-2">Status Bayar</th>
                            <th scope="col" className="px-3 py-2">Total</th>
                            <th scope="col" className="px-3 py-2">Tgl Order</th>
                            <th scope="col" className="px-3 py-2">Tgl Update</th>
                            <th scope="col" className="px-3 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                        {currentOrders.map(order => (
                            <PaymentItem key={order.payment_id} order={order} onVerifyPayment={onVerifyPayment} onUpdateOrder={handleUpdateOrder} />
                        ))}
                        {sortedAndFilteredOrders.length === 0 && (
                            <tr>
                                <td colSpan="9" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                    Tidak ada data pesanan yang sesuai.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {sortedAndFilteredOrders.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={sortedAndFilteredOrders.length}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}
        </div>
    );
};

export default PaymentList;