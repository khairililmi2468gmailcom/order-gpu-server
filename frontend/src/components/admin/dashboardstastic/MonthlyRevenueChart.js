import React, { useState, useEffect } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

const MonthlyRevenueChart = ({ data }) => {
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
    const COLORS = ['#880E4F', '#D81B60', '#F48FB1', '#F8BBD0', '#CE93D8', '#9C27B0', '#7B1FA2', '#4A148C'];

    return (
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pendapatan Bulanan</h2>
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
                    <LineChart
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
                            tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                            tick={{
                                fontSize: 12,
                                fill: '#6b7280',
                            }}
                            tickLine={false}
                            axisLine={false}
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
                            formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                        />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke={COLORS[0]}
                            strokeWidth={3}
                            activeDot={{
                                r: 8,
                                stroke: COLORS[0],
                                strokeWidth: 3,
                                fill: '#fff',
                            }}
                            style={{
                                transition: 'all 0.3s',
                            }}
                            
                        />
                       
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative" role="alert">
                    <strong className="font-bold">Data Tidak Tersedia! </strong>
                    <span className="block sm:inline">Tidak ada data pendapatan untuk tahun yang dipilih.</span>
                </div>
            )}
        </div>
    );
};

export default MonthlyRevenueChart;
