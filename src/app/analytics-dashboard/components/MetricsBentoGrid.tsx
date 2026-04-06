'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Eye, Zap, CheckCircle2, Hash, CalendarCheck, Minus } from 'lucide-react';
import type { KPIMetrics } from '@/lib/realtime/types';

interface MetricCardProps {
    id: string;
    label: string;
    value: string;
    subValue?: string;
    trend?: number;
    trendLabel?: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    iconGradient: string;
    iconGlow: string;
    alert?: boolean;
    alertText?: string;
}

function MetricCard({ label, value, subValue, trend, trendLabel, icon: Icon, iconGradient, iconGlow, alert, alertText }: MetricCardProps) {
    const isPositive = trend !== undefined && trend > 0;
    const isNegative = trend !== undefined && trend < 0;

    return (
        <div
            className="glass-card p-5 flex flex-col gap-4 transition-all duration-200"
            style={alert ? { borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' } : undefined}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
            <div className="flex items-start justify-between">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: iconGradient, boxShadow: `0 4px 16px ${iconGlow}` }}
                >
                    <Icon size={18} className="text-white" />
                </div>
                {trend !== undefined && (
                    <div
                        className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                            background: isPositive ? 'rgba(16,185,129,0.15)' : isNegative ? 'rgba(239,68,68,0.15)' : 'rgba(100,116,139,0.15)',
                            color: isPositive ? '#10B981' : isNegative ? '#EF4444' : '#94A3B8',
                        }}
                    >
                        {isPositive ? <TrendingUp size={10} /> : isNegative ? <TrendingDown size={10} /> : <Minus size={10} />}
                        {isPositive ? '+' : ''}{trend}%
                    </div>
                )}
                {alert && (
                    <div
                        className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}
                    >
                        ⚠ Alert
                    </div>
                )}
            </div>
            <div>
                <p className="section-label mb-1">{label}</p>
                <p className="font-display text-3xl font-extrabold text-white tabular-nums leading-none transition-all duration-700">
                    {value}
                </p>
                {subValue && <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>{subValue}</p>}
                {trendLabel && (
                    <p className="text-xs font-medium mt-1" style={{ color: isPositive ? '#10B981' : isNegative ? '#EF4444' : 'var(--text-muted)' }}>
                        {trendLabel}
                    </p>
                )}
                {alertText && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{alertText}</p>}
            </div>
        </div>
    );
}

interface Props {
    kpis: KPIMetrics | null;
}

function formatReach(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return String(n);
}

export default function MetricsBentoGrid({ kpis }: Props) {
    const k = kpis ?? {
        engagementRate: 4.7, totalReach: 142300, postsPublished: 38,
        aiAcceptanceRate: 73, avgHashtagReach: 18400, bestPlatform: 'TikTok',
        bestPlatformEngagement: 7.8, engagementTrend: 12, reachTrend: 8,
        postsTrend: 19, aiAcceptanceTrend: -4, hashtagTrend: 23,
    };

    const metrics: MetricCardProps[] = [
        {
            id: 'metric-engagement',
            label: 'Avg Engagement Rate',
            value: `${k.engagementRate}%`,
            subValue: 'Across all platforms & post types',
            trend: k.engagementTrend,
            trendLabel: `${k.engagementTrend > 0 ? '+' : ''}${k.engagementTrend}% vs previous period`,
            icon: TrendingUp,
            iconGradient: 'linear-gradient(135deg,#10B981,#059669)',
            iconGlow: 'rgba(16,185,129,0.35)',
        },
        {
            id: 'metric-reach',
            label: 'Total Reach',
            value: formatReach(k.totalReach),
            subValue: 'Unique accounts reached',
            trend: k.reachTrend,
            trendLabel: `${k.reachTrend > 0 ? '+' : ''}${k.reachTrend}% vs previous period`,
            icon: Eye,
            iconGradient: 'linear-gradient(135deg,#7C3AED,#9333EA)',
            iconGlow: 'rgba(124,58,237,0.35)',
        },
        {
            id: 'metric-platform',
            label: 'Best Platform',
            value: k.bestPlatform,
            subValue: `${k.bestPlatformEngagement}% avg engagement this period`,
            icon: Zap,
            iconGradient: 'linear-gradient(135deg,#D946EF,#9333EA)',
            iconGlow: 'rgba(217,70,239,0.35)',
        },
        {
            id: 'metric-ai-acceptance',
            label: 'AI Acceptance Rate',
            value: `${k.aiAcceptanceRate}%`,
            subValue: 'Posts published with <20% edits',
            trend: k.aiAcceptanceTrend,
            trendLabel: `${k.aiAcceptanceTrend > 0 ? '+' : ''}${k.aiAcceptanceTrend}pp vs previous period`,
            icon: CheckCircle2,
            iconGradient: 'linear-gradient(135deg,#F59E0B,#D97706)',
            iconGlow: 'rgba(245,158,11,0.35)',
        },
        {
            id: 'metric-published',
            label: 'Posts Published',
            value: String(k.postsPublished),
            subValue: '14 scheduled · 6 drafts remaining',
            trend: k.postsTrend,
            trendLabel: `+${k.postsTrend}% vs previous 14 days`,
            icon: CalendarCheck,
            iconGradient: 'linear-gradient(135deg,#06B6D4,#0891B2)',
            iconGlow: 'rgba(6,182,212,0.35)',
        },
        {
            id: 'metric-hashtag',
            label: 'Avg Hashtag Reach',
            value: formatReach(k.avgHashtagReach),
            subValue: 'Per post, AI-optimized hashtags',
            trend: k.hashtagTrend,
            trendLabel: 'Top tag: #salesautomation',
            icon: Hash,
            iconGradient: 'linear-gradient(135deg,#EC4899,#F97316)',
            iconGlow: 'rgba(236,72,153,0.35)',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((m, i) => (
                <div key={m.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <MetricCard {...m} />
                </div>
            ))}
        </div>
    );
}