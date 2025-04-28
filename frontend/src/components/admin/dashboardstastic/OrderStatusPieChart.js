import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const OrderStatusPieChart = ({ data }) => {
    // Warna lebih cerah dan modern dengan kombinasi kontras
    const COLORS = [
        '#3B82F6',  // Biru cerah
        '#10B981',  // Hijau mint
        '#F59E0B',  // Kuning-oranye
        '#EF4444',  // Merah coral
        '#8B5CF6',  // Ungu cerah
        '#EC4899'   // Pink neon
    ];

    const statusLabelMap = {
        'pending_payment': 'Pembayaran Tertunda',
        'pending_approval': 'Persetujuan Tertunda',
        'approved': 'Disetujui',
        'rejected': 'Ditolak',
        'active': 'Aktif',
        'completed': 'Selesai',
    };

    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index
    }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        // Hitung kontras warna untuk teks
        const color = COLORS[index % COLORS.length];
        const brightness = parseInt(color.slice(1, 3), 16) * 0.299 +
                         parseInt(color.slice(3, 5), 16) * 0.587 +
                         parseInt(color.slice(5, 7), 16) * 0.114;
        const textColor = brightness > 150 ? '#1F2937' : '#F9FAFB';

        return (
            <g>
                <text
                    x={x}
                    y={y}
                    fill={textColor}
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight={600}
                    style={{
                        transition: 'all 0.3s',
                        filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))'
                    }}
                >
                    {`${(percent * 100).toFixed(0)}%`}
                </text>
            </g>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 transition-all hover:shadow-2xl">
            <h2 className="text-2xl font-extrabold mb-6 text-gray-800">Status Order</h2>
            <ResponsiveContainer width="100%" height={420}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        innerRadius={90}
                        outerRadius={170}
                        paddingAngle={1}
                        dataKey="count"
                        nameKey="status"
                        label={renderCustomizedLabel}
                        isAnimationActive={true}
                        animationDuration={600}
                        animationEasing="ease-out"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                stroke="#FFFFFF"
                                strokeWidth={4}
                                style={{
                                    transition: 'all 0.3s',
                                    cursor: 'pointer',
                                    filter: 'saturate(1.2)'
                                }}
                            />
                        ))}
                    </Pie>
                    
                    {/* Custom Tooltip */}
                    <Tooltip
                        content={({ payload }) => {
                            if (!payload?.length) return null;
                            const { status, count } = payload[0].payload;
                            const total = data.reduce((acc, curr) => acc + curr.count, 0);
                            const percentage = ((count / total) * 100).toFixed(1);
                            
                            return (
                                <div className="bg-gray-800/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10">
                                    <p className="font-bold text-sm mb-1 text-indigo-400">
                                        {statusLabelMap[status] || status}
                                    </p>
                                    <p className="text-xs font-semibold">
                                        <span className="text-lg mr-1">{count}</span>
                                        orders • {percentage}%
                                    </p>
                                </div>
                            );
                        }}
                    />
                    
                    {/* Vertical Legend dengan efek modern */}
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{
                            right: -10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                        }}
                        payload={data.map((item, index) => ({
                            id: item.status,
                            type: 'circle',
                            value: statusLabelMap[item.status] || item.status,
                            color: COLORS[index % COLORS.length],
                        }))}
                        formatter={(value) => (
                            <span className="text-sm font-medium text-gray-600">
                                {value}
                            </span>
                        )}
                        iconSize={14}
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OrderStatusPieChart;