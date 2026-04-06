'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackRatingWidgetProps {
    platform: string;
    onRate: (rating: number, tags: string[]) => void;
}

const feedbackTags = ['Great tone', 'Good hashtags', 'Too long', 'Too short', 'Wrong platform', 'Needs CTA', 'Perfect!'];

export default function FeedbackRatingWidget({ platform, onRate }: FeedbackRatingWidgetProps) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (rating === 0) return;
        onRate(rating, selectedTags);
        setSubmitted(true);
        toast.success('Thanks for your feedback!', {
            description: 'AI will use this to improve future content.',
        });
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    if (submitted) {
        return (
            <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
            >
                <Star size={12} className="fill-current" style={{ color: '#10B981' }} />
                <span className="text-xs font-medium" style={{ color: '#6EE7B7' }}>Feedback saved · AI will improve future content</span>
            </div>
        );
    }

    return (
        <div
            className="rounded-xl p-3 space-y-2"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
            <p className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Rate this {platform} post</p>

            {/* Stars */}
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className="transition-transform duration-100 hover:scale-110 active:scale-95"
                    >
                        <Star
                            size={18}
                            className={`transition-colors duration-100 ${
                                star <= (hovered || rating)
                                    ? 'fill-current text-amber-400'
                                    : 'text-white/15'
                            }`}
                        />
                    </button>
                ))}
            </div>

            {/* Quick tags */}
            {rating > 0 && (
                <div className="flex flex-wrap gap-1 animate-fade-in">
                    {feedbackTags.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className="text-[10px] px-2 py-1 rounded-lg font-medium transition-all duration-100"
                            style={
                                selectedTags.includes(tag)
                                    ? { background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.4)', color: '#A78BFA' }
                                    : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }
                            }
                        >
                            {tag}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="text-[10px] px-2 py-1 rounded-lg font-semibold text-white transition-all duration-150 ml-auto"
                        style={{ background: 'linear-gradient(135deg, #7C3AED, #9333EA)' }}
                    >
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
}
