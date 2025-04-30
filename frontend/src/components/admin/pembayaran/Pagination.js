import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, onItemsPerPageChange }) => {
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
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} data
            </div>
            <div className="flex items-center gap-4">
                <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700">Data per halaman:</label>
                <select
                    id="itemsPerPage"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md py-2 px-3"
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
                >
                    {[5, 10, 25, 50, 100].map(value => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
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
                                    onClick={() => onPageChange(page)}
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
                        onClick={() => onPageChange(currentPage + 1)}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none"
                        disabled={currentPage === totalPages}
                    >
                        <span className="sr-only">Next</span>
                        <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default Pagination;