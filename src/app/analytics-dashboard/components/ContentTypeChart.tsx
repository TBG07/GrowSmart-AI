'use client';

import React from 'react';
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer } from 'recharts';
import type { ContentTypeData } from '@/lib/realtime/types';

interface Props {
    contentTypes: ContentTypeData[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
    if (!active || !payload || !payload.length) return null;
    const d = payload[0].payload;
    return (
        <div
            className="rounded-xl px-4 py-3 text-xs shadow-xl"
            style={{ background: 'rgba(11,16,30,0.95)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
            <p className="font-semibold text-white mb-1">{d.name}</p>
            <div className="flex justify-between gap-4"><span style={{ color: 'var(--text-secondary)' }}>Avg Engagement</span><span className="font-bold text-white">{d.value.toFixed(1)}%</span></div>
            <div className="flex justify-between gap-4"><span style={{ color: 'var(--text-secondary)' }}>Posts</span><span className="font-bold text-white">{d.posts}</span></div>
        </div>
    );
}

const FALLBACK: ContentTypeData[] = [
    { name: 'Carousel',      value: 6.2, fill: '#7C3AED', posts: 11 },
    { name: 'Reel / Video',  value: 5.8, fill: '#EC4899', posts: 6  },
    { name: 'Thought Lead.', value: 5.1, fill: '#3B82F6', posts: 8  },
    { name: 'Thread',        value: 3.9, fill: '#38BDF8', posts: 5  },
    { name: 'Static Post',   value: 3.2, fill: '#6B7280', posts: 8  },
];

export default function ContentTypeChart({ contentTypes }: Props) {
    const data = contentTypes.length > 0 ? contentTypes : FALLBACK;

    return (
        <div className="glass-card p-5 h-full">
            <div className="mb-4">
                <p className="font-display font-semibold text-white">Content Type Performance</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Avg engagement rate by format</p>
            </div>

            <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="25%" outerRadius="90%" data={data} startAngle={90} endAngle={-270}>
                    <RadialBar dataKey="value" cornerRadius={4} background={{ fill: 'rgba(255,255,255,0.03)' }} isAnimationActive={true} />
                    <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
            </ResponsiveContainer>

            <div className="space-y-1.5 mt-3">
                {data.map(d => (
                    <div key={`type-${d.name}`} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: d.fill }} />
                            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{d.posts} posts</span>
                            <span className="font-bold text-white tabular-nums w-8 text-right">{d.value.toFixed(1)}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}