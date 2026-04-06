'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, CalendarPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CalendarPost } from './mockData';

// Inline SVG icons for social platforms (not available in this lucide-react version)
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

interface Props {
    date: Date;
    existingPosts: CalendarPost[];
    onClose: () => void;
    onAdd: (post: CalendarPost) => void;
}

interface FormData {
    platform: string;
    caption: string;
    time: string;
    status: string;
}

const platformOptions = [
    { value: 'instagram', label: 'Instagram', Icon: InstagramIcon, color: 'text-pink-500' },
    { value: 'linkedin', label: 'LinkedIn', Icon: LinkedinIcon, color: 'text-blue-600' },
    { value: 'twitter', label: 'Twitter / X', Icon: TwitterIcon, color: 'text-sky-500' },
];

const statusBadge: Record<string, string> = {
    draft: 'badge badge-draft',
    scheduled: 'badge badge-scheduled',
    published: 'badge badge-published',
};

export default function AddContentModal({ date, existingPosts, onClose, onAdd }: Props) {
    const [saving, setSaving] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: { platform: 'instagram', status: 'scheduled', time: '10:00' },
    });

    const dateLabel = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    const onSubmit = async (data: FormData) => {
        setSaving(true);
        // Backend integration: POST /api/calendar/posts with { platform, caption, scheduledDate, status }
        await new Promise((r) => setTimeout(r, 900));

        const [h, m] = data.time.split(':').map(Number);
        const scheduledDate = new Date(date);
        scheduledDate.setHours(h, m, 0, 0);

        const newPost: CalendarPost = {
            id: `post-new-${Date.now()}`,
            platform: data.platform as "instagram" | "linkedin" | "twitter",
            caption: data.caption,
            scheduledDate: scheduledDate.toISOString(),
            status: data.status as CalendarPost['status'],
            contentType: 'Post',
            engagementRate: null,
        };

        onAdd(newPost);
        setSaving(false);
        onClose();
        toast.success('Content added to calendar!', { description: `Scheduled for ${dateLabel} at ${data.time}` });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md mx-4 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <p className="font-display font-bold text-slate-900">Add Content</p>
                        <p className="text-xs text-slate-500 mt-0.5">{dateLabel}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                        <X size={16} className="text-slate-500" />
                    </button>
                </div>

                {/* Existing posts for this day */}
                {existingPosts.length > 0 && (
                    <div className="px-6 pt-4">
                        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-2">Already scheduled</p>
                        <div className="space-y-1">
                            {existingPosts.map((p) => (
                                <div key={`existing-${p.id}`} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-1.5">
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.platform === 'instagram' ? 'bg-pink-500' : p.platform === 'linkedin' ? 'bg-blue-600' : 'bg-sky-500'}`} />
                                    <span className="truncate flex-1">{p.caption.slice(0, 40)}…</span>
                                    <span className={statusBadge[p.status]}>{p.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
                    {/* Platform */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Platform</label>
                        <div className="grid grid-cols-3 gap-2">
                            {platformOptions.map((p) => (
                                <label key={`modal-platform-${p.value}`} className="cursor-pointer">
                                    <input type="radio" value={p.value} {...register('platform')} className="sr-only" />
                                    <div className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 has-[:checked]:border-violet-400 has-[:checked]:bg-violet-50 border-slate-200 hover:bg-slate-50`}>
                                        <p.Icon size={16} className={p.color} />
                                        <span className="text-slate-700">{p.value === 'twitter' ? 'X' : p.label}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Caption */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Caption <span className="text-rose-500">*</span></label>
                        <textarea
                            {...register('caption', { required: 'Caption is required', minLength: { value: 10, message: 'Caption too short' } })}
                            rows={4}
                            placeholder="Write your post caption here, or generate with AI..."
                            className="input-field resize-none text-sm"
                        />
                        {errors.caption && <p className="text-rose-500 text-[11px] mt-1">{errors.caption.message}</p>}
                    </div>

                    {/* Time + Status */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Post Time</label>
                            <input type="time" {...register('time')} className="input-field text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
                            <select {...register('status')} className="input-field text-sm">
                                <option value="draft">Draft</option>
                                <option value="scheduled">Scheduled</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                            {saving ? <Loader2 size={15} className="animate-spin" /> : <CalendarPlus size={15} />}
                            {saving ? 'Saving…' : 'Add to Calendar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}