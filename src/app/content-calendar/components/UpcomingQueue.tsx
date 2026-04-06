'use client';

import React from 'react';
import { Clock, CheckCircle2, FileEdit, CalendarClock } from 'lucide-react';
import { CalendarPost } from './mockData';

interface Props {
    posts: CalendarPost[];
}

const platformColors: Record<string, string> = {
    instagram: 'from-pink-500 to-orange-400',
    linkedin: 'bg-blue-600',
    twitter: 'bg-sky-500',
};

const platformLabels: Record<string, string> = {
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    twitter: 'Twitter / X',
};

const statusConfig: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; cls: string }> = {
    draft: { icon: FileEdit, label: 'Draft', cls: 'text-slate-500 bg-slate-100' },
    scheduled: { icon: CalendarClock, label: 'Scheduled', cls: 'text-violet-600 bg-violet-100' },
    published: { icon: CheckCircle2, label: 'Published', cls: 'text-emerald-600 bg-emerald-100' },
};

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function UpcomingQueue({ posts }: Props) {
    const sorted = [...posts]
        .filter((p) => p.status !== 'published' || new Date(p.scheduledDate) >= new Date())
        .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
        .slice(0, 10);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock size={15} className="text-violet-500" />
                    <p className="text-sm font-semibold text-slate-800">Upcoming Posts</p>
                </div>
                <span className="text-xs text-slate-400 font-medium">{sorted.length} queued</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto scrollbar-thin">
                {sorted.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                        <CalendarClock size={24} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-400 font-medium">No upcoming posts</p>
                        <p className="text-[11px] text-slate-400 mt-1">Add content to your calendar to see it here.</p>
                    </div>
                ) : (
                    sorted.map((post) => {
                        const StatusIcon = statusConfig[post.status].icon;
                        return (
                            <div key={`queue-${post.id}`} className="px-4 py-3 hover:bg-slate-50 transition-all duration-150 cursor-pointer group">
                                <div className="flex items-start gap-2.5">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${platformColors[post.platform]}`}>
                                        <span className="text-white text-[9px] font-bold uppercase">
                                            {post.platform === 'twitter' ? 'X' : post.platform.slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-slate-700 truncate">{post.caption.slice(0, 45)}…</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-slate-400">{formatDate(post.scheduledDate)}</span>
                                            <span className="text-[10px] text-slate-300">·</span>
                                            <span className="text-[10px] text-slate-400">{formatTime(post.scheduledDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusConfig[post.status].cls}`}>
                                                <StatusIcon size={9} />
                                                {statusConfig[post.status].label}
                                            </span>
                                            <span className="text-[10px] text-slate-400">{platformLabels[post.platform]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Summary footer */}
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
                <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                        { key: 'sum-draft', label: 'Draft', count: posts.filter((p) => p.status === 'draft').length, cls: 'text-slate-600' },
                        { key: 'sum-scheduled', label: 'Scheduled', count: posts.filter((p) => p.status === 'scheduled').length, cls: 'text-violet-600' },
                        { key: 'sum-published', label: 'Published', count: posts.filter((p) => p.status === 'published').length, cls: 'text-emerald-600' },
                    ].map((s) => (
                        <div key={s.key}>
                            <p className={`text-base font-bold font-mono-data ${s.cls}`}>{s.count}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}