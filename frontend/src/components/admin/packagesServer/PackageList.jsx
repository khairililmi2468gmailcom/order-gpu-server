import React from 'react';
import PackageListItem from './PackageListItem';

const PackageList = ({ packages, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
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