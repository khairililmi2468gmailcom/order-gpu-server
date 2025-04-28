import React, { useRef, useEffect, useState } from 'react';
import { UsersIcon, ShoppingCartIcon, EyeIcon, BanknotesIcon, UserPlusIcon, ClockIcon,  CheckCircleIcon } from '@heroicons/react/24/outline';

const AnimatedNumber = ({ value, duration = 2000 }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const frameRef = useRef();

    useEffect(() => {
        let startTime = null;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;
            if (progress < duration) {
                const ease = (x) => 0.5 * (1 - Math.cos(Math.PI * x));
                setDisplayValue(Math.round(ease(progress / duration) * value));
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayValue(value);
            }
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameRef.current);
    }, [value, duration]);

    return <span>{displayValue.toLocaleString('id-ID')}</span>;
};

const DashboardCards = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            {/* Baris Pertama: Informasi Pengunjung dan Pengguna */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4 transition-transform hover:scale-105">
                <div className="flex-shrink-0">
                    <EyeIcon className="h-10 w-10 text-blue-500" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Pengunjung</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        <AnimatedNumber value={stats?.visitorCount || 0} />
                    </p>
                    <p className="text-xs text-gray-500">Total Pengunjung Website</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4 transition-transform hover:scale-105">
                <div className="flex-shrink-0">
                    <EyeIcon className="h-10 w-10 text-blue-500" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Pengunjung Hari Ini</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        <AnimatedNumber value={stats?.todayVisitors || 0} />
                    </p>
                    <p className="text-xs text-gray-500">Jumlah Pengunjung Hari Ini</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4 transition-transform hover:scale-105">
                <div className="flex-shrink-0">
                    <UsersIcon className="h-10 w-10 text-green-500" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Pengguna Terdaftar</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        <AnimatedNumber value={stats?.userCount || 0} />
                    </p>
                    <p className="text-xs text-gray-500">Total Pengguna</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4 transition-transform hover:scale-105">
                <div className="flex-shrink-0">
                    <UserPlusIcon className="h-10 w-10 text-green-500" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Pengguna Baru (Bulan Ini)</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        <AnimatedNumber value={stats?.monthlyNewUsers || 0} />
                    </p>
                    <p className="text-xs text-gray-500">Total Pengguna Baru Bulan Ini</p>
                </div>
            </div>

            {/* Baris Kedua: Informasi Order dan Pendapatan */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4 transition-transform hover:scale-105">
                <div className="flex-shrink-0">
                    <ShoppingCartIcon className="h-10 w-10 text-purple-500" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Jumlah Pesanan</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        <AnimatedNumber value={stats?.orderCount || 0} />
                    </p>
                    <p className="text-xs text-gray-500">Total Order</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4 transition-transform hover:scale-105">
                <div className="flex-shrink-0">
                    <ClockIcon className="h-10 w-10 text-yellow-500" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Order Tertunda</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        <AnimatedNumber value={stats?.pendingOrders || 0} />
                    </p>
                    <p className="text-xs text-gray-500">Order yang Menunggu Pembayaran</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4 transition-transform hover:scale-105">
                <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-10 w-10 text-green-500" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Order Disetujui</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        <AnimatedNumber value={stats?.approvedOrders || 0} />
                    </p>
                    <p className="text-xs text-gray-500">Order yang telah Disetujui</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4 transition-transform hover:scale-105">
                <div className="flex-shrink-0">
                    <BanknotesIcon className="h-10 w-10 text-orange-500" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Total Pendapatan</h2>
                    <p className="text-2xl font-bold text-gray-900">Rp.
                        {stats?.totalRevenue !== null ? (
                            <><AnimatedNumber value={parseFloat(stats.totalRevenue)} /> </>
                        ) : (
                            'Rp 0'
                        )}
                    </p>
                    <p className="text-xs text-gray-500">Total Pendapatan dari Semua Order</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardCards;
