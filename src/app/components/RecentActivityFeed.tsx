'use client';

import React from 'react';
import { Sparkles, CalendarCheck, BarChart3, Star, Clock } from 'lucide-react';

interface ActivityItem {
    id: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    iconBg: string;
    iconColor: string;
    title: string;
    desc: string;
    time: string;
    platform?: string;
    platformColor?: string;
}

const activities: ActivityItem[] = [
    {
        id: 'act-1',
        icon: Sparkles,
        iconBg: 'rgba(124,58,237,0.2)',
        iconColor: '#A78BFA',
        title: 'AI generated 3 posts',
        desc: 'Topic: "5 ways our CRM saves 3h/day" — Instagram, LinkedIn, Twitter/X',
        time: '2 mins ago',
        platform: 'Instagram',
        platformColor: '#F472B6',
    },
    {
        id: 'act-2',
        icon: CalendarCheck,
        iconBg: 'rgba(6,182,212,0.2)',
        iconColor: '#67E8F9',
        title: 'Post scheduled',
        desc: '"Boost productivity with AI" scheduled for Apr 3, 9:00 AM on LinkedIn',
        time: '14 mins ago',
        platform: 'LinkedIn',
        platformColor: '#60A5FA',
    },
    {
        id: 'act-3',
        icon: BarChart3,
        iconBg: 'rgba(16,185,129,0.2)',
        iconColor: '#6EE7B7',
        title: 'Analytics insight detected',
        desc: 'Carousel posts outperforming static by 42% — 3 action items ready',
        time: '1 hr ago',
    },
    {
        id: 'act-4',
        icon: Star,
        iconBg: 'rgba(245,158,11,0.2)',
        iconColor: '#FCD34D',
        title: 'Post feedback received',
        desc: 'You rated "Sales automation tips" 4 stars — AI will optimize future content',
        time: '3 hrs ago',
        platform: 'Twitter/X',
        platformColor: '#94A3B8',
    },
    {
        id: 'act-5',
        icon: Sparkles,
        iconBg: 'rgba(124,58,237,0.2)',
        iconColor: '#A78BFA',
        title: 'Brand voice profile updated',
        desc: 'Tone adjusted to "Bold + Professional" · 5 keywords saved',
        time: '5 hrs ago',
    },
];

export default function RecentActivityFeed() {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-white text-lg">Recent Activity</h2>
                <button className="btn-secondary py-1.5 text-xs">
                    <Clock size={12} /> View all
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    {activities.map((act, i) => {
                        const Icon = act.icon;
                        return (
                            <div
                                key={act.id}
                                className="flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors duration-150 animate-fade-in"
                                style={{ animationDelay: `${i * 60}ms`, borderColor: 'rgba(255,255,255,0.05)' }}
                            >
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ background: act.iconBg }}
                                >
                                    <Icon size={15} color={act.iconColor} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-semibold text-white">{act.title}</p>
                                        {act.platform && (
                                            <span
                                                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                                                style={{ background: 'rgba(255,255,255,0.06)', color: act.platformColor }}
                                            >
                                                {act.platform}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        {act.desc}
                                    </p>
                                </div>
                                <span className="text-[11px] flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                    {act.time}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
