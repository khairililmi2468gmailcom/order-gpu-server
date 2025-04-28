import React, { useEffect, useState } from 'react';
import PaymentModal from './PaymentModal';
import Swal from 'sweetalert2';
import { Pencil, Zap, CheckCircle } from 'lucide-react';

const PaymentItem = ({ order, onVerifyPayment,onUpdateOrder }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isPaymentVerified = order.payment_status === 'verified';
    const isPaymentRejected = order.payment_status === 'rejected';
    const isOrderApproved = order.order_status === 'approved';
    const [hasToken, setHasToken] = useState(order.token !== null && order.token !== undefined && order.token !== ''); // State untuk keberadaan token
    const [isActive, setIsActive] = useState(order.is_active); // State untuk status token aktif/nonaktif
    const [localOrder, setLocalOrder] = useState(order);

    // Mendapatkan token dari localStorage
    const adminToken = localStorage.getItem('token');

    useEffect(() => {
        setLocalOrder(order);
        setHasToken(order.token !== null && order.token !== undefined && order.token !== '');
        setIsActive(order.is_active);
    }, [order]);

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

    const handleSendToken = async () => {
        Swal.fire({
            title: 'Kirim Token ke Pengguna',
            html: `<input id="tokenInput" class="swal2-input" placeholder="Masukkan Token">`,
            showCancelButton: true,
            confirmButtonText: 'Kirim',
            preConfirm: () => {
                return document.getElementById('tokenInput').value;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const tokenToSend = result.value;
                if (!tokenToSend) {
                    Swal.fire('Error', 'Token tidak boleh kosong', 'error');
                    return;
                }
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/tokens/order-token`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${adminToken}`,
                        },
                        body: JSON.stringify({
                            order_id: order.order_id,
                            token: tokenToSend,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    const responseData = await response.json();
                    setLocalOrder(prevOrder => ({
                        ...prevOrder,
                        token: tokenToSend
                    }));
                    setHasToken(true);
                    Swal.fire('Berhasil!', `Token "${tokenToSend}" telah dikirim.`, 'success');
                } catch (error) {
                    console.error("Gagal mengirim token:", error);
                    Swal.fire('Error!', error.message, 'error');
                }
            }
        });
    };

    const handleUpdateToken = async () => {
        Swal.fire({
            title: 'Update Token Pengguna',
            html: `<input id="tokenInput" class="swal2-input" placeholder="Masukkan Token Baru" value="${order.token || ''}">`, //Menampilkan token lama
            showCancelButton: true,
            confirmButtonText: 'Update',
            preConfirm: () => {
                return document.getElementById('tokenInput').value;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const newToken = result.value;
                if (!newToken) {
                    Swal.fire('Error', 'Token tidak boleh kosong', 'error');
                    return;
                }
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/tokens/order-token`, {
                        method: 'PUT', // Menggunakan method PUT
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${adminToken}`,
                        },
                        body: JSON.stringify({
                            order_id: order.order_id,
                            token: newToken,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }
                    const responseData = await response.json();

                    setLocalOrder(prevOrder => ({
                        ...prevOrder,
                        token: newToken
                    }));
                    onUpdateOrder(responseData.data);
                    Swal.fire('Berhasil!', `Token berhasil diupdate menjadi "${newToken}".`, 'success');
                } catch (error) {
                    console.error("Gagal mengupdate token:", error);
                    Swal.fire('Error!', error.message, 'error');
                }
            }
        });
    };

    const handleToggleTokenStatus = async () => {
        const newIsActive = !isActive;
        Swal.fire({
            title: 'Konfirmasi',
            text: `Anda yakin ingin ${newIsActive ? 'mengaktifkan' : 'menonaktifkan'} token ini?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/tokens/token-status`, {
                        method: 'PUT', // Menggunakan method PUT
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${adminToken}`,
                        },
                        body: JSON.stringify({
                            order_id: order.order_id,
                            is_active: newIsActive,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                    }

                    const responseData = await response.json();

                    setIsActive(newIsActive);
                    setLocalOrder(prevOrder => ({
                        ...prevOrder,
                        is_active: newIsActive
                    }));
                    Swal.fire('Berhasil!', `Token berhasil di${newIsActive ? 'aktifkan' : 'nonaktifkan'}.`, 'success');
                } catch (error) {
                    console.error("Gagal mengubah status token:", error);
                    Swal.fire('Error!', error.message, 'error');
                }
            }
        });
    };

    return (
        <tr className={`hover:bg-gray-50 ${isPaymentRejected ? 'bg-red-100 hover:bg-red-200' : ''} text-sm`}>
            <td className="px-3 py-2 whitespace-nowrap">
                {order.proof_url ? (
                    <button
                        onClick={handleOpenModal}
                        className="inline-flex items-center justify-center p-1 text-blue-500 hover:bg-blue-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform active:scale-95"
                        title="Lihat Bukti Pembayaran"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 9C18 10.1046 17.1046 11 16 11C14.8954 11 14 10.1046 14 9C14 7.89543 14.8954 7 16 7C17.1046 7 18 7.89543 18 9Z" fill="#152C70" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M2 8C2 5.23858 4.23858 3 7 3H17C19.7614 3 22 5.23858 22 8V16C22 18.7614 19.7614 21 17 21H7C4.23858 21 2 18.7614 2 16V8ZM7 5C5.34315 5 4 6.34315 4 8V13.2379L5.51703 11.4175C6.80081 9.87698 9.20548 10.0054 10.3178 11.674L11.7548 13.8294C12.0548 14.2794 12.6582 14.4094 13.1169 14.1227L13.9533 13.5999C15.2488 12.7903 16.9458 13.0834 17.8946 14.2807L19.8918 16.8012C19.9623 16.5461 20 16.2775 20 16V8C20 6.34315 18.6569 5 17 5H7ZM18.6767 18.4881L16.3271 15.5229C16.0108 15.1237 15.4451 15.026 15.0133 15.2959L14.1769 15.8187C12.801 16.6786 10.9907 16.2888 10.0907 14.9388L8.65374 12.7834C8.28296 12.2272 7.4814 12.1844 7.05347 12.6979L4.01897 16.3393C4.18749 17.8364 5.45786 19 7 19H17C17.6211 19 18.198 18.8113 18.6767 18.4881Z" fill="#152C70" />
                        </svg>
                    </button>
                ) : (
                    <span className="text-gray-600">Belum Ada</span>
                )}
                {isModalOpen && <PaymentModal imageUrl={`${process.env.REACT_APP_API_URL}/${order.proof_url}`} onClose={handleCloseModal} />}
            </td>
            <td className="px-3 py-2 uppercase text-gray-700">{order.user_name}</td>
            <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-xs">
                    <div className="font-semibold text-indigo-700">{order.gpu_package_name}</div>
                    <div className="italic text-gray-500">Harga/Jam: {order.price_per_hour}</div>
                    <div>vCPU: <span className="font-medium">{order.vcpu}</span> Core</div>
                    <div>RAM: <span className="font-medium">{order.ram}</span> GB</div>
                    <div>Min. Periode: <span className="font-medium">{order.min_period_days}</span> Hari</div>
                </div>
            </td>
            <td className="px-3 py-2 whitespace-nowrap text-gray-700">{order.duration_days} Hari</td>
            <td className="px-3 py-2 whitespace-nowrap text-gray-700">{
                order.order_status === 'pending_approval' ? 'Menunggu' :
                    order.order_status === 'pending_payment' ? 'Menunggu Bayar' :
                        order.order_status === 'approved' ? 'Disetujui' :
                            order.order_status === 'rejected' ? 'Ditolak' :
                                order.order_status === 'active' ? 'Aktif' : 'Selesai'
            }</td>
            <td className="px-3 py-2 whitespace-nowrap text-gray-700">{
                order.payment_status === 'pending' ? 'Menunggu' :
                    order.payment_status === 'verified' ? 'Terverifikasi' : 'Ditolak'
            }</td>
            <td className="px-3 py-2 whitespace-nowrap text-gray-700">Rp {parseFloat(order.total_cost).toLocaleString('id-ID')}</td>
            <td className="px-3 py-2 whitespace-nowrap">
                {order.payment_status === 'pending' && (
                    <div className="space-x-1 flex">
                        <div className="flex flex-col items-center">
                            <button
                                onClick={() => handleVerify('verified')}
                                className="inline-flex items-center justify-center p-1 border border-green-500 text-green-500 hover:bg-green-100 font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </button>
                            <span className="text-xs text-gray-500 mt-0.5">Terima</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <button
                                onClick={() => handleVerify('rejected')}
                                className="inline-flex items-center justify-center p-1 border border-red-500 text-red-500 hover:bg-red-100 font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                            <span className="text-xs text-gray-500 mt-0.5">Tolak</span>
                        </div>
                    </div>
                )}
                {isPaymentVerified && isOrderApproved && !hasToken && (
                    <div className="flex flex-col items-center">
                        <button onClick={handleSendToken} className="inline-flex items-center justify-center p-1 border border-blue-500 text-blue-500 hover:bg-blue-100 font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <svg className="w-4 h-4 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L7 8m-5 5h10"></path></svg>
                        </button>
                        <span className="text-xs text-gray-500 mt-0.5">Kirim</span>
                    </div>
                )}
                {isPaymentVerified && isOrderApproved && hasToken && (
                    <div className="space-x-1 flex">
                        <div className="flex flex-col items-center">
                            <button onClick={handleUpdateToken} className="inline-flex items-center justify-center p-1 border border-blue-500 text-blue-500 hover:bg-blue-100 font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" title="Update Token">
                                <Pencil className="w-4 h-4" />
                            </button>
                            <span className="text-xs text-gray-500 mt-0.5">Update</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <button
                                onClick={handleToggleTokenStatus}
                                className="inline-flex items-center justify-center p-1 border border-gray-500 text-gray-500 hover:bg-gray-100 font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                title={isActive ? "Nonaktifkan Token" : "Aktifkan Token"}
                            >
                                {isActive ? (
                                    <Zap className="w-4 h-4 text-red-500" /> // Icon petir untuk non-aktif
                                ) : (
                                    <CheckCircle className="w-4 h-4 text-green-500" /> // Icon ceklis untuk aktif
                                )}
                            </button>
                            <span className="text-xs text-gray-500 mt-0.5">{isActive ? 'Aktif' : 'Nonaktif'}</span>
                        </div>
                    </div>
                )}
                {isPaymentRejected && (
                    <span className="inline-flex items-center text-red-600 font-semibold text-xs">
                        <svg className="w-4 h-4 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        Ditolak
                    </span>)}
            </td>
        </tr>
    );
};

export default PaymentItem;
