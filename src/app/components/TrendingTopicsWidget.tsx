'use client';

import React, { useState } from 'react';
import { TrendingUp, Hash, RefreshCw } from 'lucide-react';

interface Topic {
    tag: string;
    growth: string;
    category: string;
    volume: string;
    hot: boolean;
}

const trendingTopics: Topic[] = [
    { tag: 'AIMarketing', growth: '+340%', category: 'Tech', volume: '82K posts', hot: true },
    { tag: 'ContentCreator', growth: '+127%', category: 'Social', volume: '210K posts', hot: true },
    { tag: 'PersonalBranding', growth: '+89%', category: 'Business', volume: '155K posts', hot: false },
    { tag: 'SalesAutomation', growth: '+76%', category: 'SaaS', volume: '48K posts', hot: false },
    { tag: 'GrowthHacking', growth: '+61%', category: 'Marketing', volume: '93K posts', hot: false },
    { tag: 'StartupLife', growth: '+54%', category: 'Startup', volume: '177K posts', hot: false },
    { tag: 'CreatorEconomy', growth: '+48%', category: 'Social', volume: '120K posts', hot: false },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
    Tech: { bg: 'rgba(124,58,237,0.15)', text: '#A78BFA' },
    Social: { bg: 'rgba(236,72,153,0.15)', text: '#F472B6' },
    Business: { bg: 'rgba(6,182,212,0.15)', text: '#67E8F9' },
    SaaS: { bg: 'rgba(16,185,129,0.15)', text: '#6EE7B7' },
    Marketing: { bg: 'rgba(245,158,11,0.15)', text: '#FCD34D' },
    Startup: { bg: 'rgba(239,68,68,0.15)', text: '#FCA5A5' },
};

export default function TrendingTopicsWidget() {
    const [loading, setLoading] = useState(false);

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1200);
    };

    return (
        <div className="glass-card overflow-hidden h-full">
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#F59E0B,#D97706)' }}
                    >
                        <TrendingUp size={13} className="text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-white text-sm">Trending Topics</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>In your niche · Right now</p>
                    </div>
                </div>
                <button
                    onClick={handleRefresh}
                    className="btn-secondary py-1.5 px-2.5 text-xs"
                    title="Refresh trends"
                >
                    <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                    {!loading ? 'Refresh' : '...'}
                </button>
            </div>

            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {trendingTopics.map((topic, i) => {
                    const cat = categoryColors[topic.category] ?? { bg: 'rgba(100,116,139,0.15)', text: '#94A3B8' };
                    return (
                        <div
                            key={topic.tag}
                            className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.03] cursor-pointer transition-colors duration-150 group animate-fade-in"
                            style={{ animationDelay: `${i * 50}ms`, borderColor: 'rgba(255,255,255,0.04)' }}
                        >
                            <span className="text-[11px] font-bold tabular-nums" style={{ color: 'var(--text-muted)', minWidth: '16px' }}>
                                {i + 1}
                            </span>
                            <Hash size={12} style={{ color: '#A78BFA', flexShrink: 0 }} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <p className="text-xs font-semibold text-white truncate">#{topic.tag}</p>
                                    {topic.hot && (
                                        <span className="text-[8px] font-black px-1 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444' }}>
                                            HOT
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{topic.volume}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[11px] font-bold" style={{ color: '#10B981' }}>{topic.growth}</span>
                                <span
                                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                    style={{ background: cat.bg, color: cat.text }}
                                >
                                    {topic.category}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
