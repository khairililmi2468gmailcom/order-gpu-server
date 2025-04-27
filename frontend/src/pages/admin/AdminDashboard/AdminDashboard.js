import React, { useState, useEffect } from 'react';
import DashboardCards from '../../../components/admin/dashboardstastic/DashboardCards';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
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
                console.error("Gagal mengambil data statistik:", error);
                // Handle error UI di sini jika perlu
            }
        };

        if (token) {
            fetchStats();
        }
    }, [token]);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Dashboard Admin</h1>
            {stats ? (
                <DashboardCards stats={stats} />
            ) : (
                <p>Sedang memuat data statistik...</p>
            )}
        </div>
    );
}

export default AdminDashboard;