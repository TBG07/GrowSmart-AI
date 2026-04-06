'use client';

import React, { useState } from 'react';
import AnalyticsHeader from './AnalyticsHeader';
import MetricsBentoGrid from './MetricsBentoGrid';
import EngagementTrendChart from './EngagementTrendChart';
import PlatformComparisonChart from './PlatformComparisonChart';
import ContentTypeChart from './ContentTypeChart';
import TopPostsTable from './TopPostsTable';
import AIInsightsPanel from './AIInsightsPanel';
import { useLiveDashboard } from '@/hooks/useLiveDashboard';
import { RefreshCw } from 'lucide-react';

export default function AnalyticsDashboardView() {
    const [dateRange, setDateRange] = useState('14d');
    const { data, isLoading, isRefreshing, secondsAgo, error, refresh } = useLiveDashboard();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div
                    className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
                    style={{ borderTopColor: '#7C3AED', borderRightColor: 'rgba(124,58,237,0.3)' }}
                />
                <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-muted)' }}>
                    Fetching live data…
                </p>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                <p className="text-sm font-semibold" style={{ color: '#EF4444' }}>{error}</p>
                <button onClick={refresh} className="btn-primary text-xs flex items-center gap-2">
                    <RefreshCw size={13} /> Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AnalyticsHeader
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                isRefreshing={isRefreshing}
                secondsAgo={secondsAgo}
                onRefresh={refresh}
            />

            {/* KPI Bento Grid */}
            <MetricsBentoGrid kpis={data?.kpis ?? null} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
                <div className="lg:col-span-2 2xl:col-span-2">
                    <EngagementTrendChart
                        dateRange={dateRange}
                        trendData={data?.engagementTrend ?? []}
                    />
                </div>
                <div className="lg:col-span-1 2xl:col-span-1">
                    <ContentTypeChart contentTypes={data?.contentTypes ?? []} />
                </div>
            </div>

            {/* Platform Comparison + AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5">
                <div className="lg:col-span-2 2xl:col-span-2">
                    <PlatformComparisonChart platforms={data?.platforms ?? []} />
                </div>
                <div className="lg:col-span-1 2xl:col-span-1">
                    <AIInsightsPanel
                        insights={data?.insights ?? []}
                        isRefreshing={isRefreshing}
                        secondsAgo={secondsAgo}
                    />
                </div>
            </div>

            {/* Top Posts Table */}
            <TopPostsTable posts={data?.topPosts ?? []} isRefreshing={isRefreshing} />
        </div>
    );
}