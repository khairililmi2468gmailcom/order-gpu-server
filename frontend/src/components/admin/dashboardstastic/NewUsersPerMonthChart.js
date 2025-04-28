
import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale'; 
import { Legend } from '@headlessui/react';

const NewUsersPerMonthChart = ({ data }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const availableYears = Array.from(new Set(data.map(item => parseInt(item.month.split('-')[0], 10)))).sort((a, b) => b - a);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const filteredData = data
            .filter(item => item.month.startsWith(selectedYear.toString()))
            .map(item => ({
                ...item,
                monthName: format(parseISO(item.month), 'MMMM yyyy', { locale: id }), // Format tanggal Indonesia
            }));
        setChartData(filteredData);
    }, [selectedYear, data]);

    // Warna-warna cerah dan modern
    const COLORS = [
        '#6366f1', // Indigo
        '#22c55e', // Hijau
        '#f97316', // Oranye
        '#ef4444', // Merah
        '#8b5cf6', // Ungu
        '#ec4899', // Pink
        '#3b82f6', // Biru
        '#10b981', // Hijau Mint
        '#f59e0b', // Kuning Oranye
        '#e53e3e'  // Merah Coral
    ];

    return (
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pengguna Baru per Bulan</h2>
            <div className="flex justify-end mb-4">
                <select
                    value={selectedYear.toString()}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-48 font-medium"
                >
                    {availableYears.map(year => (
                        <option key={year} value={year.toString()}>{year}</option>
                    ))}
                </select>
            </div>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        className="text-sm"
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="monthName"
                            tick={{
                                fontSize: 12,
                                fill: '#6b7280',
                            }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tick={{
                                fontSize: 12,
                                fill: '#6b7280',
                            }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value} // Format angka jika perlu
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                color: '#1f2937',
                            }}
                            labelStyle={{
                                fontWeight: '600',
                                fontSize: '14px',
                                color: '#1f2937'
                            }}
                            itemStyle={{
                                fontSize: '12px',
                                color: '#4b5563'
                            }}
                            formatter={(value, name, entry) => [
                                value,
                                <span className="font-medium">{entry.monthName}</span>
                            ]}
                        />
                        <Legend
                            wrapperStyle={{
                                marginTop: 20,
                                fontSize: 12,
                                color: '#4b5563'
                            }}
                            formatter={(value) => (
                                <span className="font-medium text-gray-700">{value}</span>
                            )}
                        />
                        <Bar
                            dataKey="new_users"
                            fill={COLORS[0]}
                            barSize={20}
                            radius={[10, 10, 0, 0]}
                            style={{
                                transition: 'all 0.3s',
                                cursor: 'pointer'
                            }}
                            activeBar={{
                                fill: COLORS[0],
                                stroke: '#fff',
                                strokeWidth: 2,
                                filter: 'brightness(1.1)'
                            }}
                        >
                           {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    style={{
                                        transition: 'fill 0.3s',
                                    }}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative" role="alert">
                    <strong className="font-bold">Data Tidak Tersedia! </strong>
                    <span className="block sm:inline">Tidak ada data pengguna baru untuk tahun yang dipilih.</span>
                </div>
            )}
        </div>
    );
};

export default NewUsersPerMonthChart;
