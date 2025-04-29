import React, { useState, useEffect, useCallback } from 'react';
import { FaceSmileIcon } from '@heroicons/react/24/outline';
import { Fieldset } from '@headlessui/react';

const OrderItem = ({ order }) => {
    return (
        <tr className="hover:bg-gray-50 text-sm">
            <td className="px-4 py-3 uppercase">{order.user_name}</td>
            <td className="px-4 py-3">{order.package_name}</td>
            <td className="px-4 py-3 whitespace-nowrap">Rp {parseFloat(order.total_cost).toLocaleString('id-ID')}</td>
            <td className="px-4 py-3">{order.duration_days} Hari</td>
            <td className="px-4 py-3">
                {order.hasUpload ? (
                    <span className="flex items-center text-green-500">
                        <Fieldset className="mr-1 h-4 w-4" /> Sudah Upload
                    </span>
                ) : (
                    <span className="flex items-center text-red-500">
                        <FaceSmileIcon className="mr-1 h-4 w-4" /> Belum Upload
                    </span>
                )}
            </td>
        </tr>
    );
};

export default OrderItem;