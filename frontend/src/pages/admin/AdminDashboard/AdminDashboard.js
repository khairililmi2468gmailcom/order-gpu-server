import React, { useState, useEffect } from 'react';
import DashboardCards from '../../../components/admin/dashboardstastic/DashboardCards';
import DailyVisitorsAreaChart from '../../../components/admin/dashboardstastic/DailyVisitorsAreaChart';
import MonthlyRevenueChart from '../../../components/admin/dashboardstastic/MonthlyRevenueChart';
import NewUsersPerMonthChart from '../../../components/admin/dashboardstastic/NewUsersPerMonthChart';
import OrderStatusPieChart from '../../../components/admin/dashboardstastic/OrderStatusPieChart';


function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/admin/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStats(data);
            } catch (error) {
                setError(error.message);
                console.error("Gagal mengambil data statistik:", error);
                // Handle error UI di sini jika perlu
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchStats();
        } else {
            setLoading(false); // Set loading false jika tidak ada token
        }
    }, [token]);

    if (loading) {
        return (
            <div className="p-8">
                <p>Sedang memuat data statistik...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error! </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-8 bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Tidak Ada Data! </strong>
                <span className="block sm:inline">Tidak ada data statistik yang tersedia. Pastikan Anda login sebagai admin.</span>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
            <DashboardCards stats={stats.cards} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <MonthlyRevenueChart data={stats.charts.lineChart.data} />
                <NewUsersPerMonthChart data={stats.charts.barChart.data} />
                <OrderStatusPieChart data={stats.charts.pieChart.data} />
                <DailyVisitorsAreaChart data={stats.charts.areaChart.data} />
            </div>
        </div>
    );
}

export default AdminDashboard;
