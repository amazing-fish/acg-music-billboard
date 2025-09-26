export type RankingPeriod = 'weekly' | 'monthly' | 'event';

export type TrendDirection = 'up' | 'down' | 'steady';

export interface TrackMeta {
  id: string;
  title: string;
  artist: string;
  gameTitle: string;
  character?: string;
  version?: string;
  releaseDate: string; // ISO 8601 字符串
  coverArt?: string;
  previewUrl?: string;
}

export interface RankingMetrics {
  points: number;
  change: number;
  trend: TrendDirection;
  mentions: number;
  votes: number;
}

export interface RankingEntry {
  rank: number;
  track: TrackMeta;
  metrics: RankingMetrics;
}

export interface RankingBoard {
  id: string;
  name: string;
  period: RankingPeriod;
  updatedAt: string;
  description: string;
  themeColor?: string;
  entries: RankingEntry[];
}

export interface ActivitySchedule {
  id: string;
  title: string;
  type: 'concert' | 'release' | 'collab' | 'campaign';
  relatedGame: string;
  startDate: string;
  endDate?: string;
  highlightTrackIds: string[];
}

export interface BillboardSnapshot {
  generatedAt: string;
  boards: RankingBoard[];
  upcomingActivities: ActivitySchedule[];
}
