import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid'; // Menggunakan ikon dari Heroicons

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const showStartEllipsis = currentPage > Math.ceil(maxPagesToShow / 2) + 1;
    const showEndEllipsis = totalPages > currentPage + Math.floor(maxPagesToShow / 2) && totalPages > maxPagesToShow;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, currentPage + Math.floor(maxPagesToShow / 2));

    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else if (showStartEllipsis && !showEndEllipsis) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
        endPage = totalPages;
    } else if (!showStartEllipsis && showEndEllipsis) {
        startPage = 1;
        endPage = Math.min(totalPages, maxPagesToShow);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="flex items-center justify-center mt-4" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-white text-gray-500 hover:bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
                <span className="sr-only">Previous</span>
                <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="hidden md:flex -space-x-px"> {/* Sembunyikan elipsis dan angka di layar kecil */}
                {showStartEllipsis && (
                    <span className="bg-white text-gray-700 py-2 px-3">...</span>
                )}
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        aria-current={currentPage === number ? "page" : undefined}
                        className={`bg-white text-gray-700 hover:bg-gray-100 py-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                            currentPage === number ? 'z-10 bg-indigo-50 text-white border-indigo-500' : ''
                        }`}
                    >
                        {number}
                    </button>
                ))}
                {showEndEllipsis && (
                    <span className="bg-white text-gray-700 py-2 px-3">...</span>
                )}
            </div>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-white text-gray-500 hover:bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
                <span className="sr-only">Next</span>
                <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
        </nav>
    );
};

export default Pagination;