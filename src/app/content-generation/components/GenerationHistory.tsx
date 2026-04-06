'use client';

import React from 'react';
import { Clock, Repeat2 } from 'lucide-react';
import { historyItems } from './mockData';

const platformColors: Record<string, { bg: string; color: string; label: string }> = {
    instagram: { bg: 'rgba(236,72,153,0.15)', color: '#F472B6', label: 'IG' },
    linkedin:  { bg: 'rgba(59,130,246,0.15)', color: '#60A5FA', label: 'LI' },
    twitter:   { bg: 'rgba(14,165,233,0.15)', color: '#38BDF8', label: 'X' },
    tiktok:    { bg: 'rgba(217,70,239,0.15)', color: '#E879F9', label: 'TK' },
};

export default function GenerationHistory() {
    return (
        <div className="glass-card p-4 sticky top-8">
            <div className="flex items-center gap-2 mb-4">
                <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm font-semibold text-white">Recent Generations</p>
            </div>
            <div className="space-y-1">
                {historyItems?.map(item => (
                    <div
                        key={item?.id}
                        className="group p-3 rounded-xl cursor-pointer transition-all duration-150"
                        style={{ border: '1px solid transparent' }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = '';
                            (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                        }}
                    >
                        <p className="text-xs font-semibold text-white truncate">{item?.topic}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            {item?.platforms?.map(p => {
                                const cfg = platformColors[p] ?? { bg: 'rgba(100,116,139,0.15)', color: '#94A3B8', label: p.slice(0, 2).toUpperCase() };
                                return (
                                    <span
                                        key={`hist-${item?.id}-${p}`}
                                        className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
                                        style={{ background: cfg.bg, color: cfg.color }}
                                    >
                                        {cfg.label}
                                    </span>
                                );
                            })}
                            <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>{item?.timeAgo}</span>
                        </div>
                        <button
                            className="hidden group-hover:flex items-center gap-1 text-[10px] font-medium mt-2"
                            style={{ color: '#A78BFA' }}
                        >
                            <Repeat2 size={10} /> Regenerate
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}