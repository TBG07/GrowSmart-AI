// ─── Real-Time Data Types ──────────────────────────────────────────────────

export interface KPIMetrics {
  engagementRate: number;       // e.g. 4.7 (%)
  totalReach: number;           // e.g. 142300
  postsPublished: number;       // e.g. 38
  aiAcceptanceRate: number;     // e.g. 73 (%)
  avgHashtagReach: number;      // e.g. 18400
  bestPlatform: string;         // e.g. "TikTok"
  bestPlatformEngagement: number; // e.g. 7.8 (%)
  // Trend deltas vs previous period
  engagementTrend: number;      // +/- percentage points
  reachTrend: number;
  postsTrend: number;
  aiAcceptanceTrend: number;
  hashtagTrend: number;
}

export interface PlatformData {
  platform: 'instagram' | 'linkedin' | 'twitter' | 'tiktok';
  label: string;
  engagementRate: number;
  reach: number;
  posts: number;
  color: string;
}

export interface EngagementPoint {
  date: string;
  instagram: number;
  linkedin: number;
  twitter: number;
  tiktok: number;
}

export interface ContentTypeData {
  name: string;
  value: number;        // avg engagement rate
  fill: string;
  posts: number;
}

export interface LivePost {
  id: string;
  platform: string;
  caption: string;
  type: string;
  publishedDate: string;
  reach: number;
  engagementRate: number;
  likes: number;
  comments: number;
  shares: number;
  topHashtag: string;
  aiGenerated: boolean;
  rankChange: number;   // +1 = moved up, -1 = moved down, 0 = same
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'tip' | 'win';
  title: string;
  body: string;
  action: string;
  impact: string;
  generatedAt: number;  // timestamp
}

export interface LiveDashboardData {
  kpis: KPIMetrics;
  platforms: PlatformData[];
  engagementTrend: EngagementPoint[];
  contentTypes: ContentTypeData[];
  topPosts: LivePost[];
  insights: AIInsight[];
  lastUpdated: number;  // unix ms timestamp
  pollCount: number;    // how many times data has refreshed
}

export interface UseLiveDataResult<T> {
  data: T | null;
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: number | null;
  secondsAgo: number;
  error: string | null;
  refresh: () => void;
}
