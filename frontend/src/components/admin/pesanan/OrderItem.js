import React, { useState } from 'react';
import PaymentModal from './PaymentModal';
import Swal from 'sweetalert2';


const OrderItem = ({ order, onVerifyPayment }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isPaymentVerified = order.payment_status === 'verified';
    const isPaymentRejected = order.payment_status === 'rejected';

    const handleOpenModal = () => {
        if (order.proof_url) {
            setIsModalOpen(true);
        } else {
            Swal.fire('Info', 'Bukti pembayaran belum diunggah.', 'info');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

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

    const handleSendToken = () => {
        Swal.fire({
            title: 'Kirim Token ke Pengguna',
            html: `<input id="tokenInput" class="swal2-input" placeholder="Masukkan Token">`,
            showCancelButton: true,
            confirmButtonText: 'Kirim',
            preConfirm: () => {
                return document.getElementById('tokenInput').value;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const tokenToSend = result.value;
                console.log('Token dikirim:', tokenToSend, 'untuk Order ID:', order.order_id);
                Swal.fire('Berhasil!', `Token "${tokenToSend}" telah dikirim.`, 'success');
            }
        });
    };

    return (
        <tr className={`hover:bg-gray-50 ${isPaymentRejected ? 'bg-red-50' : ''}`}>
            <td className="px-4 py-3 whitespace-nowrap">
                <button onClick={handleOpenModal} className="text-blue-500 hover:underline focus:outline-none">
                    {order.proof_url ? 'Lihat' : 'Belum Ada'}
                </button>
                {isModalOpen && <PaymentModal imageUrl={`<span class="math-inline">\{process\.env\.REACT\_APP\_API\_URL\}/</span>{order.proof_url}`} onClose={handleCloseModal} />}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">{order.order_status}</td>
            <td className="px-4 py-3 whitespace-nowrap">{order.payment_status === 'pending' ? 'Menunggu' : order.payment_status === 'verified' ? 'Terverifikasi' : 'Ditolak'}</td>
            <td className="px-4 py-3">{order.user_name}</td>
            <td className="px-4 py-3 whitespace-nowrap">Rp {parseFloat(order.total_cost).toLocaleString('id-ID')}</td>
            <td className="px-4 py-3 whitespace-nowrap">
                {order.payment_status === 'pending' && (
                    <div className="space-x-2">
                        <button onClick={() => handleVerify('verified')} className="inline-flex items-center px-3 py-2 border border-green-500 text-green-500 hover:bg-green-100 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                            Terima
                        </button>
                        <button onClick={() => handleVerify('rejected')} className="inline-flex items-center px-3 py-2 border border-red-500 text-red-500 hover:bg-red-100 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                            Tolak
                        </button>
                    </div>
                )}
                {isPaymentVerified && (
                    <button onClick={handleSendToken} className="inline-flex items-center px-3 py-2 border border-blue-500 text-blue-500 hover:bg-blue-100 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Kirim Token
                    </button>
                )}
                {isPaymentRejected && (
                    <span className="text-red-600 font-semibold">Ditolak</span>
                )}
            </td>
        </tr>
    );
};
export default OrderItem;