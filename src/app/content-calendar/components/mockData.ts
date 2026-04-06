export interface CalendarPost {
    id: string;
    platform: 'instagram' | 'linkedin' | 'twitter';
    caption: string;
    scheduledDate: string;
    status: 'draft' | 'scheduled' | 'published';
    contentType: string;
    engagementRate: number | null;
}

export const calendarPosts: CalendarPost[] = [
    // April 2026
    { id: 'post-001', platform: 'instagram', caption: '🚀 5 ways our CRM saves your sales team 3 hours every day — swipe to see the breakdown', scheduledDate: '2026-04-01T10:00:00', status: 'published', contentType: 'Carousel', engagementRate: 5.2 },
    { id: 'post-002', platform: 'linkedin', caption: 'I\'ve spoken to 200+ sales leaders this year. One pattern keeps emerging — the teams that outperform...', scheduledDate: '2026-04-01T09:00:00', status: 'published', contentType: 'Thought Leadership', engagementRate: 4.1 },
    { id: 'post-003', platform: 'twitter', caption: 'Hot take: Your CRM is costing you deals, not closing them. Thread 🧵', scheduledDate: '2026-04-02T11:00:00', status: 'published', contentType: 'Thread', engagementRate: 3.8 },
    { id: 'post-004', platform: 'instagram', caption: '✨ Behind the scenes: how our team built a feature in 48 hours that our users had been requesting for months', scheduledDate: '2026-04-03T14:00:00', status: 'published', contentType: 'Story', engagementRate: 6.7 },
    { id: 'post-005', platform: 'linkedin', caption: 'Q1 wrapped. Here\'s what we learned about what actually drives sales team performance in 2026...', scheduledDate: '2026-04-04T08:00:00', status: 'published', contentType: 'Article', engagementRate: 4.9 },
    { id: 'post-006', platform: 'twitter', caption: 'We just crossed 500 customers. Here\'s the one thing every single one of them had in common before signing up 👇', scheduledDate: '2026-04-07T10:30:00', status: 'published', contentType: 'Tweet', engagementRate: 5.1 },
    { id: 'post-007', platform: 'instagram', caption: 'The #1 reason sales reps miss quota has nothing to do with skill. It\'s about their tools. Here\'s the data 📊', scheduledDate: '2026-04-08T12:00:00', status: 'published', contentType: 'Carousel', engagementRate: 4.4 },
    { id: 'post-008', platform: 'linkedin', caption: 'What 340 companies taught us about the real ROI of CRM automation — the numbers might surprise you', scheduledDate: '2026-04-09T09:00:00', status: 'published', contentType: 'Thought Leadership', engagementRate: 5.8 },
    { id: 'post-009', platform: 'twitter', caption: 'Unpopular opinion: most sales tools create more work, not less. Here\'s how to tell the difference 🧵', scheduledDate: '2026-04-10T11:00:00', status: 'scheduled', contentType: 'Thread', engagementRate: null },
    { id: 'post-010', platform: 'instagram', caption: '🎯 Customer spotlight: how Priya\'s team at NovaTech went from 40% to 78% quota attainment in 60 days', scheduledDate: '2026-04-11T14:00:00', status: 'scheduled', contentType: 'Case Study', engagementRate: null },
    { id: 'post-011', platform: 'linkedin', caption: 'Hiring a VP of Sales in 2026? Here are the 5 questions I ask every candidate that reveal whether they can scale a team', scheduledDate: '2026-04-13T08:30:00', status: 'scheduled', contentType: 'Article', engagementRate: null },
    { id: 'post-012', platform: 'twitter', caption: 'The average sales rep has 7 tabs open at all times. We reduced that to 1. Here\'s how 👇', scheduledDate: '2026-04-14T10:00:00', status: 'scheduled', contentType: 'Tweet', engagementRate: null },
    { id: 'post-013', platform: 'instagram', caption: '🔥 We analyzed 10,000 sales calls. The top performers all do this one thing in the first 60 seconds', scheduledDate: '2026-04-15T12:00:00', status: 'scheduled', contentType: 'Reel', engagementRate: null },
    { id: 'post-014', platform: 'linkedin', caption: 'April check-in: our team\'s content strategy for Q2 and why we\'re doubling down on LinkedIn in 2026', scheduledDate: '2026-04-16T09:00:00', status: 'draft', contentType: 'Post', engagementRate: null },
    { id: 'post-015', platform: 'twitter', caption: 'New feature drop: AI-powered deal scoring that predicts close probability with 87% accuracy. Here\'s how it works 🤖', scheduledDate: '2026-04-17T11:00:00', status: 'draft', contentType: 'Announcement', engagementRate: null },
    { id: 'post-016', platform: 'instagram', caption: '💡 3 automation workflows every sales team should have set up before Q2 ends — a visual guide', scheduledDate: '2026-04-21T14:00:00', status: 'draft', contentType: 'Carousel', engagementRate: null },
    { id: 'post-017', platform: 'linkedin', caption: 'The best sales teams I\'ve worked with all share one trait: they treat their CRM like a product, not a database', scheduledDate: '2026-04-22T09:00:00', status: 'draft', contentType: 'Thought Leadership', engagementRate: null },
    { id: 'post-018', platform: 'twitter', caption: 'We\'re hiring! Looking for a Senior AE who knows how to sell to mid-market tech teams. DM me 🚀', scheduledDate: '2026-04-24T10:00:00', status: 'draft', contentType: 'Tweet', engagementRate: null },
    { id: 'post-019', platform: 'instagram', caption: '📈 April in review: our top 5 posts, what worked, and what we\'re changing in May', scheduledDate: '2026-04-28T12:00:00', status: 'draft', contentType: 'Recap', engagementRate: null },
    { id: 'post-020', platform: 'linkedin', caption: 'Final thought for April: consistency beats intensity every time. Here\'s our content calendar for May 👇', scheduledDate: '2026-04-30T09:00:00', status: 'draft', contentType: 'Article', engagementRate: null },
];