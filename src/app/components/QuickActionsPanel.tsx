'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, CalendarDays, BarChart3, ArrowRight } from 'lucide-react';

const actions = [
    {
        id: 'action-generate',
        href: '/content-generation',
        icon: Sparkles,
        title: 'Generate Content',
        desc: 'Create AI-optimized posts for Instagram, LinkedIn, Twitter & TikTok in seconds.',
        gradient: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(217,70,239,0.1) 100%)',
        border: 'rgba(124,58,237,0.3)',
        iconGradient: 'linear-gradient(135deg, #7C3AED, #D946EF)',
        accent: '#A78BFA',
        badge: 'Most Used',
    },
    {
        id: 'action-calendar',
        href: '/content-calendar',
        icon: CalendarDays,
        title: 'Content Calendar',
        desc: 'Plan and schedule your weekly content. Visualize gaps and optimize posting times.',
        gradient: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(124,58,237,0.08) 100%)',
        border: 'rgba(6,182,212,0.25)',
        iconGradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
        accent: '#67E8F9',
        badge: '2 posts due',
    },
    {
        id: 'action-analytics',
        href: '/analytics-dashboard',
        icon: BarChart3,
        title: 'Analytics',
        desc: 'Track engagement, reach, AI acceptance rates, and top-performing posts.',
        gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.08) 100%)',
        border: 'rgba(16,185,129,0.25)',
        iconGradient: 'linear-gradient(135deg, #10B981, #059669)',
        accent: '#6EE7B7',
        badge: 'New insights',
    },
];

export default function QuickActionsPanel() {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-white text-lg">Quick Actions</h2>
                <span className="section-label">Core features</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {actions.map((action, i) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.id}
                            href={action.href}
                            className="group rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 animate-slide-up"
                            style={{
                                background: action.gradient,
                                border: `1px solid ${action.border}`,
                                animationDelay: `${i * 80}ms`,
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: action.iconGradient, boxShadow: `0 4px 16px rgba(0,0,0,0.3)` }}
                                >
                                    <Icon size={18} className="text-white" />
                                </div>
                                <span
                                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                                    style={{ background: 'rgba(255,255,255,0.08)', color: action.accent }}
                                >
                                    {action.badge}
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold text-white text-sm">{action.title}</p>
                                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    {action.desc}
                                </p>
                            </div>
                            <div
                                className="flex items-center gap-1 text-xs font-semibold mt-auto group-hover:gap-2 transition-all duration-150"
                                style={{ color: action.accent }}
                            >
                                Open <ArrowRight size={12} />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
