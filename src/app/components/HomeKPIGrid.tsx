'use client';

import React from 'react';
import { TrendingUp, Eye, Zap, CalendarCheck, TrendingDown, Minus } from 'lucide-react';
import { useLiveDashboard } from '@/hooks/useLiveDashboard';

function formatReach(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
}

export default function HomeKPIGrid() {
    const { data } = useLiveDashboard();

    const k = data?.kpis;

    const kpis = [
        {
            id: 'kpi-engagement',
            label: 'Avg Engagement Rate',
            value: k ? `${k.engagementRate}%` : '4.7%',
            subtext: 'Across all platforms',
            trend: k?.engagementTrend ?? 12,
            trendLabel: 'vs last 14 days',
            icon: TrendingUp,
            gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            glowColor: 'rgba(16,185,129,0.35)',
        },
        {
            id: 'kpi-reach',
            label: 'Total Reach',
            value: k ? formatReach(k.totalReach) : '142.3K',
            subtext: 'Unique accounts reached',
            trend: k?.reachTrend ?? 8,
            trendLabel: 'vs last period',
            icon: Eye,
            gradient: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
            glowColor: 'rgba(124,58,237,0.35)',
        },
        {
            id: 'kpi-posts',
            label: 'Posts Published',
            value: k ? String(k.postsPublished) : '38',
            subtext: '14 scheduled · 6 drafts',
            trend: k?.postsTrend ?? 19,
            trendLabel: 'vs last period',
            icon: CalendarCheck,
            gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
            glowColor: 'rgba(6,182,212,0.35)',
        },
        {
            id: 'kpi-ai',
            label: 'AI Acceptance Rate',
            value: k ? `${k.aiAcceptanceRate}%` : '73%',
            subtext: 'Posts used with <20% edits',
            trend: k?.aiAcceptanceTrend ?? -4,
            trendLabel: 'vs last period',
            icon: Zap,
            gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            glowColor: 'rgba(245,158,11,0.35)',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => {
                const Icon = kpi.icon;
                const isPositive = kpi.trend > 0;
                const isNegative = kpi.trend < 0;
                return (
                    <div
                        key={kpi.id}
                        className="glass-card p-5 flex flex-col gap-4 animate-slide-up"
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <div className="flex items-start justify-between">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: kpi.gradient, boxShadow: `0 4px 16px ${kpi.glowColor}` }}
                            >
                                <Icon size={18} className="text-white" />
                            </div>
                            <div
                                className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                style={{
                                    background: isPositive ? 'rgba(16,185,129,0.15)' : isNegative ? 'rgba(239,68,68,0.15)' : 'rgba(100,116,139,0.15)',
                                    color: isPositive ? '#10B981' : isNegative ? '#EF4444' : '#94A3B8',
                                }}
                            >
                                {isPositive ? <TrendingUp size={10} /> : isNegative ? <TrendingDown size={10} /> : <Minus size={10} />}
                                {isPositive ? '+' : ''}{kpi.trend}%
                            </div>
                        </div>
                        <div>
                            <p className="section-label mb-1">{kpi.label}</p>
                            <p className="font-display text-3xl font-extrabold text-white leading-none tabular-nums transition-all duration-700">
                                {kpi.value}
                            </p>
                            <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>{kpi.subtext}</p>
                            <p
                                className="text-[11px] mt-0.5 font-medium"
                                style={{ color: isPositive ? '#10B981' : isNegative ? '#EF4444' : 'var(--text-muted)' }}
                            >
                                {isPositive ? '+' : ''}{kpi.trend}% {kpi.trendLabel}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
