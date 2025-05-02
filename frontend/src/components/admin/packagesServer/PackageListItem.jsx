import React from 'react';

const PackageListItem = ({ packageData, onEdit, onDelete }) => {
    return (
        <tr key={packageData.id} className="hover:bg-gray-50">
            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{packageData.name}</td>
            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">Rp {parseFloat(packageData.price_per_hour).toLocaleString('id-ID')} / jam</td>
            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{packageData.vcpu}</td>
            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{packageData.ram}</td>
            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{packageData.min_period_hours} Jam</td>
            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                <button
                    onClick={() => onEdit(packageData)}
                    className="inline-flex items-center justify-center px-3 py-2 mr-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 rounded-md focus:outline-none focus-ring-2 focus-ring-blue-500 focus-ring-offset-1 transition-colors"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(packageData.id)}
                    className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-700 rounded-md focus:outline-none focus-ring-2 focus-ring-red-500 focus-ring-offset-1 transition-colors"
                >
                    Hapus
                </button>
            </td>
        </tr>
    );
};

export default PackageListItem;

