import React from 'react';
import PackageListItem from './PackageListItem';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';

const PackageList = ({ packages, onEdit, onDelete, onRefresh, loading }) => {
    return (
        <div className="overflow-x-auto">
            <div className="flex justify-end mb-4">
                <button
                    onClick={onRefresh}
                    className={`
            inline-flex items-center justify-center px-4 py-2 text-sm font-medium
            text-gray-700 bg-gray-100 hover:bg-gray-200
            rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1
            transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}
            // Custom styling to look more professional
            border border-gray-300 shadow-sm
            hover:bg-gray-50
            focus:ring-indigo-500 focus:border-indigo-500
          `}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <RocketLaunchIcon className="mr-2 h-4 w-4 animate-spin" />
                            Memuat...
                        </>
                    ) : (
                        <>
                            <RocketLaunchIcon className="mr-2 h-4 w-4" />
                            Refresh
                        </>
                    )}
                </button>
            </div>
            <table className="min-w-full leading-normal bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Nama Paket
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Harga / Jam
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            vCPU
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            RAM
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Min. Periode
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {packages.map(pkg => (
                        <PackageListItem key={pkg.id} packageData={pkg} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                    {packages.length === 0 && (
                        <tr>
                            <td colSpan="7" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                Tidak ada data paket server.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PackageList;
