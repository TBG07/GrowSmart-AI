'use client';

import React, { useState } from 'react';
import { Sparkles, TrendingUp, Hash, AlertTriangle, ChevronRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { AIInsight } from '@/lib/realtime/types';

interface Props {
    insights: AIInsight[];
    isRefreshing?: boolean;
    secondsAgo?: number;
}

const typeConfig: Record<AIInsight['type'], {
    icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
    bg: string; border: string; iconColor: string; badgeBg: string; badgeColor: string;
}> = {
    win: { icon: CheckCircle2, bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', iconColor: '#10B981', badgeBg: 'rgba(16,185,129,0.15)', badgeColor: '#10B981' },
    opportunity: { icon: TrendingUp, bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)', iconColor: '#A78BFA', badgeBg: 'rgba(124,58,237,0.15)', badgeColor: '#A78BFA' },
    warning: { icon: AlertTriangle, bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', iconColor: '#F59E0B', badgeBg: 'rgba(245,158,11,0.15)', badgeColor: '#F59E0B' },
    tip: { icon: Hash, bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)', iconColor: '#06B6D4', badgeBg: 'rgba(6,182,212,0.15)', badgeColor: '#06B6D4' },
};

export default function AIInsightsPanel({ insights, isRefreshing = false, secondsAgo = 0 }: Props) {
    const [expanded, setExpanded] = useState<string | null>(insights[0]?.id ?? null);

    // Update expanded if insights rotate
    React.useEffect(() => {
        if (insights.length > 0 && !insights.find(i => i.id === expanded)) {
            setExpanded(insights[0].id);
        }
    }, [insights, expanded]);

    return (
        <div className="glass-card overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div
                className="px-5 py-4 flex items-center gap-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(124,58,237,0.2)', boxShadow: '0 0 16px rgba(124,58,237,0.3)' }}
                >
                    <Sparkles size={14} style={{ color: '#A78BFA' }} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-white text-sm">AI Insights</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {insights.length} recommendations · refreshes with live data
                    </p>
                </div>
                {isRefreshing && (
                    <RefreshCw size={12} className="animate-spin flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                )}
            </div>

            {/* Insights List */}
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: '460px' }}>
                {insights.map(insight => {
                    const config = typeConfig[insight.type];
                    const Icon = config.icon;
                    const isOpen = expanded === insight.id;

                    return (
                        <div
                            key={insight.id}
                            className="transition-all duration-200"
                            style={{
                                borderBottom: '1px solid rgba(255,255,255,0.04)',
                                background: isOpen ? config.bg : 'transparent',
                                ...(isOpen ? { borderLeft: `2px solid ${config.border}` } : {}),
                            }}
                        >
                            <button
                                onClick={() => setExpanded(isOpen ? null : insight.id)}
                                className="w-full px-4 py-3.5 flex items-start gap-3 text-left transition-colors duration-150"
                                style={!isOpen ? { ':hover': { background: 'rgba(255,255,255,0.03)' } } as React.CSSProperties : undefined}
                                onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'; }}
                                onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = ''; }}
                            >
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{
                                        background: isOpen ? config.bg : 'rgba(255,255,255,0.06)',
                                        border: isOpen ? `1px solid ${config.border}` : '1px solid rgba(255,255,255,0.08)',
                                    }}
                                >
                                    <Icon size={14} style={{ color: isOpen ? config.iconColor : 'var(--text-muted)' }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-white leading-snug">{insight.title}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span
                                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                                            style={{ background: config.badgeBg, color: config.badgeColor }}
                                        >
                                            {insight.type}
                                        </span>
                                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{insight.impact}</span>
                                    </div>
                                </div>
                                <ChevronRight
                                    size={14}
                                    className="flex-shrink-0 mt-1 transition-transform duration-150"
                                    style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                                />
                            </button>

                            {isOpen && (
                                <div className="px-4 pb-4">
                                    <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                                        {insight.body}
                                    </p>
                                    <button
                                        onClick={() => toast.success(`Action taken: ${insight.action}`, { description: 'Redirecting to the relevant section.' })}
                                        className="flex items-center gap-1.5 text-xs font-semibold transition-colors duration-150"
                                        style={{ color: config.iconColor }}
                                    >
                                        <span>{insight.action}</span>
                                        <ChevronRight size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div
                className="px-4 py-3 flex-shrink-0"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
            >
                <p className="text-[10px] text-center" style={{ color: 'var(--text-muted)' }}>
                    {isRefreshing ? 'Refreshing insights…' : `Insights updated ${secondsAgo < 5 ? 'just now' : `${secondsAgo}s ago`}`}
                </p>
            </div>
        </div>
    );
}