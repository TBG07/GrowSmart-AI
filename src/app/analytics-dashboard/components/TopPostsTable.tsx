'use client';

import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LivePost } from '@/lib/realtime/types';

interface Props {
    posts: LivePost[];
    isRefreshing?: boolean;
}

const platformBadge: Record<string, { bg: string; color: string; label: string }> = {
    instagram: { bg: 'rgba(236,72,153,0.15)', color: '#F472B6', label: 'IG' },
    linkedin:  { bg: 'rgba(59,130,246,0.15)', color: '#60A5FA', label: 'LI' },
    twitter:   { bg: 'rgba(14,165,233,0.15)', color: '#38BDF8', label: 'X'  },
    tiktok:    { bg: 'rgba(217,70,239,0.15)', color: '#E879F9', label: 'TK' },
};

type SortKey = 'engagementRate' | 'reach' | 'likes' | 'comments' | 'shares';

export default function TopPostsTable({ posts, isRefreshing = false }: Props) {
    const [sortKey, setSortKey] = useState<SortKey>('engagementRate');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDir('desc');
        }
    };

    const sorted = [...posts].sort((a, b) => {
        const diff = a[sortKey] - b[sortKey];
        return sortDir === 'asc' ? diff : -diff;
    });

    function SortIcon({ col }: { col: SortKey }) {
        if (sortKey !== col) return <ArrowUpDown size={11} style={{ color: 'var(--text-muted)' }} />;
        return sortDir === 'asc'
            ? <ArrowUp size={11} style={{ color: '#A78BFA' }} />
            : <ArrowDown size={11} style={{ color: '#A78BFA' }} />;
    }

    const headerCell = (label: string, col?: SortKey) => (
        <th
            className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider select-none"
            style={{ color: 'var(--text-muted)', cursor: col ? 'pointer' : 'default' }}
            onClick={() => col && handleSort(col)}
        >
            <span className="flex items-center gap-1">
                {label} {col && <SortIcon col={col} />}
            </span>
        </th>
    );

    function RankChange({ change }: { change: number }) {
        if (change > 0) return <TrendingUp size={10} style={{ color: '#10B981' }} />;
        if (change < 0) return <TrendingDown size={10} style={{ color: '#EF4444' }} />;
        return <Minus size={10} style={{ color: 'var(--text-muted)' }} />;
    }

    return (
        <div className="glass-card overflow-hidden">
            <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
                <div>
                    <p className="font-display font-semibold text-white">Top Performing Posts</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Sorted by engagement rate · Updates live every 30s
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {isRefreshing && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full animate-pulse" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                            Refreshing…
                        </span>
                    )}
                    <span
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{ background: 'rgba(124,58,237,0.15)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.25)' }}
                    >
                        {posts.length} posts
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider w-10" style={{ color: 'var(--text-muted)' }}>#</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Rank</th>
                            {headerCell('Platform')}
                            {headerCell('Caption Preview')}
                            {headerCell('Type')}
                            {headerCell('Date')}
                            {headerCell('Reach', 'reach')}
                            {headerCell('Eng. Rate', 'engagementRate')}
                            {headerCell('Likes', 'likes')}
                            {headerCell('Top Hashtag')}
                            {headerCell('AI')}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((post, idx) => {
                            const pb = platformBadge[post.platform] ?? platformBadge['instagram'];
                            return (
                                <tr
                                    key={post.id}
                                    className="transition-all duration-300"
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
                                >
                                    <td className="px-4 py-3.5 text-xs font-mono-data" style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                                    <td className="px-4 py-3.5">
                                        <RankChange change={post.rankChange} />
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span
                                            className="badge text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide"
                                            style={{ background: pb.bg, color: pb.color }}
                                        >
                                            {pb.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 max-w-xs">
                                        <p className="text-xs font-medium text-white truncate" title={post.caption}>
                                            {post.caption.slice(0, 52)}…
                                        </p>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span
                                            className="text-xs px-2 py-0.5 rounded-md font-medium"
                                            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
                                        >
                                            {post.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{post.publishedDate}</td>
                                    <td className="px-4 py-3.5 text-right">
                                        <span className="text-xs font-mono-data font-semibold text-white tabular-nums">
                                            {post.reach.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <span
                                            className="text-xs font-mono-data font-bold tabular-nums"
                                            style={{
                                                color: post.engagementRate >= 7 ? '#D946EF' :
                                                    post.engagementRate >= 5 ? '#10B981' :
                                                        post.engagementRate >= 4 ? '#A78BFA' : '#F59E0B',
                                            }}
                                        >
                                            {post.engagementRate.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <span className="text-xs font-mono-data tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                                            {post.likes.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span
                                            className="text-xs font-medium px-2 py-0.5 rounded-md"
                                            style={{ background: 'rgba(124,58,237,0.12)', color: '#A78BFA' }}
                                        >
                                            #{post.topHashtag}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        {post.aiGenerated ? (
                                            <span
                                                className="inline-flex items-center justify-center w-6 h-5 rounded text-[9px] font-black"
                                                style={{ background: 'rgba(124,58,237,0.2)', color: '#A78BFA' }}
                                                title="AI Generated"
                                            >
                                                AI
                                            </span>
                                        ) : (
                                            <span
                                                className="inline-flex items-center justify-center w-6 h-5 rounded text-[9px] font-bold"
                                                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
                                            >
                                                —
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
            >
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Showing {posts.length} posts ·{' '}
                    <span style={{ color: '#A78BFA', fontWeight: 600 }}>
                        {posts.filter(p => p.aiGenerated).length} AI-generated
                    </span>
                </p>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {[
                        { color: '#D946EF', label: '≥7% elite' },
                        { color: '#10B981', label: '5–7% great' },
                        { color: '#A78BFA', label: '4–5% good' },
                        { color: '#F59E0B', label: '<4% needs work' },
                    ].map(item => (
                        <span key={item.label} className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                            {item.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}