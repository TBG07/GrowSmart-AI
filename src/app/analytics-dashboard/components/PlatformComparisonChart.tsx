'use client';

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import type { PlatformData } from '@/lib/realtime/types';

interface Props {
    platforms: PlatformData[];
}

const FALLBACK: PlatformData[] = [
    { platform: 'tiktok',    label: 'TikTok',    engagementRate: 7.8, reach: 38400, posts: 8,  color: '#D946EF' },
    { platform: 'linkedin',  label: 'LinkedIn',  engagementRate: 5.8, reach: 58200, posts: 14, color: '#3B82F6' },
    { platform: 'instagram', label: 'Instagram', engagementRate: 4.7, reach: 52100, posts: 16, color: '#EC4899' },
    { platform: 'twitter',   label: 'Twitter/X', engagementRate: 3.1, reach: 32000, posts: 8,  color: '#38BDF8' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div
            className="rounded-xl px-4 py-3 text-xs shadow-xl space-y-1"
            style={{ background: 'rgba(11,16,30,0.95)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
            <p className="font-semibold text-white mb-1.5">{label}</p>
            <div className="flex justify-between gap-4"><span style={{ color: 'var(--text-secondary)' }}>Engagement</span><span className="font-bold text-white">{payload[0]?.value?.toFixed(1)}%</span></div>
        </div>
    );
}

export default function PlatformComparisonChart({ platforms }: Props) {
    const data = platforms.length > 0 ? platforms : FALLBACK;

    // Sort by engagement rate descending for a ranked look
    const sorted = [...data].sort((a, b) => b.engagementRate - a.engagementRate);

    // Map platform to display label for X axis
    const chartData = sorted.map(p => ({
        ...p,
        platform: p.label,
    }));

    return (
        <div className="glass-card p-5">
            <div className="flex items-start justify-between mb-5">
                <div>
                    <p className="font-display font-semibold text-white">Platform Comparison</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Engagement rate by platform — live
                    </p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={44}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="platform" tick={{ fontSize: 11, fill: '#4B5563' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#4B5563' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="engagementRate" radius={[8, 8, 0, 0]} isAnimationActive={true}>
                        {chartData.map(entry => (
                            <Cell key={`cell-platform-${entry.platform}`} fill={entry.color} fillOpacity={0.85} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <div
                className="grid grid-cols-4 gap-3 mt-4 pt-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
                {sorted.map(d => (
                    <div key={`plat-sum-${d.platform}`} className="text-center">
                        <p className="text-sm font-bold text-white tabular-nums">{(d.reach / 1000).toFixed(1)}K</p>
                        <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>Reach · {d.posts} posts</p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{d.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}