'use client';

import React, { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import GenerationForm from './GenerationForm';
import GeneratedContentCards from './GeneratedContentCards';
import GenerationHistory from './GenerationHistory';
import { RichGeneratedContent, GenerationFormData } from './types';
import { generateContent } from './contentEngine';

// ms per character for the typewriter effect
const CHAR_SPEED_MS = 14;
// delay between each card starting to stream (ms)
const CARD_STAGGER_MS = 320;
// initial spinner duration before streaming begins (ms)
const THINKING_MS = 1800;

export default function ContentGenerationPanel() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<RichGeneratedContent[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const abortRef = useRef(false);

    const streamCard = useCallback(
        (
            results: RichGeneratedContent[],
            cardIndex: number,
            onDone: () => void
        ) => {
            const card = results[cardIndex];
            const fullText = card.caption;

            // Reveal this card with empty streamedCaption and isStreaming = true
            setGeneratedContent(prev => {
                const next = [...prev];
                next[cardIndex] = { ...card, streamedCaption: '', isStreaming: true };
                return next;
            });

            let charIdx = 0;
            const tick = () => {
                if (abortRef.current) return;
                charIdx++;
                setGeneratedContent(prev => {
                    const next = [...prev];
                    next[cardIndex] = {
                        ...next[cardIndex],
                        streamedCaption: fullText.slice(0, charIdx),
                        isStreaming: charIdx < fullText.length,
                    };
                    return next;
                });
                if (charIdx < fullText.length) {
                    setTimeout(tick, CHAR_SPEED_MS);
                } else {
                    onDone();
                }
            };
            setTimeout(tick, CHAR_SPEED_MS);
        },
        []
    );

    const handleGenerate = async (data: GenerationFormData) => {
        if (data.platforms.length === 0) {
            toast.error('Select at least one platform to generate content for.');
            return;
        }

        abortRef.current = false;
        setIsGenerating(true);
        setGeneratedContent([]);
        setHasGenerated(false);

        // Simulate AI "thinking" phase with spinner
        await new Promise(r => setTimeout(r, THINKING_MS));
        if (abortRef.current) return;

        const results = generateContent(data);

        setIsGenerating(false);
        setHasGenerated(true);

        // Start streaming cards with a stagger delay between each
        const streamNext = (idx: number) => {
            if (idx >= results.length || abortRef.current) return;

            setTimeout(() => {
                streamCard(results, idx, () => streamNext(idx + 1));
                // Add the card placeholder immediately so layout doesn't jump
                setGeneratedContent(prev => {
                    if (prev.length <= idx) {
                        return [...prev, { ...results[idx], streamedCaption: '', isStreaming: true }];
                    }
                    return prev;
                });
            }, idx * CARD_STAGGER_MS);
        };

        // Seed the array with all cards first (empty), then stream fills them
        setGeneratedContent(results.map(c => ({ ...c, streamedCaption: '', isStreaming: false })));
        streamNext(0);

        toast.success(`Generating ${results.length} platform-optimized posts!`, {
            description: 'Watch as AI writes each post in real time.',
        });
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="font-display text-2xl font-extrabold text-white">
                        Content <span className="gradient-text">Generation</span>
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Enter your topic and let AI craft platform-optimized posts in seconds.
                    </p>
                </div>
                <button
                    onClick={() => setShowHistory(p => !p)}
                    className="btn-secondary text-xs"
                >
                    <span>↺</span>
                    {showHistory ? 'Hide History' : 'Generation History'}
                </button>
            </div>

            <div className="flex gap-6 items-start">
                {/* Left: Form */}
                <div className={`${showHistory ? 'w-72' : 'w-80'} flex-shrink-0`}>
                    <GenerationForm onGenerate={handleGenerate} isGenerating={isGenerating} />
                </div>

                {/* Center: Output */}
                <div className="flex-1 min-w-0">
                    <GeneratedContentCards
                        content={generatedContent}
                        isGenerating={isGenerating}
                        hasGenerated={hasGenerated}
                    />
                </div>

                {/* Right: History */}
                {showHistory && (
                    <div className="w-64 flex-shrink-0">
                        <GenerationHistory />
                    </div>
                )}
            </div>
        </div>
    );
}