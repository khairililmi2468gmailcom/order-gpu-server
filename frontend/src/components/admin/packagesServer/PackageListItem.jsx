import React from 'react';

const PackageListItem = ({ packageData, onEdit, onDelete }) => {
    return (
        <tr key={packageData.id}>
            <td className="border px-4 py-2">{packageData.name}</td>
            <td className="border px-4 py-2">Rp {parseFloat(packageData.price_per_hour).toLocaleString('id-ID')} / jam</td>
            <td className="border px-4 py-2">{packageData.vcpu}</td>
            <td className="border px-4 py-2">{packageData.ram}</td>
            <td className="border px-4 py-2">{packageData.min_period_days} hari</td>
            <td className="border px-4 py-2">
                <button onClick={() => onEdit(packageData)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Edit
                </button>
                <button onClick={() => onDelete(packageData.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Hapus
                </button>
            </td>
        </tr>
    );
};

export default PackageListItem;