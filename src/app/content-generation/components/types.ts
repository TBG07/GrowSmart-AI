export interface GenerationFormData {
    topic: string;
    businessType: string;
    audience: string;
    keywords: string;
    tone: string;
    platforms: string[];
    useBrandVoice?: boolean;
}

export interface Hashtag {
    tag: string;
    score: number;
    reach: string;
}

export interface ViralityBreakdown {
    overall: number;
    hook: number;
    emotion: number;
    clarity: number;
    cta: number;
    timing: number;
}

export interface HookAnalysis {
    type: string;
    label: string;
    description: string;
    strengthScore: number;
}

export interface ContentVariant {
    id: 'a' | 'b';
    label: string;
    hookType: string;
    caption: string;
    hookAnalysis: HookAnalysis;
    viralityBreakdown: ViralityBreakdown;
}

export interface ThreadPart {
    index: number;
    text: string;
}

export interface VideoScript {
    hook: string;
    body: string;
    cta: string;
    captions: string;
}

/** Base interface kept for backward compat */
export interface GeneratedContent {
    platform: string;
    caption: string;
    hashtags: Hashtag[];
    cta: string;
    contentType: string;
    aiScore: number;
    predictedEngagement: string;
    bestPostTime: string;
    userRating?: number;
    /** Streaming state — used during the typing animation */
    isStreaming?: boolean;
    streamedCaption?: string;
}

/** Rich content with A/B variants, virality, hooks, threads, scripts */
export interface RichGeneratedContent extends GeneratedContent {
    variants: ContentVariant[];
    activeVariant: 'a' | 'b';
    sentiment: 'positive' | 'bold' | 'neutral' | 'inspiring';
    thread?: ThreadPart[];
    videoScript?: VideoScript;
    estimatedReach: string;
    readabilityScore: number;
    wordCount: number;
}

export type Platform = 'instagram' | 'linkedin' | 'twitter' | 'tiktok';