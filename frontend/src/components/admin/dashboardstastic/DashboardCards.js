import React, { useState, useEffect, useRef } from 'react';
import { UsersIcon, ShoppingCartIcon, EyeIcon, BanknotesIcon,  } from '@heroicons/react/24/outline';

const AnimatedNumber = ({ value, duration = 2000 }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const frameRef = useRef();

    useEffect(() => {
        let startTime = null;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;
            if (progress < duration) {
                const ease = (x) => 0.5 * (1 - Math.cos(Math.PI * x)); // Easing function
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4">
                <div className="flex-shrink-0">
                    <EyeIcon className="h-10 w-10 text-blue-500" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Pengunjung</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        <AnimatedNumber value={stats?.visitorCount || 0} />
                    </p>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4">
                <div className="flex-shrink-0">
                    <UsersIcon className="h-10 w-10 text-green-500" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Pengguna Terdaftar</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        <AnimatedNumber value={stats?.userCount || 0} />
                    </p>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4">
                <div className="flex-shrink-0">
                    <ShoppingCartIcon className="h-10 w-10 text-purple-500" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Jumlah Pesanan</h2>
                    <p className="text-2xl font-bold text-gray-900">
                        <AnimatedNumber value={stats?.orderCount || 0} />
                    </p>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4">
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
                </div>
            </div>
        </div>
    );
};

export default DashboardCards;
