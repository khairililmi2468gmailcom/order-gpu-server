import React, { useCallback, useState } from 'react';
import OrderItem from './OrderItem';
import { MagnifyingGlassIcon, ArrowsUpDownIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const OrderList = ({ orders, onVerifyPayment }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('pending');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

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

    return (
        <div>
            <div className="mb-4 flex items-center space-x-4">
                <div className="relative flex-grow">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Cari data..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">Urutkan:</label>
                    <select
                        id="sortBy"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="pending">Status: Pending</option>
                        <option value="approved">Status: Disetujui</option>
                        <option value="rejected">Status: Ditolak</option>
                        <option value="total_cost">Total Biaya</option>
                        <option value="user_name">Nama Pengguna</option>
                    </select>
                    {sortBy === 'total_cost' || sortBy === 'user_name' ? (
                        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                            <ArrowsUpDownIcon className={`h-5 w-5 text-gray-500 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                        </button>
                    ) : null}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-md">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bukti Pembayaran
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status Pesanan
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status Pembayaran
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Pengguna
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Biaya
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentOrders.map(order => (
                            <OrderItem key={order.payment_id} order={order} onVerifyPayment={onVerifyPayment} />
                        ))}
                        {sortedAndFilteredOrders.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
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