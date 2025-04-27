import React, { useState, useEffect, useCallback } from 'react';
import OrderList from '../../../components/admin/pesanan/OrderList';
import Swal from 'sweetalert2';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/payments`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const message = await response.json()?.message || `HTTP error! status: ${response.status}`;
                throw new Error(message);
            }
            const data = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (err) {
            console.error("Gagal mengambil data pesanan:", err);
            setError(err.message);
            setLoading(false);
        }
    }, [token]);

    const handleVerifyPayment = async (paymentId, status) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/payments/verify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ payment_id: paymentId, status: status }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            Swal.fire('Berhasil!', data.message, 'success').then(() => {
                fetchOrders();
            });
        } catch (error) {
            console.error("Gagal memverifikasi pembayaran:", error);
            Swal.fire('Error!', error.message, 'error');
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token, fetchOrders]);

    if (loading) {
        return <div className="p-8">Sedang memuat data pesanan...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-500">Terjadi kesalahan: {error}</div>;
    }

    return (
        <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Manajemen Pesanan</h1>
            {orders.length > 0 ? (
                <OrderList orders={orders} onVerifyPayment={handleVerifyPayment} />
            ) : (
                <p className="text-gray-600">Tidak ada data pesanan.</p>
            )}
        </div>
    );
}

export default AdminOrders;
