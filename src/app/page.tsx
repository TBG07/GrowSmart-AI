'use client';

import React from 'react';
import AppLayout from '@/components/AppLayout';
import HomeKPIGrid from './components/HomeKPIGrid';
import QuickActionsPanel from './components/QuickActionsPanel';
import TrendingTopicsWidget from './components/TrendingTopicsWidget';
import RecentActivityFeed from './components/RecentActivityFeed';

export default function HomePage() {
    return (
        <AppLayout>
            <div className="space-y-8">
                {/* Hero greeting */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">👋</span>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                            Welcome back — April 2, 2026
                        </p>
                    </div>
                    <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                        Your AI Content{' '}
                        <span className="gradient-text">Command Center</span>
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)', maxWidth: '520px' }}>
                        GrowSmart AI is crafting platform-optimized content, learning from your engagement, and growing your reach — automatically.
                    </p>
                </div>

                {/* KPI Cards */}
                <HomeKPIGrid />

                {/* Quick Actions + Trending */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <QuickActionsPanel />
                    </div>
                    <div className="lg:col-span-1">
                        <TrendingTopicsWidget />
                    </div>
                </div>

                {/* Recent Activity */}
                <RecentActivityFeed />
            </div>
        </AppLayout>
    );
}
