import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Import ikon pencarian

const SearchBar = ({ onSearch }) => {
    return (
        <div className="relative mb-4"> {/* Gunakan relative untuk memposisikan ikon */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
                type="text"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                placeholder="Cari paket..."
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;