'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Sparkles, Loader2, ChevronDown, ChevronUp, Mic2 } from 'lucide-react';
import { GenerationFormData } from './types';

const InstagramIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
);

const LinkedinIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const TwitterIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 4l16 16M4 20L20 4" />
    </svg>
);

const TikTokIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.17 8.17 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z" />
    </svg>
);

interface GenerationFormProps {
    onGenerate: (data: GenerationFormData) => void;
    isGenerating: boolean;
}

const toneOptions = [
    { id: 'tone-professional', value: 'professional', label: 'Pro', emoji: '💼' },
    { id: 'tone-casual', value: 'casual', label: 'Casual', emoji: '😊' },
    { id: 'tone-bold', value: 'bold', label: 'Bold', emoji: '🔥' },
    { id: 'tone-inspiring', value: 'inspiring', label: 'Inspire', emoji: '✨' },
    { id: 'tone-educational', value: 'educational', label: 'Edu', emoji: '📚' },
    { id: 'tone-witty', value: 'witty', label: 'Witty', emoji: '😄' },
];

const businessTypes = [
    'E-commerce', 'SaaS / Tech', 'Consulting', 'Coaching', 'Restaurant / Food',
    'Fitness / Wellness', 'Real Estate', 'Personal Brand', 'Agency', 'Non-profit',
];

const platformOptions = [
    {
        id: 'platform-instagram', value: 'instagram', label: 'Instagram', Icon: InstagramIcon,
        activeStyle: { background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.4)', color: '#F472B6' },
    },
    {
        id: 'platform-linkedin', value: 'linkedin', label: 'LinkedIn', Icon: LinkedinIcon,
        activeStyle: { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.4)', color: '#60A5FA' },
    },
    {
        id: 'platform-twitter', value: 'twitter', label: 'Twitter / X', Icon: TwitterIcon,
        activeStyle: { background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.4)', color: '#38BDF8' },
    },
    {
        id: 'platform-tiktok', value: 'tiktok', label: 'TikTok', Icon: TikTokIcon,
        activeStyle: { background: 'rgba(217,70,239,0.15)', border: '1px solid rgba(217,70,239,0.4)', color: '#E879F9' },
    },
];

export default function GenerationForm({ onGenerate, isGenerating }: GenerationFormProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram', 'linkedin']);
    const [selectedTone, setSelectedTone] = useState('professional');
    const [useBrandVoice, setUseBrandVoice] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<GenerationFormData>({
        defaultValues: {
            topic: '',
            businessType: 'SaaS / Tech',
            audience: '',
            keywords: '',
            tone: 'professional',
            platforms: ['instagram', 'linkedin'],
        },
    });

    const togglePlatform = (value: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value]
        );
    };

    const onSubmit = (data: GenerationFormData) => {
        onGenerate({ ...data, tone: selectedTone, platforms: selectedPlatforms, useBrandVoice });
    };

    return (
        <div className="glass-card p-5 space-y-5 sticky top-8">
            {/* Header */}
            <div className="flex items-center gap-2.5">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #D946EF)', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}
                >
                    <Sparkles size={16} className="text-white" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">AI Content Generator</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Powered by OpenAI GPT-4o</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Topic */}
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Topic / Content Idea <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                        {...register('topic', { required: 'Topic is required', minLength: { value: 10, message: 'Add more detail (min 10 chars)' } })}
                        rows={3}
                        placeholder="e.g. 5 ways our CRM saves sales teams 3 hours per day..."
                        className="input-field resize-none text-sm"
                    />
                    {errors.topic && (
                        <p className="text-rose-400 text-[11px] mt-1">{errors.topic.message}</p>
                    )}
                </div>

                {/* Business Type */}
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Business Type
                    </label>
                    <select {...register('businessType')} className="input-field text-sm">
                        {businessTypes.map(bt => (
                            <option key={`bt-${bt}`} value={bt}>{bt}</option>
                        ))}
                    </select>
                </div>

                {/* Platforms */}
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Target Platforms <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {platformOptions.map(p => {
                            const selected = selectedPlatforms.includes(p.value);
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => togglePlatform(p.value)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150"
                                    style={selected ? p.activeStyle : {
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    <p.Icon size={14} />
                                    <span className="text-xs">{p.label}</span>
                                    {selected && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'currentColor' }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tone */}
                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Content Tone</label>
                    <div className="grid grid-cols-3 gap-1.5">
                        {toneOptions.map(t => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setSelectedTone(t.value)}
                                className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl text-[11px] font-medium transition-all duration-150"
                                style={
                                    selectedTone === t.value
                                        ? { background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', color: '#A78BFA' }
                                        : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-muted)' }
                                }
                            >
                                <span className="text-base">{t.emoji}</span>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Brand Voice Toggle */}
                <div
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                    style={{ background: useBrandVoice ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.04)', border: '1px solid', borderColor: useBrandVoice ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.07)' }}
                >
                    <div className="flex items-center gap-2">
                        <Mic2 size={14} style={{ color: useBrandVoice ? '#A78BFA' : 'var(--text-muted)' }} />
                        <div>
                            <p className="text-xs font-semibold" style={{ color: useBrandVoice ? '#A78BFA' : 'var(--text-secondary)' }}>Use Brand Voice</p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Apply your saved tone profile</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setUseBrandVoice(p => !p)}
                        className="relative w-10 h-5 rounded-full transition-all duration-200 flex items-center"
                        style={{ background: useBrandVoice ? '#7C3AED' : 'rgba(255,255,255,0.1)' }}
                    >
                        <span
                            className="absolute w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                            style={{ left: useBrandVoice ? '22px' : '2px' }}
                        />
                    </button>
                </div>

                {/* Advanced Toggle */}
                <button
                    type="button"
                    onClick={() => setShowAdvanced(p => !p)}
                    className="flex items-center gap-1.5 text-xs transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                >
                    {showAdvanced ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    Advanced Options
                </button>

                {showAdvanced && (
                    <div className="space-y-3 animate-fade-in">
                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Target Audience</label>
                            <input
                                {...register('audience')}
                                type="text"
                                placeholder="e.g. B2B sales managers, 30-45 age"
                                className="input-field text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Keywords to Include</label>
                            <input
                                {...register('keywords')}
                                type="text"
                                placeholder="e.g. productivity, automation, ROI"
                                className="input-field text-sm"
                            />
                            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Comma-separated keywords</p>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isGenerating}
                    className="btn-primary w-full justify-center py-3"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={16} />
                            <span>Generate Content</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}