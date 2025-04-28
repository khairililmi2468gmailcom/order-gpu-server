import React, { useState, useEffect, useCallback } from 'react';
import OrderList from '../../../components/admin/pesanan/OrderList';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/orders`, {
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

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token, fetchOrders]);

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center">
                <svg className="animate-spin h-10 w-10 text-indigo-500" viewBox="0 0 38 38" stroke="currentColor">
                    <g fill="none" fillRule="evenodd">
                        <g transform="translate(1 1)" strokeWidth="2">
                            <circle strokeOpacity=".5" cx="18" cy="18" r="18" stroke="currentColor" />
                            <path d="M36 18c0-9.94-8.06-18-18-18" transform="rotate(30 18 18)" stroke="currentColor" strokeDasharray="46.4955,20.7018" />
                        </g>
                    </g>
                </svg>
            </div>
        );
    }

    if (error) {
        return <div className="p-8 text-red-500">Terjadi kesalahan: {error}</div>;
    }

    return (
        <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Manajemen Pesanan</h1>
            {orders.length > 0 ? (
                <OrderList orders={orders} onRefresh={fetchOrders} />
            ) : (
                <p className="text-gray-600">Tidak ada data pesanan.</p>
            )}
        </div>
    );
}

export default AdminOrders;

