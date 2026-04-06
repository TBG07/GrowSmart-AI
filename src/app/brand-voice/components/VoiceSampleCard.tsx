'use client';

import React from 'react';
import { Sparkles, Hash, TrendingUp } from 'lucide-react';

interface VoiceSampleCardProps {
    brandName: string;
    industry: string;
    keywords: string[];
    formality: number;
    energy: number;
}

const samplePosts = [
    `🚀 The future of {industry} isn't just about working harder — it's about working smarter.

At {brand}, we believe every creator deserves AI-powered tools that amplify their voice and multiply their impact.

Here's what we've learned building with 1,000+ creators:

✅ Consistency beats perfection — every time
✅ AI removes the blank page problem forever
✅ Your authentic story is your biggest asset
✅ Data-driven content outperforms guesswork by 3x

The game is changing. Are you ready?

👇 Tell me — what's your biggest content challenge right now?`,
    `Real talk: Content creation shouldn't feel like a second job.

If you're spending hours writing posts that get 12 likes... something's broken.

{brand} changed that for us. Here's the before/after:

BEFORE: 4 hours to write 3 posts
AFTER: 10 minutes, 4 platforms, way better results

The secret? AI that learns YOUR voice, not some generic template.

Drop "DEMO" below and I'll show you how it works 🔥`,
];

export default function VoiceSampleCard({ brandName, industry, keywords, formality, energy }: VoiceSampleCardProps) {
    const postIndex = energy > 60 ? 1 : 0;
    const rawPost = samplePosts[postIndex]
        .replace(/\{brand\}/g, brandName || 'Your Brand')
        .replace(/\{industry\}/g, industry || 'your industry');

    const platformLabel = formality > 55 ? 'LinkedIn' : energy > 65 ? 'Instagram' : 'Twitter / X';
    const platformGrad =
        formality > 55
            ? 'linear-gradient(135deg,#3B82F6,#2563EB)'
            : energy > 65
                ? 'linear-gradient(135deg,#EC4899,#F97316)'
                : 'linear-gradient(135deg,#38BDF8,#0EA5E9)';

    return (
        <div
            className="rounded-2xl overflow-hidden animate-slide-up"
            style={{ border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(17,24,39,0.9)' }}
        >
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: platformGrad }}>
                <span className="text-white text-sm font-semibold">{platformLabel}</span>
                <div className="flex items-center gap-1.5 text-white text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <Sparkles size={10} />
                    Brand Voice Active
                </div>
            </div>
            <div className="p-4 space-y-3">
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>
                    {rawPost}
                </p>

                {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {keywords.map(kw => (
                            <span
                                key={kw}
                                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg font-medium"
                                style={{ background: 'rgba(124,58,237,0.15)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.25)' }}
                            >
                                <Hash size={9} /> {kw}
                            </span>
                        ))}
                    </div>
                )}

                <div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}
                >
                    <TrendingUp size={12} style={{ color: '#10B981' }} />
                    <span className="text-xs font-medium text-white">Predicted: 4.5–7.2% engagement</span>
                    <span className="ml-auto text-[10px]" style={{ color: 'var(--text-muted)' }}>Best: Tue–Thu</span>
                </div>
            </div>
        </div>
    );
}
