'use client';

import React, { useState } from 'react';
import { Mic2, Save, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import VoiceSampleCard from './VoiceSampleCard'; // Force TS Server refresh

const toneSliders = [
    { id: 'formality', label: 'Formality', left: 'Casual', right: 'Formal', default: 60 },
    { id: 'energy', label: 'Energy Level', left: 'Calm', right: 'High Energy', default: 70 },
    { id: 'playfulness', label: 'Tone Style', left: 'Playful', right: 'Serious', default: 45 },
    { id: 'detail', label: 'Detail Level', left: 'Brief', right: 'Detailed', default: 55 },
];

const industryOptions = [
    'SaaS / Tech', 'E-commerce', 'Consulting', 'Coaching', 'Marketing Agency',
    'Fitness & Wellness', 'Real Estate', 'Finance', 'Education', 'Non-profit',
];

export default function BrandVoiceView() {
    const [brandName, setBrandName] = useState('');
    const [industry, setIndustry] = useState('SaaS / Tech');
    const [mission, setMission] = useState('');
    const [keywords, setKeywords] = useState<string[]>(['']);
    const [sampleContent, setSampleContent] = useState('');
    const [sliders, setSliders] = useState<Record<string, number>>(
        Object.fromEntries(toneSliders.map(s => [s.id, s.default]))
    );
    const [saved, setSaved] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [showSample, setShowSample] = useState(false);

    const handleSliderChange = (id: string, value: number) => {
        setSliders(prev => ({ ...prev, [id]: value }));
    };

    const handleKeywordChange = (i: number, value: string) => {
        setKeywords(prev => {
            const next = [...prev];
            next[i] = value;
            if (i === prev.length - 1 && value && prev.length < 5) next.push('');
            return next;
        });
    };

    const handleSave = () => {
        if (!brandName.trim()) { toast.error('Enter your brand name first.'); return; }
        setSaved(true);
        toast.success('Brand voice saved!', { description: 'AI will use this profile for future content generation.' });
    };

    const handleGenerateSample = async () => {
        setGenerating(true);
        setShowSample(false);
        await new Promise(r => setTimeout(r, 1800));
        setGenerating(false);
        setShowSample(true);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="font-display text-2xl font-extrabold text-white">
                    Brand Voice <span className="gradient-text">Trainer</span>
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Define your brand&apos;s personality so AI generates content that sounds exactly like you.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Profile form */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Basic Info */}
                    <div className="glass-card p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg,#7C3AED,#D946EF)' }}
                            >
                                <Mic2 size={14} className="text-white" />
                            </div>
                            <p className="font-semibold text-white text-sm">Brand Identity</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                    Brand Name <span className="text-rose-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={brandName}
                                    onChange={e => setBrandName(e.target.value)}
                                    placeholder="e.g. GrowSmart AI"
                                    className="input-field text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Industry</label>
                                <select value={industry} onChange={e => setIndustry(e.target.value)} className="input-field text-sm">
                                    {industryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Mission Statement</label>
                            <textarea
                                value={mission}
                                onChange={e => setMission(e.target.value)}
                                rows={2}
                                placeholder="e.g. We help small businesses automate content creation so they can focus on growth."
                                className="input-field resize-none text-sm"
                            />
                        </div>

                        {/* Keywords */}
                        <div>
                            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                                Brand Keywords <span style={{ color: 'var(--text-muted)' }}>(up to 5)</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {keywords.map((kw, i) => (
                                    <input
                                        key={`kw-${i}`}
                                        type="text"
                                        value={kw}
                                        onChange={e => handleKeywordChange(i, e.target.value)}
                                        placeholder={`Keyword ${i + 1}`}
                                        className="input-field text-sm"
                                        style={{ width: '140px' }}
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                                Words that define your voice: e.g. "innovative", "authentic", "data-driven"
                            </p>
                        </div>
                    </div>

                    {/* Tone Sliders */}
                    <div className="glass-card p-6 space-y-5">
                        <p className="font-semibold text-white text-sm">Tone Calibration</p>
                        {toneSliders.map(s => (
                            <div key={s.id} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
                                    <span className="text-[11px] font-mono-data" style={{ color: '#A78BFA' }}>{sliders[s.id]}%</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] w-16 text-right" style={{ color: 'var(--text-muted)' }}>{s.left}</span>
                                    <div className="flex-1 relative h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                        <div
                                            className="absolute inset-y-0 left-0 rounded-full"
                                            style={{ width: `${sliders[s.id]}%`, background: 'linear-gradient(90deg,#7C3AED,#D946EF)' }}
                                        />
                                        <input
                                            type="range"
                                            min={0}
                                            max={100}
                                            value={sliders[s.id]}
                                            onChange={e => handleSliderChange(s.id, Number(e.target.value))}
                                            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                                        />
                                    </div>
                                    <span className="text-[10px] w-16" style={{ color: 'var(--text-muted)' }}>{s.right}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sample Content */}
                    <div className="glass-card p-6 space-y-3">
                        <p className="font-semibold text-white text-sm">Training Sample</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Paste a piece of your existing content so AI can learn your style:
                        </p>
                        <textarea
                            value={sampleContent}
                            onChange={e => setSampleContent(e.target.value)}
                            rows={4}
                            placeholder="Paste a caption, blog excerpt, or email that represents your brand voice..."
                            className="input-field resize-none text-sm"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button onClick={handleSave} className="btn-primary py-2.5 px-6">
                            <Save size={15} />
                            {saved ? 'Profile Saved ✓' : 'Save Brand Voice'}
                        </button>
                        <button onClick={handleGenerateSample} className="btn-secondary py-2.5 px-4" disabled={generating}>
                            {generating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                            {generating ? 'Generating...' : 'Preview Sample Post'}
                        </button>
                    </div>
                </div>

                {/* Right: Preview + Tips */}
                <div className="space-y-4">
                    {/* Sample card */}
                    {showSample && (
                        <VoiceSampleCard
                            brandName={brandName || 'Your Brand'}
                            industry={industry}
                            keywords={keywords.filter(Boolean)}
                            formality={sliders['formality']}
                            energy={sliders['energy']}
                        />
                    )}

                    {!showSample && !generating && (
                        <div
                            className="glass-card p-6 flex flex-col items-center text-center gap-3"
                        >
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center animate-float"
                                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}
                            >
                                <Mic2 size={26} style={{ color: '#A78BFA' }} />
                            </div>
                            <p className="font-semibold text-white text-sm">Preview your voice</p>
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                Fill in your brand details and click "Preview Sample Post" to see AI content in your voice.
                            </p>
                        </div>
                    )}

                    {generating && (
                        <div className="glass-card p-6 flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#7C3AED', borderTopColor: 'transparent' }} />
                            <p className="text-sm font-medium" style={{ color: '#A78BFA' }}>Training on your style...</p>
                        </div>
                    )}

                    {/* Tips */}
                    <div className="glass-card p-5 space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>💡 Pro Tips</p>
                        {[
                            'Use 3–5 specific keywords that define your niche',
                            'Paste real examples from your best-performing posts',
                            'Adjust formality to match your audience expectations',
                            'High energy works better for Instagram & TikTok',
                            'Formal tone performs better on LinkedIn',
                        ].map((tip, i) => (
                            <div key={i} className="flex gap-2">
                                <span className="text-[11px] font-bold" style={{ color: '#7C3AED', flexShrink: 0 }}>→</span>
                                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
