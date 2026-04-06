'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Plus, LayoutGrid, Calendar } from 'lucide-react';

interface Props {
    currentDate: Date;
    viewMode: 'month' | 'week';
    selectedPlatforms: string[];
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onViewModeChange: (mode: 'month' | 'week') => void;
    onTogglePlatform: (p: string) => void;
    onAddContent: () => void;
}

const platformChips = [
    { id: 'chip-instagram', value: 'instagram', label: 'IG', dotColor: '#EC4899', activeStyle: { background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.35)', color: '#F472B6' } },
    { id: 'chip-linkedin', value: 'linkedin', label: 'LI', dotColor: '#3B82F6', activeStyle: { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.35)', color: '#60A5FA' } },
    { id: 'chip-twitter', value: 'twitter', label: 'X', dotColor: '#38BDF8', activeStyle: { background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.35)', color: '#38BDF8' } },
    { id: 'chip-tiktok', value: 'tiktok', label: 'TK', dotColor: '#D946EF', activeStyle: { background: 'rgba(217,70,239,0.15)', border: '1px solid rgba(217,70,239,0.35)', color: '#E879F9' } },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarHeader({
    currentDate, viewMode, selectedPlatforms,
    onPrevMonth, onNextMonth, onViewModeChange, onTogglePlatform, onAddContent,
}: Props) {
    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="font-display text-2xl font-extrabold text-white">
                        Content <span className="gradient-text">Calendar</span>
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Plan, schedule, and manage your content across all platforms.
                    </p>
                </div>
                <button onClick={onAddContent} className="btn-primary">
                    <Plus size={16} />
                    Add Content
                </button>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
                {/* Month Nav */}
                <div className="flex items-center gap-3">
                    <button onClick={onPrevMonth} className="btn-secondary p-2">
                        <ChevronLeft size={16} />
                    </button>
                    <h2 className="font-display text-lg font-bold text-white min-w-[160px] text-center">
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button onClick={onNextMonth} className="btn-secondary p-2">
                        <ChevronRight size={16} />
                    </button>
                    <button className="text-xs font-semibold" style={{ color: '#A78BFA' }}>
                        Today
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    {/* Platform filters */}
                    <div className="flex items-center gap-1.5">
                        {platformChips.map(chip => {
                            const active = selectedPlatforms.includes(chip.value);
                            return (
                                <button
                                    key={chip.id}
                                    onClick={() => onTogglePlatform(chip.value)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150"
                                    style={
                                        active
                                            ? chip.activeStyle
                                            : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }
                                    }
                                >
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ background: active ? chip.dotColor : 'rgba(100,116,139,0.5)' }}
                                    />
                                    {chip.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* View toggle */}
                    <div
                        className="flex rounded-xl p-1 gap-0.5"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        <button
                            onClick={() => onViewModeChange('month')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                            style={viewMode === 'month'
                                ? { background: 'rgba(124,58,237,0.25)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.35)' }
                                : { color: 'var(--text-muted)' }}
                        >
                            <LayoutGrid size={13} />
                            Month
                        </button>
                        <button
                            onClick={() => onViewModeChange('week')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                            style={viewMode === 'week'
                                ? { background: 'rgba(124,58,237,0.25)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.35)' }
                                : { color: 'var(--text-muted)' }}
                        >
                            <Calendar size={13} />
                            Week
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}