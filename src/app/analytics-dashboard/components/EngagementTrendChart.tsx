'use client';

import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { EngagementPoint } from '@/lib/realtime/types';

interface Props {
    dateRange: string;
    trendData: EngagementPoint[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div
            className="rounded-xl px-4 py-3 text-xs shadow-xl"
            style={{ background: 'rgba(11,16,30,0.95)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
        >
            <p className="font-semibold text-white mb-2">{label}</p>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {payload.map((entry: any) => (
                <div key={`tooltip-${entry.name}`} className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="capitalize" style={{ color: 'var(--text-secondary)' }}>{entry.name}:</span>
                    <span className="font-bold text-white">{entry.value}%</span>
                </div>
            ))}
        </div>
    );
}

export default function EngagementTrendChart({ dateRange, trendData }: Props) {
    void dateRange;

    // Slice data to only show labels every few days when many data points
    const displayData = trendData.length > 14
        ? trendData.filter((_, i) => i % 2 === 0 || i === trendData.length - 1)
        : trendData;

    return (
        <div className="glass-card p-5">
            <div className="flex items-start justify-between mb-5">
                <div>
                    <p className="font-display font-semibold text-white">Engagement Rate Trend</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Daily engagement rate per platform — last {trendData.length} days
                    </p>
                </div>
                <span
                    className="text-[10px] px-2 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(124,58,237,0.15)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.25)' }}
                >
                    % Engagement
                </span>
            </div>

            <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={displayData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradInstagram" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#EC4899" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradLinkedin" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradTwitter" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#38BDF8" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradTiktok" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#D946EF" stopOpacity={0.45} />
                            <stop offset="95%" stopColor="#D946EF" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#4B5563' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#4B5563' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
                        formatter={value => <span style={{ color: '#94A3B8', textTransform: 'capitalize' }}>{value}</span>}
                    />
                    <Area type="monotone" dataKey="instagram" stroke="#EC4899" strokeWidth={2} fill="url(#gradInstagram)" dot={false} isAnimationActive={true} />
                    <Area type="monotone" dataKey="linkedin"  stroke="#3B82F6" strokeWidth={2} fill="url(#gradLinkedin)"  dot={false} isAnimationActive={true} />
                    <Area type="monotone" dataKey="twitter"   stroke="#38BDF8" strokeWidth={2} fill="url(#gradTwitter)"   dot={false} isAnimationActive={true} />
                    <Area type="monotone" dataKey="tiktok"    stroke="#D946EF" strokeWidth={2} fill="url(#gradTiktok)"    dot={false} isAnimationActive={true} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}