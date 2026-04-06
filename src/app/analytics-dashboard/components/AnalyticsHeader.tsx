'use client';

import React from 'react';
import { Download, RefreshCw, Radio } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    dateRange: string;
    onDateRangeChange: (r: string) => void;
    isRefreshing?: boolean;
    secondsAgo?: number;
    onRefresh?: () => void;
}

const ranges = [
    { id: 'range-7d',  value: '7d',  label: '7 days' },
    { id: 'range-14d', value: '14d', label: '14 days' },
    { id: 'range-30d', value: '30d', label: '30 days' },
    { id: 'range-90d', value: '90d', label: '90 days' },
];

function LiveBadge({ isRefreshing, secondsAgo }: { isRefreshing: boolean; secondsAgo: number }) {
    const isStale = secondsAgo > 25;

    return (
        <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{
                background: isRefreshing
                    ? 'rgba(245,158,11,0.12)'
                    : isStale
                        ? 'rgba(245,158,11,0.12)'
                        : 'rgba(16,185,129,0.12)',
                border: `1px solid ${isRefreshing ? 'rgba(245,158,11,0.25)' : isStale ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)'}`,
                color: isRefreshing ? '#F59E0B' : isStale ? '#F59E0B' : '#10B981',
            }}
        >
            {isRefreshing ? (
                <>
                    <RefreshCw size={11} className="animate-spin" />
                    Updating…
                </>
            ) : (
                <>
                    {/* Pulsing live dot */}
                    <span className="relative flex h-2 w-2">
                        <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                            style={{ backgroundColor: isStale ? '#F59E0B' : '#10B981' }}
                        />
                        <span
                            className="relative inline-flex rounded-full h-2 w-2"
                            style={{ backgroundColor: isStale ? '#F59E0B' : '#10B981' }}
                        />
                    </span>
                    <Radio size={11} />
                    Live ·{' '}
                    {secondsAgo < 5
                        ? 'just now'
                        : `${secondsAgo}s ago`}
                </>
            )}
        </div>
    );
}

export default function AnalyticsHeader({
    dateRange,
    onDateRangeChange,
    isRefreshing = false,
    secondsAgo = 0,
    onRefresh,
}: Props) {
    return (
        <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
                <h1 className="font-display text-2xl font-extrabold text-white">
                    Analytics <span className="gradient-text">Dashboard</span>
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Track engagement, platform performance, and AI content effectiveness.
                </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
                {/* Live status badge */}
                <LiveBadge isRefreshing={isRefreshing} secondsAgo={secondsAgo} />

                {/* Date range */}
                <div
                    className="flex rounded-xl p-1 gap-0.5"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                    {ranges.map(r => (
                        <button
                            key={r.id}
                            onClick={() => onDateRangeChange(r.value)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                            style={
                                dateRange === r.value
                                    ? { background: 'linear-gradient(135deg,#7C3AED,#9333EA)', color: 'white', boxShadow: '0 2px 8px rgba(124,58,237,0.4)' }
                                    : { color: 'var(--text-muted)' }
                            }
                        >
                            {r.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => {
                        onRefresh?.();
                        toast.success('Data refreshed!', { description: 'Live metrics updated just now.' });
                    }}
                    className="btn-secondary p-2.5"
                    title="Refresh live data"
                    disabled={isRefreshing}
                    style={{ opacity: isRefreshing ? 0.6 : 1 }}
                >
                    <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
                </button>

                <button
                    onClick={() => toast.success('Report exported!', { description: 'analytics-report.csv downloaded.' })}
                    className="btn-primary"
                >
                    <Download size={15} />
                    Export Report
                </button>
            </div>
        </div>
    );
}