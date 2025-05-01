import React, { useRef, useEffect, useState } from 'react';
import { UsersIcon, ShoppingCartIcon, EyeIcon, BanknotesIcon, UserPlusIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

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

    return <span className="font-bold">{displayValue.toLocaleString('id-ID')}</span>;
};

const DashboardCards = ({ stats }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
        hover: { scale: 1.03, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" },
    };

    const iconStyle = (color) => ({
        backgroundColor: color,
        padding: '0.75rem',
        borderRadius: '9999px',
        color: '#fff',
        boxShadow: `0 2px 6px ${color}80`, // Subtle shadow
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Baris Pertama: Informasi Pengunjung dan Pengguna */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 transition-all duration-300"
            >
                <div className="flex-shrink-0" style={iconStyle('#3b82f6')}> {/* Blue 500 */}
                    <EyeIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Pengunjung</h2>
                    <p className="text-2xl font-extrabold text-gray-900">
                        <AnimatedNumber value={stats?.visitorCount || 0} />
                    </p>
                    <p className="text-sm text-gray-500">Total Pengunjung Website</p>
                </div>
            </motion.div>

            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 transition-all duration-300"
            >
                <div className="flex-shrink-0" style={iconStyle('#3b82f6')}> {/* Blue 500 */}
                    <EyeIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Pengunjung Hari Ini</h2>
                    <p className="text-2xl font-extrabold text-gray-900">
                        <AnimatedNumber value={stats?.todayVisitors || 0} />
                    </p>
                    <p className="text-sm text-gray-500">Jumlah Pengunjung Hari Ini</p>
                </div>
            </motion.div>

            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 transition-all duration-300"
            >
                <div className="flex-shrink-0" style={iconStyle('#10b981')}> {/* Green 500 */}
                    <UsersIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Pengguna Terdaftar</h2>
                    <p className="text-2xl font-extrabold text-gray-900">
                        <AnimatedNumber value={stats?.userCount || 0} />
                    </p>
                    <p className="text-sm text-gray-500">Total Pengguna</p>
                </div>
            </motion.div>

            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 transition-all duration-300"
            >
                <div className="flex-shrink-0" style={iconStyle('#10b981')}>
                    <UserPlusIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Pengguna Baru (Bulan Ini)</h2>
                    <p className="text-2xl font-extrabold text-gray-900">
                        <AnimatedNumber value={stats?.monthlyNewUsers || 0} />
                    </p>
                    <p className="text-sm text-gray-500">Total Pengguna Baru Bulan Ini</p>
                </div>
            </motion.div>

            {/* Baris Kedua: Informasi Order dan Pendapatan */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 transition-all duration-300"
            >
                <div className="flex-shrink-0" style={iconStyle('#8b5cf6')}> {/* Purple 500 */}
                    <ShoppingCartIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Jumlah Pesanan</h2>
                    <p className="text-2xl font-extrabold text-gray-900">
                        <AnimatedNumber value={stats?.orderCount || 0} />
                    </p>
                    <p className="text-sm text-gray-500">Total Order</p>
                </div>
            </motion.div>

            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 transition-all duration-300"
            >
                <div className="flex-shrink-0" style={iconStyle('#f59e0b')}>  {/* Yellow 500 */}
                    <ClockIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Order Tertunda</h2>
                    <p className="text-2xl font-extrabold text-gray-900">
                        <AnimatedNumber value={stats?.pendingOrders || 0} />
                    </p>
                    <p className="text-sm text-gray-500">Order yang Menunggu Pembayaran</p>
                </div>
            </motion.div>

            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 transition-all duration-300"
            >
                <div className="flex-shrink-0" style={iconStyle('#22c55e')}>  {/* Green 500 */}
                    <CheckCircleIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                     <h2 className="text-sm font-semibold text-gray-600">Order Disetujui</h2>
                    <p className="text-2xl font-extrabold text-gray-900">
                        <AnimatedNumber value={stats?.approvedOrders || 0} />
                    </p>
                    <p className="text-sm text-gray-500">Order yang telah Disetujui</p>
                </div>
            </motion.div>

            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 transition-all duration-300"
            >
                <div className="flex-shrink-0" style={iconStyle('#f97316')}> {/* Orange 500 */}
                    <BanknotesIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600">Total Pendapatan</h2>
                    <p className="text-2xl font-extrabold text-gray-900">
                        Rp. {stats?.totalRevenue !== null ? (
                            <><AnimatedNumber value={parseFloat(stats.totalRevenue)} /></>
                        ) : (
                            '0'
                        )}
                    </p>
                    <p className="text-sm text-gray-500">Total Pendapatan dari Semua Order</p>
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardCards;
