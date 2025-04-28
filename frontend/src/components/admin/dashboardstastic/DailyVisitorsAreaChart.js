import React, { useState, useEffect, useRef } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

const DailyVisitorsAreaChart = ({ data }) => {
    const [chartData, setChartData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isLoaded, setIsLoaded] = useState(false);
    const chartRef = useRef(null);
    const [yAxisDomain, setYAxisDomain] = useState([0, 1]);

    const availableMonths = [...new Array(12).keys()];
    const availableYears = Array.from(new Set(data.map(item => new Date(item.date).getFullYear()))).sort((a, b) => b - a);
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus",
        "September", "Oktober", "November", "Desember"
    ];

    useEffect(() => {
        const processedData = data
            .map(item => ({
                ...item,
                date: format(parseISO(item.date), 'dd MMM yyyy', { locale: id }),
                visitors: Math.round(item.visitors),
                month: new Date(item.date).getMonth(),
                year: new Date(item.date).getFullYear(),
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const filteredData = processedData.filter(item => item.month === selectedMonth && item.year === selectedYear);

        const minVisitor = filteredData.length > 0 ? Math.min(...filteredData.map(d => d.visitors)) : 0;
        const maxVisitor = filteredData.length > 0 ? Math.max(...filteredData.map(d => d.visitors)) : 1;

        setYAxisDomain([minVisitor, maxVisitor]);
        setChartData(filteredData);
        setIsLoaded(true);
    }, [data, selectedMonth, selectedYear]);

    useEffect(() => {
        if (isLoaded && chartRef.current) {
        }
    }, [isLoaded]);

    // Warna-warna cerah dan modern
    const COLORS = ['#2980b9', '#8e44ad', '#27ae60', '#f1c40f', '#e74c3c', '#34495e'];

    return (
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pengunjung Harian</h2>
            <div className="flex gap-4 mb-4">
                <select
                    value={selectedMonth.toString()}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-48 font-medium bg-white text-gray-900 focus:ring-opacity-50"
                >
                    {availableMonths.map(month => (
                        <option key={month} value={month.toString()} className="text-gray-700 hover:bg-gray-100">
                            {monthNames[month]}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedYear.toString()}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                    className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-48 font-medium bg-white text-gray-900 focus:ring-opacity-50"
                >
                    {availableYears.map(year => (
                        <option key={year} value={year.toString()} className="text-gray-700 hover:bg-gray-100">
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                        ref={chartRef}
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                        style={{ opacity: isLoaded ? 1 : 0 }}
                        className="text-sm"
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="date"
                            tick={{
                                fontSize: 12,
                                fill: '#6b7280',
                            }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{
                                fontSize: 12,
                                fill: '#6b7280',
                            }}
                            axisLine={false}
                            tickLine={false}
                            domain={yAxisDomain}
                            tickFormatter={(value) => value.toLocaleString('id-ID')}
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
                            formatter={(value) => value.toLocaleString('id-ID')}
                        />
                        <Area
                            type="monotone"
                            dataKey="visitors"
                            stroke={COLORS[0]}
                            fill={`rgba(${parseInt(COLORS[0].slice(1, 3), 16)}, ${parseInt(COLORS[0].slice(3, 5), 16)}, ${parseInt(COLORS[0].slice(5, 7), 16)}, 0.3)`}
                            fillOpacity={1}
                            activeDot={{
                                r: 8,
                                stroke: COLORS[0],
                                strokeWidth: 3,
                                fill: '#fff'
                            }}
                            style={{
                                transition: 'all 0.3s'
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative" role="alert">
                    <strong className="font-bold">Data Tidak Tersedia! </strong>
                    <span className="block sm:inline">Tidak ada data pengunjung untuk bulan dan tahun yang dipilih.</span>
                </div>
            )}
        </div>
    );
};

export default DailyVisitorsAreaChart;
