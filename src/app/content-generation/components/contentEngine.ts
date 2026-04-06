/**
 * contentEngine.ts — Advanced AI Content Generation Engine v2
 * Produces platform-specific posts with virality scoring, hook analysis,
 * multiple variants, thread breakdowns, and video scripts.
 */

import { GenerationFormData, Hashtag } from './types';
import type { RichGeneratedContent, ContentVariant, ViralityBreakdown, HookAnalysis, ThreadPart } from './types';

// ─── Utilities ────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function pickN<T>(arr: T[], n: number): T[] { return [...arr].sort(() => Math.random() - 0.5).slice(0, n); }
function rand(min: number, max: number): number { return Math.round((min + Math.random() * (max - min)) * 10) / 10; }
function randInt(min: number, max: number): number { return Math.floor(min + Math.random() * (max - min + 1)); }
function capitalize(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }
function cap(s: string): string { return s.trim().replace(/[.!?]+$/, '').slice(0, 90); }
function parseKws(raw: string): string[] { return (raw || '').split(',').map(k => k.trim()).filter(Boolean).slice(0, 6); }

// ─── Tone System ─────────────────────────────────────────────────────────────

interface Tone {
  openers: string[];
  connectors: string[];
  ctas: string[];
  closers: string[];
  emoji: string;
  tags: string[];
  sentiment: 'positive' | 'bold' | 'neutral' | 'inspiring';
}

const TONES: Record<string, Tone> = {
  professional: {
    openers: [
      'Here\'s a framework backed by data from 300+ companies:',
      'After working with hundreds of high-growth teams, I can tell you:',
      'The pattern I see in every top-performing organisation:',
      'One insight that consistently separates leaders from the rest:',
      'Data-backed truth most teams ignore:',
    ],
    connectors: ['The result?', 'Here\'s the impact:', 'What we found:'],
    ctas: ['What\'s your take? Drop it below.', 'I\'d love your perspective — comment below.', 'Tag someone who needs to see this.'],
    closers: ['Let\'s build smarter. 👇', 'Thoughts? 👇', 'Would love your perspective.'],
    emoji: '💼', tags: ['professional', 'leadership', 'businessstrategy', 'growth'], sentiment: 'positive',
  },
  casual: {
    openers: ['Real talk —', 'Not gonna lie,', 'Hot take:', 'Something I wish I knew sooner:', 'Storytime 👇'],
    connectors: ['And here\'s the thing:', 'The plot twist?', 'What actually happened:'],
    ctas: ['Drop a 🔥 if this hits home.', 'Save this — seriously.', 'Share with someone who needs this.'],
    closers: ['Just saying! 😊', 'End rant. 😄', 'You\'ve got this! 💪'],
    emoji: '😊', tags: ['reallife', 'community', 'vibes', 'tipsandtricks'], sentiment: 'positive',
  },
  bold: {
    openers: [
      'Unpopular opinion:',
      'Most people are doing this completely wrong.',
      'The industry doesn\'t want you to know this:',
      'I\'m going to say what nobody else will:',
      'Hard truth incoming — buckle up:',
    ],
    connectors: ['Here\'s the proof:', 'The evidence:', 'Don\'t believe me?'],
    ctas: ['Agree or argue — both welcome. 🔥', 'Tag someone who still believes the old way works.', 'RT if you\'re tired of the same playbook.'],
    closers: ['Change is now. 🚀', 'No excuses. 💥', 'Built different. ⚡'],
    emoji: '🔥', tags: ['truth', 'boldmoves', 'hustle', 'disruptive', 'gamechangers'], sentiment: 'bold',
  },
  inspiring: {
    openers: [
      'Every breakthrough starts with one decision.',
      'The version of you that achieves this already exists.',
      'Small consistent actions compound into massive results.',
      'Success leaves clues — here\'s what I\'ve collected:',
      'What if the only thing standing between you and greatness was',
    ],
    connectors: ['And that changes everything.', 'The shift happens when:', 'Here\'s what unlocks it:'],
    ctas: ['Save this for a day when you need it. ✨', 'Share with someone on the grind. 💫', 'Which step resonates most? 👇'],
    closers: ['Keep going. ✨', 'You\'re closer than you think. 🌟', 'Trust the process. 💫'],
    emoji: '✨', tags: ['inspiration', 'mindset', 'motivation', 'growthmindset', 'believe'], sentiment: 'inspiring',
  },
  educational: {
    openers: [
      'Here\'s the complete breakdown of',
      'Most people misunderstand',
      'A step-by-step guide to',
      'Everything you need to know about',
      'The complete framework for mastering',
    ],
    connectors: ['Here\'s why it works:', 'The mechanism:', 'Step-by-step:'],
    ctas: ['Save this — you\'ll want to come back.', 'Which step do you want me to expand on?', 'Follow for weekly breakdowns like this.'],
    closers: ['Learn every day. 📚', 'Knowledge compounds. 🧠', 'Share the knowledge! 📖'],
    emoji: '📚', tags: ['education', 'howto', 'tutorial', 'learning', 'tips'], sentiment: 'positive',
  },
  witty: {
    openers: [
      'Plot twist:',
      'Nobody asked, but here\'s my take on',
      'If I had a dollar for every person who got this wrong about',
      'Controversial opinion incoming 🌶️',
      'POV: You finally understand that',
    ],
    connectors: ['Wait for it:', 'And here\'s the kicker:', 'The punchline?'],
    ctas: ['Drop your take below 👇 I love a good debate.', 'Tag a friend who needs to hear this 😅', 'Someone please explain this to my boss 😂'],
    closers: ['You\'re welcome. 😄', 'I\'ll see myself out. 😂', 'Don\'t @ me. 😏'],
    emoji: '😄', tags: ['relatable', 'funnybusiness', 'realtalk', 'trending'], sentiment: 'positive',
  },
};

// ─── Hook Types ──────────────────────────────────────────────────────────────

type HookType = 'question' | 'statistic' | 'bold_claim' | 'story' | 'pov' | 'list_teaser' | 'empathy';

function buildHook(type: HookType, topic: string, tone: Tone, keywords: string[]): string {
  const core = cap(topic);
  const kw = keywords[0] || 'success';

  const hooks: Record<HookType, string[]> = {
    question: [
      `What if everything you knew about ${core.toLowerCase()} was wrong?`,
      `Do you actually know the #1 reason most people fail at ${core.toLowerCase()}?`,
      `Why do ${randInt(70, 95)}% of ${kw} attempts fail within 90 days?`,
    ],
    statistic: [
      `${randInt(73, 94)}% of people who try ${core.toLowerCase()} give up before seeing results.`,
      `Teams who master ${kw} see ${randInt(2, 5)}x better outcomes in just ${randInt(30, 90)} days.`,
      `The top ${randInt(5, 15)}% of ${kw} practitioners share exactly 3 habits in common.`,
    ],
    bold_claim: [
      `${core} is the single most underrated leverage point in ${kw} right now.`,
      `I\'m convinced ${core.toLowerCase()} will be the defining skill of the next decade.`,
      `Most people are sleeping on ${core.toLowerCase()}, and that's your advantage.`,
    ],
    story: [
      `18 months ago I had no idea how to ${core.toLowerCase()}. Here's what changed everything:`,
      `A client came to me completely stuck on ${core.toLowerCase()}. What happened next surprised even me:`,
      `I almost gave up on ${core.toLowerCase()} — until I discovered this:`,
    ],
    pov: [
      `POV: You've just cracked the code on ${core.toLowerCase()} 🤯`,
      `POV: Your team just unlocked ${kw} and everything changed overnight.`,
      `POV: You're watching your competitors still struggle with ${core.toLowerCase()} while you've moved on.`,
    ],
    list_teaser: [
      `${randInt(5, 9)} things about ${core.toLowerCase()} that nobody teaches you:`,
      `The ${randInt(3, 7)}-step ${kw} framework that changed everything:`,
      `${randInt(4, 8)} hard lessons from mastering ${core.toLowerCase()}:`,
    ],
    empathy: [
      `If you're struggling with ${core.toLowerCase()}, this is for you.`,
      `To everyone who feels stuck on ${core.toLowerCase()} — I see you.`,
      `Being overwhelmed by ${core.toLowerCase()} is more common than anyone admits.`,
    ],
  };

  return pick(hooks[type]);
}

// ─── Platform Generators ─────────────────────────────────────────────────────

function genInstagram(topic: string, tone: Tone, kws: string[], audience: string, biz: string, hookType: HookType): string {
  const core = cap(topic);
  const hook = buildHook(hookType, topic, tone, kws);
  const bulletPoints = kws.length > 0
    ? kws.slice(0, 4).map(k => `✅ ${capitalize(k)}`).join('\n')
    : `✅ Clarity beats complexity\n✅ Consistency beats intensity\n✅ Execution beats planning`;

  const variants = [
    `${hook}\n\n${pick(tone.connectors)} here's what separates those who get results from those who don't:\n\n${bulletPoints}\n\n${pick(tone.connectors)} real, measurable impact for ${audience || 'our clients'}.\n\n→ Save this for when you need a reminder.\n\n${pick(tone.ctas)}\n\n${pick(tone.closers)}`,
    `${hook}\n\nSwipe to see the full breakdown 👉\n\n${pick(tone.connectors)}\n\n${bulletPoints}\n\nThis is exactly what we help ${audience || biz + ' teams'} implement every week.\n\n${pick(tone.ctas)}\n\n${pick(tone.closers)}`,
    `${hook}\n\n${bulletPoints}\n\nThe result? The people who apply this consistently are the ones you look up to.\n\nTag someone who needs to see this today 👇\n\n${pick(tone.closers)}`,
  ];
  return pick(variants);
}

function genLinkedin(topic: string, tone: Tone, kws: string[], audience: string, biz: string, hookType: HookType): string {
  const core = cap(topic);
  const hook = buildHook(hookType, topic, tone, kws);
  const kList = (kws.length > 0 ? kws : ['clarity', 'consistency', 'systems', 'execution'])
    .slice(0, 4)
    .map((k, i) => `${i + 1}. ${capitalize(k)} — the lever most ${biz} teams underinvest in.`)
    .join('\n');

  const variants = [
    `${hook}\n\nI've worked with ${audience || biz + ' teams'} across every growth stage. The top performers share exactly one thing:\n\nThey take ${core.toLowerCase()} seriously before everything else.\n\nHere's the framework:\n\n${kList}\n\nThis isn't theory. These are patterns from hundreds of hours in the room.\n\nIf this resonates — follow me. I publish frameworks like this weekly.\n\n${pick(tone.ctas)}`,
    `${hook}\n\nAfter ${randInt(200, 500)}+ conversations with ${audience || biz + ' leaders'}, I see the same pattern:\n\n${kList}\n\nThe teams that figure this out early compound their advantage. The ones that don't keep busy without getting better.\n\n${pick(tone.ctas)}\n\n${pick(tone.closers)}`,
    `${hook}\n\nHere's the exact framework I use with every ${audience || biz} client:\n\n${kList}\n\nSimple. Repeatable. Scalable.\n\nWhat would you add? I read every comment 👇\n\n${pick(tone.closers)}`,
  ];
  return pick(variants);
}

function genTwitter(topic: string, tone: Tone, kws: string[], hookType: HookType): string {
  const core = cap(topic);
  const hook = buildHook(hookType, topic, tone, kws);

  const variants = [
    `${hook}\n\nHere's everything I know, distilled:\n\n→ ${capitalize(kws[0] || 'start small')}\n→ ${capitalize(kws[1] || 'stay consistent')}\n→ ${capitalize(kws[2] || 'measure everything')}\n\n${pick(tone.ctas)}`,
    `${hook}\n\n${pick(tone.connectors)}\n\n1/ ${capitalize(kws[0] || 'Foundation first')}\n2/ ${capitalize(kws[1] || 'Build momentum')}\n3/ ${capitalize(kws[2] || 'Scale what works')}\n\nThread 🧵👇\n\n${pick(tone.closers)}`,
    `${hook}\n\nMost people overcomplicate ${core.toLowerCase()}. The simple version:\n\n${kws.slice(0, 3).map((k, i) => `${i + 1}. ${capitalize(k)}`).join('\n') || '1. Clarity\n2. Action\n3. Iteration'}\n\n${pick(tone.ctas)}`,
  ];
  return pick(variants);
}

function genTikTok(topic: string, tone: Tone, kws: string[], biz: string, hookType: HookType): string {
  const core = cap(topic);
  const hook = buildHook(hookType, topic, tone, kws);

  const variants = [
    `${hook}\n\n✨ HOOK: Watch till the end — this changes how you think about ${kws[0] || core.toLowerCase()}.\n\nBEFORE: ${capitalize(kws[1] || 'struggling with results')}, wasting time, hitting walls\nAFTER: ${capitalize(kws[0] || 'clear system')}, consistent wins, compound growth\n\n👇 Here's the step-by-step:\n\nStep 1: ${capitalize(kws[0] || 'Start with clarity')}\nStep 2: ${capitalize(kws[1] || 'Build the habit')}\nStep 3: ${capitalize(kws[2] || 'Scale what works')}\n\nComment "GUIDE" and I'll send you the full breakdown 📩\n\n${pick(tone.closers)}`,
    `The secret nobody in ${biz} is talking about 👀\n\n${hook}\n\n✅ ${capitalize(kws[0] || 'It starts with mindset')}\n✅ ${capitalize(kws[1] || 'Add the right system')}\n✅ ${capitalize(kws[2] || 'Scale consistently')}\n\nSave this so you don't forget! 📌\n\n${pick(tone.ctas)}`,
    `POV: You finally crack ${core.toLowerCase()} and your ${biz} 3x's in 60 days 🤯\n\n${pick(tone.connectors)}\n\nBefore I knew this: ${kws[1] || 'stuck, guessing, plateaued'}\nAfter applying this: ${kws[0] || 'clarity, momentum, results'}\n\nDrop a 🔥 if you want the full breakdown!\n\n${pick(tone.closers)}`,
  ];
  return pick(variants);
}

// ─── Thread Generator ────────────────────────────────────────────────────────

function genThread(topic: string, tone: Tone, kws: string[], audience: string): ThreadPart[] {
  const core = cap(topic);
  const ks = kws.length > 0 ? kws : ['foundation', 'systems', 'execution', 'measurement', 'scale'];

  return [
    { index: 1, text: `${buildHook('bold_claim', topic, tone, kws)}\n\nA thread on ${core.toLowerCase()} and why it matters more than ever in 2026 🧵` },
    ...ks.slice(0, 4).map((k, i) => ({
      index: i + 2,
      text: `${i + 2}/ ${capitalize(k)}\n\nMost ${audience || 'teams'} skip this. It's the biggest mistake in ${core.toLowerCase()}.\n\nHere's why it matters and what to do instead:\n\n→ ${pick(['Focus here first', 'Don\'t overcomplicate it', 'The simple version wins every time'])}`,
    })),
    { index: ks.slice(0, 4).length + 2, text: `${ks.slice(0, 4).length + 2}/ The takeaway:\n\nMastering ${core.toLowerCase()} isn't about doing more.\n\nIt's about doing the right things in the right order.\n\nIf this helped — RT the first tweet so others can find it.\n\nFollow me for more frameworks like this. 🙏` },
  ];
}

// ─── Video Script Generator ──────────────────────────────────────────────────

interface VideoScript { hook: string; body: string; cta: string; captions: string; }

function genVideoScript(topic: string, tone: Tone, kws: string[], biz: string): VideoScript {
  const core = cap(topic);
  return {
    hook: `[0–3 sec] ${buildHook('pov', topic, tone, kws)}\n[3–5 sec] Text overlay: "${capitalize(kws[0] || core.slice(0, 30))}"`,
    body: `[5–25 sec] "Here's what they don't tell you about ${core.toLowerCase()}:\n${kws.slice(0, 3).map((k, i) => `Point ${i + 1}: ${capitalize(k)}`).join(' → ')}\n\nMost ${biz} owners skip step ${randInt(1, 3)} — that's where they lose momentum."`,
    cta: `[25–30 sec] "Comment '${(kws[0] || 'GUIDE').toUpperCase()}' below and I'll send you the full breakdown. Follow for more."`,
    captions: kws.slice(0, 3).map(k => `#${k.replace(/[^a-zA-Z0-9]/g, '')}`).join(' ') + ` #${biz.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()} #fyp #viral`,
  };
}

// ─── Hashtag Generator ───────────────────────────────────────────────────────

const BIZ_TAGS: Record<string, string[]> = {
  'E-commerce':        ['ecommerce', 'shopify', 'dropshipping', 'onlineshopping', 'DTC', 'ecommercetips'],
  'SaaS / Tech':       ['SaaS', 'techstartup', 'B2Btech', 'productled', 'softwareDev', 'AItools'],
  'Consulting':        ['consulting', 'businessstrategy', 'advisory', 'managementconsulting', 'B2B'],
  'Coaching':          ['coaching', 'personalcoach', 'mindsetcoach', 'coachingbusiness', 'lifecoach'],
  'Restaurant / Food': ['foodie', 'restaurant', 'foodphotography', 'cheflife', 'f&b', 'hospitality'],
  'Fitness / Wellness':['fitness', 'wellness', 'healthylifestyle', 'workout', 'fitnessmotivation'],
  'Real Estate':       ['realestate', 'propertyinvestment', 'realtor', 'housingmarket', 'realestateagent'],
  'Personal Brand':    ['personalbrand', 'contentcreator', 'buildyourbrand', 'creatoreconomy', 'thoughtleader'],
  'Agency':            ['marketingagency', 'digitalmarketing', 'agencylife', 'branding', 'marketing'],
  'Non-profit':        ['nonprofit', 'socialimpact', 'giveback', 'charity', 'communitybuilding'],
};

const PLATFORM_TAGS: Record<string, string[]> = {
  instagram: ['reels', 'explorepage', 'instagramgrowth', 'contentcreator', 'instagramtips'],
  linkedin:  ['LinkedInTips', 'B2B', 'leadership', 'professionaldevelopment', 'careeradvice'],
  twitter:   ['startup', 'buildinpublic', 'founders', 'IndieHackers', 'growthhacking'],
  tiktok:    ['fyp', 'foryou', 'viral', 'tiktokbusiness', 'smallbusinesstiktok'],
};

function buildHashtags(platform: string, topic: string, kws: string[], tone: Tone, biz: string): Hashtag[] {
  const topicTags = topic.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ')
    .filter(w => w.length > 3).slice(0, 3);
  const kwTags = kws.slice(0, 3).map(k => k.toLowerCase().replace(/[^a-z0-9]/g, ''));

  const pool = [
    ...topicTags.map(t => ({ tag: t, score: randInt(70, 82), reach: `${randInt(200, 800)}K` })),
    ...kwTags.map(t => ({ tag: t, score: randInt(78, 90), reach: `${randInt(500, 3000)}K` })),
    ...(BIZ_TAGS[biz] ?? []).slice(0, 4).map(t => ({ tag: t, score: randInt(80, 92), reach: `${randInt(1, 5)}M` })),
    ...tone.tags.slice(0, 3).map(t => ({ tag: t, score: randInt(68, 80), reach: `${randInt(300, 900)}K` })),
    ...(PLATFORM_TAGS[platform] ?? []).slice(0, 3).map(t => ({ tag: t, score: randInt(85, 97), reach: `${randInt(5, 50)}M` })),
  ];

  const unique = Array.from(new Map(pool.map(p => [p.tag.replace(/[^a-zA-Z0-9]/g, ''), p])).values())
    .filter(p => p.tag.length > 1);

  return pickN(unique, Math.min(7, unique.length)).map(h => ({
    tag: h.tag.replace(/[^a-zA-Z0-9]/g, ''),
    score: Math.min(99, h.score),
    reach: h.reach,
  }));
}

// ─── Virality Breakdown ──────────────────────────────────────────────────────

function calcVirality(platform: string, kws: string[], hookType: HookType, tone: Tone): ViralityBreakdown {
  const hookScores: Record<HookType, number> = {
    question: 88, statistic: 92, bold_claim: 87, story: 84, pov: 91, list_teaser: 86, empathy: 80,
  };
  const platformMult: Record<string, number> = { tiktok: 1.08, instagram: 1.04, linkedin: 1.02, twitter: 1.0 };

  const hook = Math.round((hookScores[hookType] + randInt(-5, 5)) * (platformMult[platform] ?? 1));
  const emotion = tone.sentiment === 'bold' ? randInt(82, 94) : tone.sentiment === 'inspiring' ? randInt(85, 95) : randInt(72, 88);
  const clarity = kws.length >= 3 ? randInt(82, 93) : randInt(70, 84);
  const cta = randInt(76, 92);
  const timing = randInt(78, 90);
  const overall = Math.round((hook * 0.25 + emotion * 0.25 + clarity * 0.2 + cta * 0.15 + timing * 0.15));

  return { overall: Math.min(99, overall), hook: Math.min(99, hook), emotion, clarity, cta, timing };
}

// ─── Hook Analysis ───────────────────────────────────────────────────────────

function analyseHook(hookType: HookType): HookAnalysis {
  const labels: Record<HookType, { label: string; desc: string }> = {
    question:    { label: 'Question Hook',    desc: 'Triggers curiosity gap — readers must read on to resolve the open loop.' },
    statistic:   { label: 'Statistic Hook',   desc: 'Data-backed credibility. High trust signal, especially on LinkedIn.' },
    bold_claim:  { label: 'Bold Claim Hook',  desc: 'Controversial opener drives comments & shares from disagreement.' },
    story:       { label: 'Story Hook',        desc: 'Narrative empathy — readers project themselves into the story.' },
    pov:         { label: 'POV Hook',          desc: 'Identity-based trigger. Performs best on TikTok & Instagram Reels.' },
    list_teaser: { label: 'List Teaser Hook',  desc: 'Sets clear expectation of value. High save rate, low drop-off.' },
    empathy:     { label: 'Empathy Hook',      desc: 'Emotional resonance. Drives comments and shares from those who relate.' },
  };
  const strength = randInt(78, 96);
  const { label, desc } = labels[hookType];
  return { type: hookType, label, description: desc, strengthScore: strength };
}

// ─── Engagement & Timing ─────────────────────────────────────────────────────

const ENG: Record<string, { low: number; high: number; times: string[]; types: string[] }> = {
  instagram: { low: 3.8, high: 9.2,  times: ['Tue–Thu, 11am–1pm', 'Mon & Wed, 7–9pm', 'Fri, 10am–12pm'], types: ['Carousel', 'Reel Hook', 'Infographic', 'Story Series', 'Text Post'] },
  linkedin:  { low: 3.2, high: 7.1,  times: ['Tue–Wed, 8–10am', 'Thu, 12–1pm', 'Mon, 9–11am'], types: ['Thought Leadership', 'How-to Framework', 'Case Study', 'Data Story', 'Opinion Piece'] },
  twitter:   { low: 1.8, high: 5.6,  times: ['Mon–Thu, 9–11am', 'Wed, 6–9pm', 'Tue & Thu, 12–1pm'], types: ['Hot Take Thread', 'Question Tweet', 'Poll', 'Quote + Commentary', 'Breakdown Thread'] },
  tiktok:    { low: 5.5, high: 14.2, times: ['Tue–Fri, 7–9pm', 'Sat, 10am–12pm', 'Mon, 6–8pm'], types: ['POV Hook', 'Before/After', 'Tutorial', 'Storytime', 'Trend Audio'] },
};

// ─── Prompt Enhancer ─────────────────────────────────────────────────────────

export function enhancePrompt(topic: string, businessType: string, audience: string): string {
  const enhancers = [
    (t: string) => `The complete breakdown of ${t.toLowerCase()} — what works, what doesn't, and what the top 5% do differently`,
    (t: string) => `${randInt(5, 9)} counterintuitive lessons I learned from helping ${randInt(100, 500)}+ ${businessType} teams with ${t.toLowerCase()}`,
    (t: string) => `Why most ${audience || businessType + ' owners'} get ${t.toLowerCase()} wrong — and the simple fix that changes everything`,
    (t: string) => `The ${t.toLowerCase()} framework that helped us grow from 0 to ${randInt(1, 10)}k ${audience || 'customers'} in ${randInt(3, 12)} months`,
    (t: string) => `${randInt(3, 7)}-step ${t.toLowerCase()} playbook for ${audience || businessType + ' teams'} who want results without the guesswork`,
  ];
  return pick(enhancers)(topic.trim());
}

// ─── Main Generator ──────────────────────────────────────────────────────────

const HOOK_TYPES: HookType[] = ['question', 'statistic', 'bold_claim', 'story', 'pov', 'list_teaser', 'empathy'];

export function generateContent(formData: GenerationFormData): RichGeneratedContent[] {
  const { topic, tone, platforms, audience, keywords: rawKws, businessType } = formData;
  const toneProfile = TONES[tone] ?? TONES['professional'];
  const kws = parseKws(rawKws);

  return platforms.map(platform => {
    const eng = ENG[platform] ?? ENG['instagram'];
    const hookType = pick(HOOK_TYPES);
    const altHookType = pick(HOOK_TYPES.filter(h => h !== hookType));

    // Generate two caption variants (A/B)
    function gen(ht: HookType): string {
      switch (platform) {
        case 'instagram': return genInstagram(topic, toneProfile, kws, audience, businessType, ht);
        case 'linkedin':  return genLinkedin(topic, toneProfile, kws, audience, businessType, ht);
        case 'twitter':   return genTwitter(topic, toneProfile, kws, ht);
        case 'tiktok':    return genTikTok(topic, toneProfile, kws, businessType, ht);
        default:          return genInstagram(topic, toneProfile, kws, audience, businessType, ht);
      }
    }

    const variantA: ContentVariant = {
      id: 'a', label: 'Variant A', hookType,
      caption: gen(hookType),
      hookAnalysis: analyseHook(hookType),
      viralityBreakdown: calcVirality(platform, kws, hookType, toneProfile),
    };

    const variantB: ContentVariant = {
      id: 'b', label: 'Variant B', hookType: altHookType,
      caption: gen(altHookType),
      hookAnalysis: analyseHook(altHookType),
      viralityBreakdown: calcVirality(platform, kws, altHookType, toneProfile),
    };

    const hashtags = buildHashtags(platform, topic, kws, toneProfile, businessType);
    const ctaOpts = [
      ...toneProfile.ctas,
      kws.length > 0 ? `Interested in ${kws[0]}? Drop a comment below.` : null,
      audience ? `Built for ${audience} — does this resonate?` : null,
    ].filter(Boolean) as string[];

    const thread = (platform === 'twitter') ? genThread(topic, toneProfile, kws, audience) : undefined;
    const videoScript = (platform === 'tiktok' || platform === 'instagram') ? genVideoScript(topic, toneProfile, kws, businessType) : undefined;

    const low = rand(eng.low, eng.low * 1.15);
    const high = rand(eng.high * 0.88, eng.high);

    return {
      platform,
      caption: variantA.caption,
      hashtags,
      cta: pick(ctaOpts),
      contentType: pick(eng.types),
      aiScore: variantA.viralityBreakdown.overall,
      predictedEngagement: `${low.toFixed(1)}–${high.toFixed(1)}%`,
      bestPostTime: pick(eng.times),
      isStreaming: false,
      streamedCaption: '',
      // Advanced fields
      variants: [variantA, variantB],
      activeVariant: 'a',
      sentiment: toneProfile.sentiment,
      thread,
      videoScript,
      estimatedReach: `${randInt(2, 80)}K–${randInt(100, 500)}K`,
      readabilityScore: randInt(72, 96),
      wordCount: variantA.caption.split(/\s+/).length,
    };
  });
}
