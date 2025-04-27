import React from 'react';

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
        <div className="flex justify-center mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-l shadow-sm disabled:opacity-50"
            >
                Prev
            </button>
            {showStartEllipsis && (
                <span className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 shadow-sm">...</span>
            )}
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 shadow-sm ${
                        currentPage === number ? 'bg-blue-500 text-white' : ''
                    }`}
                >
                    {number}
                </button>
            ))}
            {showEndEllipsis && (
                <span className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 shadow-sm">...</span>
            )}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-r shadow-sm disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;