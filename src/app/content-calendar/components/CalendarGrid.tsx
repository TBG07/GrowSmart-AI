'use client';

import React from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { CalendarPost } from './mockData';

interface Props {
    currentDate: Date;
    posts: CalendarPost[];
    onDayClick: (date: Date) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const platformDotColors: Record<string, string> = {
    instagram: '#EC4899',
    linkedin: '#3B82F6',
    twitter: '#38BDF8',
    tiktok: '#D946EF',
};

const statusStyle: Record<string, { bg: string; color: string }> = {
    draft: { bg: 'rgba(100,116,139,0.15)', color: '#94A3B8' },
    scheduled: { bg: 'rgba(124,58,237,0.2)', color: '#A78BFA' },
    published: { bg: 'rgba(16,185,129,0.15)', color: '#10B981' },
};

function PostPill({ post }: { post: CalendarPost }) {
    const s = statusStyle[post.status] ?? statusStyle['draft'];
    const dotColor = platformDotColors[post.platform] ?? '#94A3B8';
    return (
        <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold truncate"
            style={{ background: s.bg, color: s.color }}
            title={post.caption}
        >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
            <span className="truncate">{post.caption.slice(0, 22)}…</span>
        </div>
    );
}

export default function CalendarGrid({ currentDate, posts, onDayClick }: Props) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const cells: (number | null)[] = [
        ...Array.from({ length: firstDay }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    const getPostsForDay = (day: number) =>
        posts.filter(p => {
            const d = new Date(p.scheduledDate);
            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
        });

    const isToday = (day: number) =>
        today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

    const isPast = (day: number) => {
        const d = new Date(year, month, day);
        return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    };

    const weeks: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    return (
        <div className="glass-card overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {DAYS.map(d => (
                    <div
                        key={`day-header-${d}`}
                        className="py-3 text-center text-[11px] font-bold uppercase tracking-widest"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
                <div
                    key={`week-${wi}`}
                    className="grid grid-cols-7"
                    style={{ borderBottom: wi === weeks.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}
                >
                    {week.map((day, di) => {
                        if (!day) {
                            return (
                                <div
                                    key={`empty-${wi}-${di}`}
                                    className="min-h-[100px]"
                                    style={{
                                        borderRight: di < 6 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                        background: 'rgba(0,0,0,0.15)',
                                    }}
                                />
                            );
                        }

                        const dayPosts = getPostsForDay(day);
                        const hasGap = dayPosts.length === 0 && !isPast(day);
                        const isCurrentDay = isToday(day);

                        return (
                            <div
                                key={`day-${year}-${month}-${day}`}
                                onClick={() => onDayClick(new Date(year, month, day))}
                                className="min-h-[100px] p-2 cursor-pointer group transition-all duration-150"
                                style={{
                                    borderRight: di < 6 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                    background: isCurrentDay
                                        ? 'rgba(124,58,237,0.12)'
                                        : isPast(day)
                                            ? 'rgba(0,0,0,0.12)'
                                            : undefined,
                                    boxShadow: isCurrentDay ? 'inset 0 0 0 1px rgba(124,58,237,0.3)' : undefined,
                                }}
                                onMouseEnter={e => {
                                    if (!isCurrentDay) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                                }}
                                onMouseLeave={e => {
                                    if (!isCurrentDay) (e.currentTarget as HTMLElement).style.background = isPast(day) ? 'rgba(0,0,0,0.12)' : '';
                                }}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span
                                        className="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full"
                                        style={
                                            isCurrentDay
                                                ? { background: 'linear-gradient(135deg,#7C3AED,#9333EA)', color: 'white', boxShadow: '0 2px 8px rgba(124,58,237,0.5)' }
                                                : isPast(day)
                                                    ? { color: 'var(--text-muted)' }
                                                    : { color: 'var(--text-primary)' }
                                        }
                                    >
                                        {day}
                                    </span>
                                    {hasGap && (
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity" title="No posts scheduled">
                                            <AlertTriangle size={10} style={{ color: '#F59E0B' }} />
                                        </span>
                                    )}
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus size={11} style={{ color: 'var(--text-muted)' }} />
                                    </span>
                                </div>

                                <div className="space-y-0.5">
                                    {dayPosts.slice(0, 3).map(post => (
                                        <PostPill key={`pill-${post.id}`} post={post} />
                                    ))}
                                    {dayPosts.length > 3 && (
                                        <span className="text-[10px] font-medium pl-1" style={{ color: 'var(--text-muted)' }}>
                                            +{dayPosts.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}

            {/* Legend */}
            <div
                className="px-4 py-3 flex items-center gap-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
            >
                {[
                    { key: 'legend-draft', label: 'Draft', color: '#6B7280' },
                    { key: 'legend-scheduled', label: 'Scheduled', color: '#7C3AED' },
                    { key: 'legend-published', label: 'Published', color: '#10B981' },
                ].map(l => (
                    <div key={l.key} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                        <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{l.label}</span>
                    </div>
                ))}
                <div className="ml-auto flex items-center gap-1.5 text-[11px] font-medium" style={{ color: '#F59E0B' }}>
                    <AlertTriangle size={11} />
                    Days without scheduled posts
                </div>
            </div>
        </div>
    );
}