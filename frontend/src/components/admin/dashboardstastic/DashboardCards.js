import React from 'react';

const DashboardCards = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-gray-700 font-semibold mb-2">Pengunjung</h2>
                <p className="text-3xl font-bold text-primary">{stats?.visitorCount || 0}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-gray-700 font-semibold mb-2">Pengguna Terdaftar</h2>
                <p className="text-3xl font-bold text-green-500">{stats?.userCount || 0}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-gray-700 font-semibold mb-2">Jumlah Pesanan</h2>
                <p className="text-3xl font-bold text-blue-500">{stats?.orderCount || 0}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-gray-700 font-semibold mb-2">Total Pendapatan</h2>
                <p className="text-3xl font-bold text-orange-500">
                    {stats?.totalRevenue !== null ? `Rp ${parseFloat(stats.totalRevenue).toLocaleString('id-ID')}` : 'Rp 0'}
                </p>
            </div>
        </div>
    );
};

export default DashboardCards;