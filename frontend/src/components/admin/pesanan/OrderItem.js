import React, { useState } from 'react';
import Swal from 'sweetalert2';


const OrderItem = ({ order, onVerifyPayment }) => {
    const isPaymentVerified = order.payment_status === 'verified';
    const isPaymentRejected = order.payment_status === 'rejected';

    const handleVerify = (status) => {
        Swal.fire({
            title: `Konfirmasi ${status === 'verified' ? 'Verifikasi' : 'Tolak'}`,
            text: `Anda yakin ingin ${status === 'verified' ? 'memverifikasi' : 'menolak'} pembayaran ini?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak',
        }).then((result) => {
            if (result.isConfirmed) {
                onVerifyPayment(order.payment_id, status);
            }
        });
    };

    return (
        <tr className={`hover:bg-gray-50 ${isPaymentRejected ? 'bg-red-200 hover:bg-red-100' : ''}`}>
            
            <td className="px-4 py-3 uppercase">{order.user_name}</td>
            <td className="px-4 py-3 whitespace-nowrap uppercase">{order.order_status}</td>
            <td className="px-4 py-3 whitespace-nowrap uppercase">{order.payment_status === 'pending' ? 'Menunggu' : order.payment_status === 'verified' ? 'Terverifikasi' : 'Ditolak'}</td>
            <td className="px-4 py-3 whitespace-nowrap">Rp {parseFloat(order.total_cost).toLocaleString('id-ID')}</td>
            
        </tr >
    );
};
export default OrderItem;