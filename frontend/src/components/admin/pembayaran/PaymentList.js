import React, { useCallback, useState } from 'react';
import { MagnifyingGlassIcon, ArrowsUpDownIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Listbox, ListboxOption } from '@headlessui/react';
import PaymentItem from './PaymentItem';

const itemsPerPageOptions = [5, 10, 25, 50, 100]; // Opsi jumlah data per halaman

const PaymentList = ({ orders, onVerifyPayment,handleUpdateOrder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('pending');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]); // Set default items per page

    const sortOptions = [
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
            if (sortBy === 'pending') {
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

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value);
        setCurrentPage(1); // Reset ke halaman pertama saat jumlah item per halaman berubah
    };

    return (
        <div className="p-4 md:p-6 lg:p-8"> {/* Tambahkan padding keseluruhan */}
            <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4"> {/* Tata letak responsif */}
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
                    <Listbox value={sortBy} onChange={setSortBy}>
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
                    {(sortBy === 'total_cost' || sortBy === 'user_name') && (
                        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="ml-2 focus:outline-none">
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
                            <th scope="col" className="px-3 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                        {currentOrders.map(order => (
                            <PaymentItem key={order.payment_id} order={order} onVerifyPayment={onVerifyPayment} onUpdateOrder={handleUpdateOrder}/>
                        ))}
                        {sortedAndFilteredOrders.length === 0 && (
                            <tr>
                                <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                                    Tidak ada data pesanan yang sesuai.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {sortedAndFilteredOrders.length > 0 && (
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-700">
                        Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, sortedAndFilteredOrders.length)} dari {sortedAndFilteredOrders.length} data
                    </div>
                    <div className="flex items-center gap-4">
                        <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700">Data per halaman:</label>
                        <select
                            id="itemsPerPage"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md py-2 px-3"
                            value={itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                        >
                            {itemsPerPageOptions.map(value => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={handlePrevPage}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none"
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
                                            className={`z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${currentPage === page ? '' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
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
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none"
                                disabled={currentPage === totalPages}
                            >
                                <span className="sr-only">Next</span>
                                <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentList;