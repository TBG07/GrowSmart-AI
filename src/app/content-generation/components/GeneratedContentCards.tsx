'use client';

import React, { useState } from 'react';
import {
    Copy, CalendarPlus, Edit3, CheckCircle, Zap, Hash, TrendingUp,
    AlertCircle, Download, BarChart3, Flame, Target, Clock,
    ChevronDown, ChevronUp, FileText, Video, MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { RichGeneratedContent, ContentVariant } from './types';
import FeedbackRatingWidget from './FeedbackRatingWidget';

interface Props {
    content: RichGeneratedContent[];
    isGenerating: boolean;
    hasGenerated: boolean;
}

const platformConfig: Record<string, {
    label: string; gradient: string; glowColor: string; borderColor: string; charLimit: number;
}> = {
    instagram: { label: 'Instagram',  gradient: 'linear-gradient(135deg,#EC4899,#F97316)', glowColor: 'rgba(236,72,153,0.3)',  borderColor: 'rgba(236,72,153,0.25)',  charLimit: 2200 },
    linkedin:  { label: 'LinkedIn',   gradient: 'linear-gradient(135deg,#3B82F6,#2563EB)', glowColor: 'rgba(59,130,246,0.3)',   borderColor: 'rgba(59,130,246,0.25)',   charLimit: 3000 },
    twitter:   { label: 'Twitter / X',gradient: 'linear-gradient(135deg,#38BDF8,#0EA5E9)', glowColor: 'rgba(56,189,248,0.3)',   borderColor: 'rgba(56,189,248,0.25)',   charLimit: 280  },
    tiktok:    { label: 'TikTok',     gradient: 'linear-gradient(135deg,#D946EF,#9333EA)', glowColor: 'rgba(217,70,239,0.3)',   borderColor: 'rgba(217,70,239,0.25)',   charLimit: 2200 },
};

// ─── Virality Bar ─────────────────────────────────────────────────────────────

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] w-14 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${value}%`, background: color }}
                />
            </div>
            <span className="text-[10px] font-bold w-7 text-right" style={{ color }}>{value}</span>
        </div>
    );
}

function ViralityPanel({ v }: { v: RichGeneratedContent['variants'][0]['viralityBreakdown'] }) {
    const bars = [
        { label: 'Hook',    value: v.hook,    color: '#A78BFA' },
        { label: 'Emotion', value: v.emotion, color: '#F472B6' },
        { label: 'Clarity', value: v.clarity, color: '#34D399' },
        { label: 'CTA',     value: v.cta,     color: '#FBBF24' },
        { label: 'Timing',  value: v.timing,  color: '#60A5FA' },
    ];

    const scoreColor = v.overall >= 88 ? '#10B981' : v.overall >= 76 ? '#F59E0B' : '#EF4444';

    return (
        <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                    <BarChart3 size={11} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-[10px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Virality Score</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-base font-extrabold" style={{ color: scoreColor }}>{v.overall}</span>
                    <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>/100</span>
                </div>
            </div>
            {bars.map(b => <ScoreBar key={b.label} {...b} />)}
        </div>
    );
}

// ─── Hook Analyzer ────────────────────────────────────────────────────────────

function HookBadge({ analysis }: { analysis: RichGeneratedContent['variants'][0]['hookAnalysis'] }) {
    const strengthColor = analysis.strengthScore >= 88 ? '#10B981' : analysis.strengthScore >= 76 ? '#F59E0B' : '#EF4444';
    return (
        <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)' }}>
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold" style={{ color: '#A78BFA' }}>{analysis.label}</span>
                <span className="text-[10px] font-bold" style={{ color: strengthColor }}>Strength: {analysis.strengthScore}</span>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{analysis.description}</p>
        </div>
    );
}

// ─── Thread View ──────────────────────────────────────────────────────────────

function ThreadView({ parts }: { parts: NonNullable<RichGeneratedContent['thread']> }) {
    return (
        <div className="space-y-2">
            {parts.map(p => (
                <div key={p.index} className="flex gap-2.5">
                    <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
                            style={{ background: 'linear-gradient(135deg,#38BDF8,#0EA5E9)' }}>
                            {p.index}
                        </div>
                        {p.index < parts.length && <div className="w-px flex-1 mt-1" style={{ background: 'rgba(56,189,248,0.2)' }} />}
                    </div>
                    <div className="pb-3 flex-1">
                        <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>{p.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Video Script View ────────────────────────────────────────────────────────

function VideoScriptView({ script }: { script: NonNullable<RichGeneratedContent['videoScript']> }) {
    const sections = [
        { label: '🎣 Hook (0–5s)', text: script.hook, color: '#F472B6' },
        { label: '📖 Body (5–25s)', text: script.body, color: '#A78BFA' },
        { label: '📣 CTA (25–30s)', text: script.cta, color: '#34D399' },
        { label: '🏷️ Captions', text: script.captions, color: '#FBBF24' },
    ];
    return (
        <div className="space-y-2">
            {sections.map(s => (
                <div key={s.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}30` }}>
                    <p className="text-[10px] font-bold mb-1.5" style={{ color: s.color }}>{s.label}</p>
                    <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>{s.text}</p>
                </div>
            ))}
        </div>
    );
}

// ─── Content Card ─────────────────────────────────────────────────────────────

function ContentCard({ item }: { item: RichGeneratedContent }) {
    const [copied, setCopied] = useState(false);
    const [editing, setEditing] = useState(false);
    const [activeVariant, setActiveVariant] = useState<'a' | 'b'>('a');
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [viewMode, setViewMode] = useState<'caption' | 'thread' | 'script'>('caption');
    const [editedCaption, setEditedCaption] = useState('');

    const config = platformConfig[item.platform] ?? platformConfig['instagram'];
    const variant: ContentVariant | undefined = item.variants?.find(v => v.id === activeVariant) ?? item.variants?.[0];

    const isCurrentlyStreaming = !!item.isStreaming;
    const displayText = isCurrentlyStreaming
        ? (item.streamedCaption ?? '')
        : (editing ? editedCaption : (variant?.caption ?? item.caption));

    const charCount = displayText.length;
    const charPercent = Math.min((charCount / config.charLimit) * 100, 100);
    const isOverLimit = charCount > config.charLimit;

    React.useEffect(() => {
        if (!isCurrentlyStreaming && variant) {
            setEditedCaption(variant.caption);
        }
    }, [isCurrentlyStreaming, variant]);

    const handleCopy = () => {
        const text = `${displayText}\n\n${item.hashtags.map(h => `#${h.tag}`).join(' ')}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExport = () => {
        const text = `[${config.label}]\n\n${displayText}\n\n${item.hashtags.map(h => `#${h.tag}`).join(' ')}\n\nCTA: ${item.cta}\nBest Post Time: ${item.bestPostTime}`;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${item.platform}-post.txt`; a.click();
        URL.revokeObjectURL(url);
        toast.success(`Exported ${config.label} post!`);
    };

    const handleSchedule = () => toast.success(`Scheduled to ${config.label}!`, { description: 'Added to your content calendar.' });
    const handleRate = (rating: number, tags: string[]) => console.log(`${item.platform} rated ${rating}`, tags);

    const viralityData = variant?.viralityBreakdown;
    const scoreColor = (viralityData?.overall ?? 0) >= 88 ? '#10B981' : (viralityData?.overall ?? 0) >= 76 ? '#F59E0B' : '#EF4444';
    const sentimentColors: Record<string, string> = { positive: '#10B981', bold: '#EF4444', inspiring: '#F59E0B', neutral: '#94A3B8' };

    const hasThread = item.thread && item.thread.length > 0;
    const hasScript = !!item.videoScript;

    return (
        <div
            className="rounded-2xl overflow-hidden animate-slide-up flex flex-col"
            style={{ border: `1px solid ${config.borderColor}`, background: 'rgba(17,24,39,0.85)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', transition: 'box-shadow 0.2s ease, transform 0.2s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px ${config.borderColor}`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
            {/* Platform Header */}
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: config.gradient }}>
                <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{config.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>{item.contentType}</span>
                    {item.sentiment && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold capitalize" style={{ background: 'rgba(0,0,0,0.2)', color: 'white' }}>
                            {item.sentiment}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* Virality quick score */}
                    {viralityData && !isCurrentlyStreaming && (
                        <div className="flex items-center gap-1 text-white text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(0,0,0,0.25)' }}>
                            <Flame size={10} />
                            <span style={{ color: scoreColor }}>{viralityData.overall}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1 text-white text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(255,255,255,0.2)' }}>
                        <Zap size={10} />
                        {item.aiScore}% AI
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-3.5 flex-1">

                {/* A/B Variant Tabs (only when not streaming) */}
                {item.variants && item.variants.length > 1 && !isCurrentlyStreaming && (
                    <div className="flex gap-1.5">
                        {item.variants.map(v => (
                            <button
                                key={v.id}
                                onClick={() => setActiveVariant(v.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150"
                                style={activeVariant === v.id
                                    ? { background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.45)', color: '#A78BFA' }
                                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}
                            >
                                {v.label}
                                {v.viralityBreakdown && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{
                                        background: activeVariant === v.id ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)',
                                        color: activeVariant === v.id ? '#C4B5FD' : 'var(--text-muted)',
                                    }}>
                                        {v.viralityBreakdown.overall}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* View Mode Tabs for thread/script platforms */}
                {(hasThread || hasScript) && !isCurrentlyStreaming && (
                    <div className="flex gap-1">
                        {[
                            { mode: 'caption' as const, icon: <MessageSquare size={10} />, label: 'Post' },
                            ...(hasThread ? [{ mode: 'thread' as const, icon: <FileText size={10} />, label: 'Thread' }] : []),
                            ...(hasScript ? [{ mode: 'script' as const, icon: <Video size={10} />, label: 'Script' }] : []),
                        ].map(({ mode, icon, label }) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all duration-150"
                                style={viewMode === mode
                                    ? { background: 'rgba(255,255,255,0.1)', color: 'white' }
                                    : { color: 'var(--text-muted)' }}
                            >
                                {icon}{label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Caption / Thread / Script View */}
                {viewMode === 'caption' && (
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <p className="section-label">Caption</p>
                            <button
                                onClick={() => !isCurrentlyStreaming && setEditing(p => !p)}
                                className="flex items-center gap-1 text-[11px] font-medium transition-colors"
                                style={{ color: editing ? '#A78BFA' : isCurrentlyStreaming ? 'rgba(255,255,255,0.2)' : 'var(--text-muted)', cursor: isCurrentlyStreaming ? 'not-allowed' : 'pointer' }}
                            >
                                <Edit3 size={11} />{editing ? 'Done' : 'Edit'}
                            </button>
                        </div>
                        {editing && !isCurrentlyStreaming ? (
                            <textarea value={editedCaption} onChange={e => setEditedCaption(e.target.value)} rows={6} className="input-field resize-none text-sm" />
                        ) : (
                            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-primary)', minHeight: '4rem' }}>
                                {displayText}
                                {isCurrentlyStreaming && (
                                    <span className="inline-block w-0.5 h-3.5 ml-0.5 animate-pulse rounded-sm" style={{ background: '#A78BFA', verticalAlign: 'text-bottom' }} />
                                )}
                            </p>
                        )}
                        {/* Char counter */}
                        <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${charPercent}%`, background: isOverLimit ? '#EF4444' : charPercent > 80 ? '#F59E0B' : '#10B981' }} />
                            </div>
                            <span className="text-[10px] font-mono font-medium" style={{ color: isOverLimit ? '#EF4444' : 'var(--text-muted)' }}>
                                {charCount}/{config.charLimit}
                            </span>
                        </div>
                    </div>
                )}

                {viewMode === 'thread' && hasThread && <ThreadView parts={item.thread!} />}
                {viewMode === 'script' && hasScript && <VideoScriptView script={item.videoScript!} />}

                {/* CTA */}
                {item.cta && viewMode === 'caption' && (
                    <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
                        <p className="section-label mb-0.5">Call to Action</p>
                        <p className="text-sm font-medium" style={{ color: '#C4B5FD' }}>{item.cta}</p>
                    </div>
                )}

                {/* Stats row */}
                {!isCurrentlyStreaming && item.estimatedReach && (
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { icon: <TrendingUp size={11} />, label: 'Engagement', value: item.predictedEngagement, color: '#10B981' },
                            { icon: <Target size={11} />, label: 'Est. Reach', value: item.estimatedReach, color: '#A78BFA' },
                            { icon: <Clock size={11} />, label: 'Best Time', value: item.bestPostTime.split(',')[0], color: '#FBBF24' },
                        ].map(s => (
                            <div key={s.label} className="rounded-xl px-2.5 py-2 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="flex items-center justify-center gap-1 mb-0.5" style={{ color: s.color }}>{s.icon}
                                    <span className="text-[9px] font-semibold">{s.label}</span>
                                </div>
                                <p className="text-[10px] font-bold text-white">{s.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Hashtags */}
                {viewMode === 'caption' && (
                    <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <Hash size={11} style={{ color: 'var(--text-muted)' }} />
                            <p className="section-label">Hashtags</p>
                            <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>Relevance</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {item.hashtags.map(h => (
                                <span
                                    key={`ht-${item.platform}-${h.tag}`}
                                    className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg cursor-pointer font-medium transition-all duration-150"
                                    title={`Est. reach: ${h.reach}`}
                                    style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.07)' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.15)'; (e.currentTarget as HTMLElement).style.color = '#A78BFA'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
                                >
                                    #{h.tag}
                                    <span className="text-[9px] font-bold px-1 py-0.5 rounded" style={{
                                        background: h.score >= 80 ? 'rgba(16,185,129,0.2)' : h.score >= 60 ? 'rgba(245,158,11,0.2)' : 'rgba(100,116,139,0.2)',
                                        color: h.score >= 80 ? '#10B981' : h.score >= 60 ? '#F59E0B' : '#94A3B8',
                                    }}>{h.score}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Analytics Expandable Panel */}
                {!isCurrentlyStreaming && viralityData && (
                    <div>
                        <button
                            onClick={() => setShowAnalytics(p => !p)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-semibold transition-all duration-150"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-secondary)' }}
                        >
                            <div className="flex items-center gap-1.5">
                                <BarChart3 size={12} />
                                AI Analytics & Hook Analysis
                            </div>
                            {showAnalytics ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                        {showAnalytics && (
                            <div className="mt-2 space-y-2.5">
                                <ViralityPanel v={viralityData} />
                                {variant?.hookAnalysis && <HookBadge analysis={variant.hookAnalysis} />}
                                {item.readabilityScore && (
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Readability</span>
                                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                                            <div className="h-full rounded-full" style={{ width: `${item.readabilityScore}%`, background: '#34D399' }} />
                                        </div>
                                        <span className="text-[10px] font-bold" style={{ color: '#34D399' }}>{item.readabilityScore}</span>
                                        <span className="text-[10px] ml-1" style={{ color: 'var(--text-muted)' }}>{item.wordCount} words</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Feedback */}
                {!isCurrentlyStreaming && <FeedbackRatingWidget platform={config.label} onRate={handleRate} />}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                    <button
                        onClick={handleCopy}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95"
                        style={copied
                            ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }
                            : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}
                    >
                        {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}
                        title="Export as .txt"
                    >
                        <Download size={13} />
                    </button>
                    <button
                        onClick={handleSchedule}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-150 active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)', boxShadow: '0 4px 12px rgba(124,58,237,0.35)' }}
                    >
                        <CalendarPlus size={13} />
                        Schedule
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function GeneratingSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden animate-pulse" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(17,24,39,0.8)' }}>
            <div className="h-12 skeleton rounded-none" />
            <div className="p-4 space-y-3">
                <div className="skeleton h-4 w-3/4 rounded-lg" />
                <div className="skeleton h-4 w-full rounded-lg" />
                <div className="skeleton h-4 w-5/6 rounded-lg" />
                <div className="skeleton h-4 w-2/3 rounded-lg" />
                <div className="flex gap-2 mt-4">
                    <div className="skeleton h-6 w-16 rounded-full" />
                    <div className="skeleton h-6 w-20 rounded-full" />
                    <div className="skeleton h-6 w-14 rounded-full" />
                </div>
                <div className="skeleton h-10 w-full rounded-xl" />
            </div>
        </div>
    );
}

// ─── Thinking Steps ───────────────────────────────────────────────────────────

const THINKING_STEPS = [
    'Analysing niche & audience signals…',
    'Selecting optimal hook strategy…',
    'Crafting platform-native content…',
    'Scoring virality & engagement potential…',
    'Optimising hashtag mix…',
    'Finalising A/B variants…',
];

function ThinkingBanner({ step }: { step: number }) {
    return (
        <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div className="w-4 h-4 border-2 rounded-full animate-spin flex-shrink-0" style={{ borderColor: 'rgba(124,58,237,0.3)', borderTopColor: '#A78BFA' }} />
            <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: '#A78BFA' }}>
                    {THINKING_STEPS[step % THINKING_STEPS.length]}
                </p>
                <div className="flex gap-0.5 mt-1.5">
                    {THINKING_STEPS.map((_, i) => (
                        <div key={i} className="h-0.5 flex-1 rounded-full transition-all duration-500" style={{ background: i <= step ? '#7C3AED' : 'rgba(255,255,255,0.08)' }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function GeneratedContentCards({ content, isGenerating, hasGenerated }: Props) {
    const [thinkingStep, setThinkingStep] = React.useState(0);

    React.useEffect(() => {
        if (!isGenerating) { setThinkingStep(0); return; }
        const id = setInterval(() => setThinkingStep(p => p + 1), 560);
        return () => clearInterval(id);
    }, [isGenerating]);

    const handleExportAll = () => {
        const allText = content.map(c => {
            const cfg = platformConfig[c.platform];
            return `[${cfg?.label ?? c.platform}]\n\n${c.caption}\n\n${c.hashtags.map(h => `#${h.tag}`).join(' ')}\n\nCTA: ${c.cta}\nBest Post Time: ${c.bestPostTime}`;
        }).join('\n\n' + '─'.repeat(40) + '\n\n');
        const blob = new Blob([allText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'growsmart-content.txt'; a.click();
        URL.revokeObjectURL(url);
        toast.success('All content exported!');
    };

    if (isGenerating) {
        return (
            <div className="space-y-4">
                <ThinkingBanner step={thinkingStep} />
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <GeneratingSkeleton key={`skel-${i}`} />)}
                </div>
            </div>
        );
    }

    if (!hasGenerated) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 animate-float" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                    <Zap size={32} style={{ color: '#A78BFA' }} />
                </div>
                <h3 className="font-display font-bold text-white text-xl mb-2">Ready to generate</h3>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                    Fill in your topic and platforms on the left, then click{' '}
                    <span className="gradient-text font-semibold">Generate Content</span> to see AI-crafted posts with virality scoring & A/B variants.
                </p>
            </div>
        );
    }

    if (content.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <AlertCircle size={32} className="mb-3" style={{ color: '#F59E0B' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No content generated. Select at least one platform.</p>
            </div>
        );
    }

    const anyStreaming = content.some(c => c.isStreaming);
    const doneCount = content.filter(c => !c.isStreaming && (c.streamedCaption !== undefined)).length;
    const totalCount = content.length;

    return (
        <div className="space-y-4">
            {anyStreaming && (
                <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    <div className="w-3.5 h-3.5 border-2 rounded-full animate-spin flex-shrink-0" style={{ borderColor: 'rgba(167,139,250,0.3)', borderTopColor: '#A78BFA' }} />
                    <p className="text-xs font-medium" style={{ color: '#A78BFA' }}>
                        Writing post {Math.min(doneCount + 1, totalCount)} of {totalCount}…
                    </p>
                    <div className="flex-1 h-1 rounded-full overflow-hidden ml-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(doneCount / totalCount) * 100}%`, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)' }} />
                    </div>
                </div>
            )}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-white">
                        {content.length} post{content.length > 1 ? 's' : ''} generated
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        Each card has 2 A/B variants — pick the best performer
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            const allText = content.map(c => `${platformConfig[c.platform]?.label ?? c.platform}\n${c.caption}\n${c.hashtags.map(h => `#${h.tag}`).join(' ')}`).join('\n\n---\n\n');
                            navigator.clipboard.writeText(allText);
                            toast.success('All content copied!');
                        }}
                        className="btn-secondary text-xs py-1.5"
                    >
                        <Copy size={12} /> Copy All
                    </button>
                    <button onClick={handleExportAll} className="btn-secondary text-xs py-1.5">
                        <Download size={12} /> Export .txt
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                {content.map(item => (
                    <ContentCard key={`content-${item.platform}-${item.aiScore}`} item={item} />
                ))}
            </div>
        </div>
    );
}