// ─── Simulated Real-Time Data Engine ──────────────────────────────────────
// Generates realistic, fluctuating metrics that mimic live social platform data.
// Values drift naturally between calls, simulating real engagement patterns.

import type {
  LiveDashboardData, KPIMetrics, PlatformData, EngagementPoint,
  ContentTypeData, LivePost, AIInsight,
} from './types';

/** Seeded random-ish fluctuation: stays in realistic bounds */
function fluctuate(base: number, volatility: number = 0.04): number {
  const delta = (Math.random() - 0.5) * 2 * volatility * base;
  return Math.round((base + delta) * 10) / 10;
}

function fluctuateInt(base: number, maxDelta: number = 50): number {
  return Math.max(0, base + Math.round((Math.random() - 0.5) * 2 * maxDelta));
}

/** Pick n random unique items from an array */
function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/** Build a rolling 14-day trend window relative to today */
function buildEngagementTrend(): EngagementPoint[] {
  const points: EngagementPoint[] = [];
  const now = new Date();
  const bases = { instagram: 4.7, linkedin: 5.3, twitter: 3.0, tiktok: 7.8 };

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayOfWeek = d.getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.88 : 1;
    points.push({
      date: label,
      instagram: Math.round(fluctuate(bases.instagram * weekendFactor, 0.12) * 10) / 10,
      linkedin:  Math.round(fluctuate(bases.linkedin  * weekendFactor, 0.10) * 10) / 10,
      twitter:   Math.round(fluctuate(bases.twitter   * weekendFactor, 0.14) * 10) / 10,
      tiktok:    Math.round(fluctuate(bases.tiktok    * weekendFactor, 0.10) * 10) / 10,
    });
  }
  return points;
}

// ─── Content Idea Pool ────────────────────────────────────────────────────────
// Large pool of realistic post ideas across platforms. A random subset is
// selected every poll cycle so the dashboard always feels fresh.

type PostTemplate = Omit<LivePost, 'reach' | 'engagementRate' | 'likes' | 'comments' | 'shares' | 'rankChange'> & {
  baseReach: number; baseEng: number; baseLikes: number; baseComments: number; baseShares: number;
};

const POST_POOL: PostTemplate[] = [
  // ── TikTok
  { id: 'p-t1',  platform: 'tiktok',    caption: 'POV: Your sales rep just saved 3 hours using AI 🤯 — before vs after breakdown',              type: 'POV Video',          publishedDate: 'Apr 3',  topHashtag: '#SalesTok',          aiGenerated: true,  baseReach: 38400, baseEng: 9.2, baseLikes: 2841, baseComments: 347, baseShares: 589 },
  { id: 'p-t2',  platform: 'tiktok',    caption: 'Day in the life of a SaaS founder closing deals with AI ✨ #realtalk',                         type: 'Vlog',               publishedDate: 'Apr 5',  topHashtag: '#founderlife',        aiGenerated: false, baseReach: 29300, baseEng: 8.4, baseLikes: 1920, baseComments: 214, baseShares: 440 },
  { id: 'p-t3',  platform: 'tiktok',    caption: 'The cold email template that got us 47 replies in one week 📩',                                type: 'Tutorial',           publishedDate: 'Apr 8',  topHashtag: '#coldemail',          aiGenerated: true,  baseReach: 33100, baseEng: 8.9, baseLikes: 2310, baseComments: 298, baseShares: 510 },
  { id: 'p-t4',  platform: 'tiktok',    caption: 'We A/B tested 200 subject lines. Here\'s what actually gets opened 👇',                       type: 'Data Story',         publishedDate: 'Apr 11', topHashtag: '#emailmarketing',     aiGenerated: true,  baseReach: 27800, baseEng: 7.6, baseLikes: 1740, baseComments: 189, baseShares: 362 },
  { id: 'p-t5',  platform: 'tiktok',    caption: 'Stop doing this in your sales calls (we learned the hard way) 😬',                            type: 'Storytime',          publishedDate: 'Apr 2',  topHashtag: '#salestips',          aiGenerated: false, baseReach: 41200, baseEng: 9.8, baseLikes: 3100, baseComments: 421, baseShares: 670 },
  { id: 'p-t6',  platform: 'tiktok',    caption: 'How we onboard 50 new users/week with zero manual effort using our CRM 🔥',                   type: 'Process Video',      publishedDate: 'Apr 9',  topHashtag: '#CRMhacks',           aiGenerated: true,  baseReach: 24600, baseEng: 7.1, baseLikes: 1380, baseComments: 156, baseShares: 290 },
  // ── Instagram
  { id: 'p-i1',  platform: 'instagram', caption: '✨ Behind the scenes: how our team shipped a feature in 48 hours',                            type: 'Story',              publishedDate: 'Apr 3',  topHashtag: '#buildinpublic',      aiGenerated: true,  baseReach: 18400, baseEng: 6.7, baseLikes: 892,  baseComments: 147, baseShares: 203 },
  { id: 'p-i2',  platform: 'instagram', caption: '🚀 5 ways our CRM saves your sales team 3 hours every day — swipe →',                        type: 'Carousel',           publishedDate: 'Apr 1',  topHashtag: '#salesautomation',    aiGenerated: true,  baseReach: 14900, baseEng: 5.2, baseLikes: 541,  baseComments: 89,  baseShares: 147 },
  { id: 'p-i3',  platform: 'instagram', caption: 'The #1 reason sales reps miss quota has nothing to do with skill',                            type: 'Carousel',           publishedDate: 'Apr 8',  topHashtag: '#salesproductivity',  aiGenerated: true,  baseReach: 11400, baseEng: 4.4, baseLikes: 318,  baseComments: 74,  baseShares: 109 },
  { id: 'p-i4',  platform: 'instagram', caption: '7 content formats that actually convert in B2B SaaS 📊 (save this)',                          type: 'Carousel',           publishedDate: 'Apr 6',  topHashtag: '#B2Bmarketing',       aiGenerated: true,  baseReach: 13200, baseEng: 5.8, baseLikes: 604,  baseComments: 112, baseShares: 178 },
  { id: 'p-i5',  platform: 'instagram', caption: 'Our team\'s AI content workflow — 10x output, same headcount 💡',                             type: 'Infographic',        publishedDate: 'Apr 10', topHashtag: '#AItools',            aiGenerated: false, baseReach: 15700, baseEng: 6.1, baseLikes: 722,  baseComments: 134, baseShares: 211 },
  { id: 'p-i6',  platform: 'instagram', caption: 'Growth isn\'t a hack — it\'s consistency. Here\'s our 90-day blueprint 📅',                   type: 'Carousel',           publishedDate: 'Apr 12', topHashtag: '#growthmindset',      aiGenerated: true,  baseReach: 9800,  baseEng: 4.9, baseLikes: 389,  baseComments: 67,  baseShares: 98  },
  { id: 'p-i7',  platform: 'instagram', caption: 'Real talk: what no one tells you about scaling past $1M ARR 👇',                              type: 'Text Post',          publishedDate: 'Apr 4',  topHashtag: '#SaaS',               aiGenerated: false, baseReach: 17300, baseEng: 7.3, baseLikes: 981,  baseComments: 203, baseShares: 264 },
  // ── LinkedIn
  { id: 'p-l1',  platform: 'linkedin',  caption: 'What 340 companies taught us about the real ROI of CRM automation',                          type: 'Thought Leadership', publishedDate: 'Apr 9',  topHashtag: '#CRM',                aiGenerated: true,  baseReach: 16200, baseEng: 5.8, baseLikes: 612,  baseComments: 231, baseShares: 88  },
  { id: 'p-l2',  platform: 'linkedin',  caption: 'Q1 wrapped. Here\'s what we learned about what actually drives sales performance',            type: 'Article',            publishedDate: 'Apr 4',  topHashtag: '#salesleadership',    aiGenerated: true,  baseReach: 12800, baseEng: 4.9, baseLikes: 398,  baseComments: 112, baseShares: 62  },
  { id: 'p-l3',  platform: 'linkedin',  caption: 'We hired 3 AI "employees" and it changed how we think about headcount forever',               type: 'Thought Leadership', publishedDate: 'Apr 7',  topHashtag: '#futureofwork',       aiGenerated: false, baseReach: 19400, baseEng: 6.4, baseLikes: 874,  baseComments: 287, baseShares: 114 },
  { id: 'p-l4',  platform: 'linkedin',  caption: 'Our NPS went from 34 to 71 in 6 months. Here\'s every change we made 🧵',                    type: 'Long-form Post',     publishedDate: 'Apr 11', topHashtag: '#customersuccess',    aiGenerated: true,  baseReach: 14100, baseEng: 5.3, baseLikes: 521,  baseComments: 198, baseShares: 77  },
  { id: 'p-l5',  platform: 'linkedin',  caption: 'The email sequence that turned cold leads into $250K in pipeline last quarter',               type: 'Case Study',         publishedDate: 'Apr 2',  topHashtag: '#salesstrategy',      aiGenerated: true,  baseReach: 11700, baseEng: 4.6, baseLikes: 412,  baseComments: 143, baseShares: 54  },
  { id: 'p-l6',  platform: 'linkedin',  caption: 'Unpopular opinion: your content strategy is the reason your pipeline is dry',                 type: 'Opinion Post',       publishedDate: 'Apr 6',  topHashtag: '#demandgen',          aiGenerated: false, baseReach: 22100, baseEng: 7.1, baseLikes: 1103, baseComments: 318, baseShares: 129 },
  // ── Twitter / X
  { id: 'p-x1',  platform: 'twitter',   caption: 'We just crossed 500 customers. Here\'s the one thing they all had in common',                 type: 'Tweet',              publishedDate: 'Apr 7',  topHashtag: '#SaaS',               aiGenerated: false, baseReach: 13700, baseEng: 5.1, baseLikes: 428,  baseComments: 93,  baseShares: 176 },
  { id: 'p-x2',  platform: 'twitter',   caption: 'Hot take: Your CRM is costing you deals, not closing them. Thread 🧵',                       type: 'Thread',             publishedDate: 'Apr 2',  topHashtag: '#sales',              aiGenerated: true,  baseReach: 9800,  baseEng: 3.8, baseLikes: 241,  baseComments: 67,  baseShares: 65  },
  { id: 'p-x3',  platform: 'twitter',   caption: 'AI wrote our last 20 posts. Here\'s what humans could\'ve never written 👇',                  type: 'Thread',             publishedDate: 'Apr 5',  topHashtag: '#AIcontent',          aiGenerated: true,  baseReach: 11200, baseEng: 4.3, baseLikes: 312,  baseComments: 81,  baseShares: 94  },
  { id: 'p-x4',  platform: 'twitter',   caption: 'Founders sleep on email marketing. We made $180K last quarter purely from nurture sequences',  type: 'Tweet',              publishedDate: 'Apr 9',  topHashtag: '#emailmarketing',     aiGenerated: false, baseReach: 16300, baseEng: 6.2, baseLikes: 764,  baseComments: 148, baseShares: 221 },
  { id: 'p-x5',  platform: 'twitter',   caption: 'We cut our CAC by 38% by fixing one thing in our funnel. Ask me what it was.',               type: 'Engagement Tweet',   publishedDate: 'Apr 12', topHashtag: '#growthhacking',      aiGenerated: false, baseReach: 14800, baseEng: 5.6, baseLikes: 589,  baseComments: 198, baseShares: 132 },
];

// ─── AI Insights Pool (varied insight ideas) ──────────────────────────────────

type InsightTemplate = Omit<AIInsight, 'generatedAt' | 'body'> & { bodyFn: (ctx: InsightCtx) => string };

interface InsightCtx {
  contentTypes: ContentTypeData[];
  currentAiRate: number;
  currentPosts: number;
  kpis: KPIMetrics;
}

const INSIGHT_POOL: InsightTemplate[] = [
  {
    id: 'ins-01', type: 'win',         title: 'Carousel posts outperform by 42%',
    bodyFn: ({ contentTypes }) => `Your carousel posts average ${contentTypes[0].value.toFixed(1)}% engagement vs ${contentTypes[4].value.toFixed(1)}% for static posts. Instagram's algorithm is heavily favoring multi-slide formats this month.`,
    action: 'Generate more carousels', impact: 'High impact',
  },
  {
    id: 'ins-02', type: 'opportunity', title: 'LinkedIn posting window underused',
    bodyFn: () => 'Your top LinkedIn posts go live 8–10 am Tue/Wed. Only 3 of your 14 LinkedIn posts this period hit that window — 11 posts missed peak reach.',
    action: 'Reschedule drafts', impact: 'Medium impact',
  },
  {
    id: 'ins-03', type: 'warning',     title: 'AI acceptance rate slipping',
    bodyFn: ({ currentAiRate }) => currentAiRate < 70
      ? `Posts are being heavily edited before publishing. Your "Professional" tone may be misaligned — try "Casual" or "Bold" for Twitter.`
      : `AI acceptance is at ${Math.round(currentAiRate)}% and holding strong. Keep iterating on tone to maintain quality.`,
    action: 'Adjust tone settings', impact: 'Medium impact',
  },
  {
    id: 'ins-04', type: 'tip',         title: '#salesautomation driving 3.1× more reach',
    bodyFn: ({ currentPosts }) => `Posts using #salesautomation and #CRMsoftware together reach ${fluctuate(3.1, 0.05).toFixed(1)}× more accounts. Only 6 of your ${currentPosts} posts used this combination.`,
    action: 'Update hashtag defaults', impact: 'High impact',
  },
  {
    id: 'ins-05', type: 'opportunity', title: '3 content gaps detected this week',
    bodyFn: () => 'Apr 5–6 (weekend) and Apr 12 (Sunday) had zero scheduled posts. Competitors post 7 days/week. Consistency drives 23% more follower growth on average.',
    action: 'Fill calendar gaps', impact: 'Medium impact',
  },
  {
    id: 'ins-06', type: 'win',         title: 'TikTok reach surging this period',
    bodyFn: ({ kpis }) => `Your TikTok content is performing at ${kpis.bestPlatformEngagement}% engagement — the highest across all platforms. Short-form video strategy is clearly resonating.`,
    action: 'Double down on TikTok', impact: 'High impact',
  },
  {
    id: 'ins-07', type: 'tip',         title: 'Reels posted before 9 am get 2× saves',
    bodyFn: () => 'Analysis of your last 18 Reels shows those published between 7–9 am receive 2.1× more saves and 34% higher shares than afternoon posts.',
    action: 'Schedule Reels earlier', impact: 'Medium impact',
  },
  {
    id: 'ins-08', type: 'warning',     title: 'Thread engagement dropping on Twitter/X',
    bodyFn: ({ contentTypes }) => `Thread engagement has fallen to ${contentTypes[3]?.value.toFixed(1) ?? '3.9'}% — down from 5.2% last period. Consider shorter, punchier posts or ask-me-anything style tweets to re-engage your audience.`,
    action: 'Refresh Twitter strategy', impact: 'Medium impact',
  },
  {
    id: 'ins-09', type: 'opportunity', title: 'Thought leadership posts drive 2× comments',
    bodyFn: ({ contentTypes }) => `Your LinkedIn thought leadership posts average ${contentTypes[2]?.value.toFixed(1) ?? '5.1'}% engagement and 2.3× more comments than other formats, but represent only 8 of your total posts. Scaling this format could boost inbound leads.`,
    action: 'Create thought leadership series', impact: 'High impact',
  },
  {
    id: 'ins-10', type: 'win',         title: 'AI-generated posts outperform manual by 18%',
    bodyFn: ({ currentAiRate }) => `Posts generated by AI and published without heavy edits are seeing 18% higher engagement on average vs manually written posts this period. Your ${Math.round(currentAiRate)}% acceptance rate is translating to real results.`,
    action: 'Increase AI content volume', impact: 'High impact',
  },
  {
    id: 'ins-11', type: 'tip',         title: 'Use social proof in your next 3 posts',
    bodyFn: ({ currentPosts }) => `Posts mentioning customer numbers or case study results in the caption get 41% more shares. Out of your ${currentPosts} recent posts, only 4 included social proof.`,
    action: 'Add social proof to drafts', impact: 'Medium impact',
  },
  {
    id: 'ins-12', type: 'opportunity', title: 'Cross-posting TikTok to Instagram Reels is underused',
    bodyFn: () => `Only 2 of your 8 TikTok videos were cross-posted to Instagram Reels. Cross-posting takes under 2 minutes and historically gives you 60% of TikTok's reach for free on a second channel.`,
    action: 'Enable cross-posting', impact: 'Medium impact',
  },
];

const BASE_REACH = 142300;
const BASE_ENGAGEMENT = 4.7;
const BASE_POSTS = 38;
const BASE_AI_RATE = 73;
const BASE_HASHTAG_REACH = 18400;

// Persistent state that accumulates across calls to simulate growth
let pollCount = 0;
let currentReach = BASE_REACH;
let currentEngagement = BASE_ENGAGEMENT;
let currentPosts = BASE_POSTS;
let currentAiRate = BASE_AI_RATE;
let currentHashtagReach = BASE_HASHTAG_REACH;

export function generateLiveDashboardData(): LiveDashboardData {
  pollCount++;

  currentReach        = Math.round(fluctuateInt(currentReach, 800));
  currentEngagement   = Math.round(fluctuate(currentEngagement, 0.03) * 10) / 10;
  currentAiRate       = Math.min(95, Math.max(55, fluctuate(currentAiRate, 0.02)));
  currentHashtagReach = Math.round(fluctuateInt(currentHashtagReach, 300));
  if (Math.random() > 0.7) currentPosts = Math.min(currentPosts + 1, 60);

  // ── KPIs ─────────────────────────────────────────────────────────────────
  const kpis: KPIMetrics = {
    engagementRate: currentEngagement,
    totalReach: currentReach,
    postsPublished: currentPosts,
    aiAcceptanceRate: Math.round(currentAiRate),
    avgHashtagReach: currentHashtagReach,
    bestPlatform: 'TikTok',
    bestPlatformEngagement: Math.round(fluctuate(7.8, 0.05) * 10) / 10,
    engagementTrend:   Math.round(fluctuate(12, 0.15)),
    reachTrend:        Math.round(fluctuate(8, 0.2)),
    postsTrend:        Math.round(fluctuate(19, 0.1)),
    aiAcceptanceTrend: Math.round(fluctuate(-4, 0.3)),
    hashtagTrend:      Math.round(fluctuate(23, 0.1)),
  };

  // ── Platform Data ─────────────────────────────────────────────────────────
  const platforms: PlatformData[] = [
    { platform: 'tiktok',    label: 'TikTok',    engagementRate: fluctuate(7.8, 0.06), reach: fluctuateInt(38400, 600), posts: 8,  color: '#D946EF' },
    { platform: 'linkedin',  label: 'LinkedIn',  engagementRate: fluctuate(5.8, 0.05), reach: fluctuateInt(58200, 500), posts: 14, color: '#3B82F6' },
    { platform: 'instagram', label: 'Instagram', engagementRate: fluctuate(4.7, 0.05), reach: fluctuateInt(52100, 500), posts: 16, color: '#EC4899' },
    { platform: 'twitter',   label: 'Twitter/X', engagementRate: fluctuate(3.1, 0.06), reach: fluctuateInt(32000, 400), posts: 8,  color: '#38BDF8' },
  ];

  // ── Engagement Trend ──────────────────────────────────────────────────────
  const engagementTrend = buildEngagementTrend();

  // ── Content Type Performance ──────────────────────────────────────────────
  const contentTypes: ContentTypeData[] = [
    { name: 'Carousel',       value: fluctuate(6.2, 0.05), fill: '#7C3AED', posts: 11 },
    { name: 'Reel / Video',   value: fluctuate(5.8, 0.06), fill: '#EC4899', posts: 6  },
    { name: 'Thought Lead.',  value: fluctuate(5.1, 0.05), fill: '#3B82F6', posts: 8  },
    { name: 'Thread',         value: fluctuate(3.9, 0.06), fill: '#38BDF8', posts: 5  },
    { name: 'Static Post',    value: fluctuate(3.2, 0.05), fill: '#6B7280', posts: 8  },
  ];

  // ── Top Posts — random sample of 8 from pool each refresh ────────────────
  const selectedTemplates = pickRandom(POST_POOL, 8);
  const topPosts: LivePost[] = selectedTemplates.map((t, idx) => ({
    id: `${t.id}-${pollCount}-${idx}`,
    platform: t.platform,
    caption: t.caption,
    type: t.type,
    publishedDate: t.publishedDate,
    topHashtag: t.topHashtag,
    aiGenerated: t.aiGenerated,
    reach:         fluctuateInt(t.baseReach, Math.round(t.baseReach * 0.03)),
    engagementRate: Math.round(fluctuate(t.baseEng, 0.05) * 10) / 10,
    likes:         fluctuateInt(t.baseLikes, Math.round(t.baseLikes * 0.04)),
    comments:      fluctuateInt(t.baseComments, Math.round(t.baseComments * 0.06)),
    shares:        fluctuateInt(t.baseShares, Math.round(t.baseShares * 0.05)),
    rankChange:    Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0,
  })).sort((a, b) => b.reach - a.reach);

  // ── AI Insights — random 5 from pool per refresh ──────────────────────────
  const insightCtx: InsightCtx = { contentTypes, currentAiRate, currentPosts, kpis };
  const selectedInsightTemplates = pickRandom(INSIGHT_POOL, 5);
  const insights: AIInsight[] = selectedInsightTemplates.map(t => ({
    id: `${t.id}-${pollCount}`,
    type: t.type,
    title: t.title,
    body: t.bodyFn(insightCtx),
    action: t.action,
    impact: t.impact,
    generatedAt: Date.now(),
  }));

  return {
    kpis,
    platforms,
    engagementTrend,
    contentTypes,
    topPosts,
    insights,
    lastUpdated: Date.now(),
    pollCount,
  };
}
