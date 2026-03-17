// RateScope Mobile — Core Types
// Single source of truth for all TypeScript interfaces

export type RatingSource =
  | "IMDB"
  | "RT_CRITIC"
  | "RT_AUDIENCE"
  | "METACRITIC"
  | "LETTERBOXD"
  | "BOX_OFFICE";

export interface SourceRating {
  source: RatingSource;
  rawScore: number;
  normalizedScore: number;
  weight: number;
  voteCount?: number;
  label: string;
  maxScore: string;
}

export interface AggregatedScore {
  fiveStarScore: number;
  confidence: number;
  dataCompleteness: number;
  sourcesAvailable: number;
  sourceBreakdown: SourceRating[];
  lastCalculated: string;
}

export type ModifierName =
  | "starPower"
  | "directorTrackRecord"
  | "budgetToRevenue"
  | "genreMomentum"
  | "socialBuzzVelocity"
  | "sequelFranchiseFactor"
  | "trailerEngagement"
  | "releaseTiming"
  | "criticalEarlySignals"
  | "culturalRelevance"
  | "streamingPlatformFactor"
  | "productionQualityIndex";

export interface ModifierScore {
  name: ModifierName;
  label: string;
  score: number;
  weight: number;
  contribution: number;
}

export interface PredictedScore {
  predictedScore: number;
  confidenceInterval: { low: number; high: number };
  modifierBreakdown: ModifierScore[];
  modelVersion: string;
  predictedAt: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath?: string;
  popularity: number;
}

export type Industry =
  | "hollywood"
  | "nollywood"
  | "bollywood"
  | "korean"
  | "chinese"
  | "anime"
  | "european"
  | "latin_american"
  | "other";

export interface Movie {
  id: string;
  tmdbId: number;
  imdbId?: string;
  title: string;
  overview?: string;
  releaseDate?: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  genres: Genre[];
  cast: CastMember[];
  directorName?: string;
  posterPath?: string;
  backdropPath?: string;
  popularity?: number;
  status: string;
  industry?: Industry;
  originalLanguage?: string;
  productionCountries?: string[];
}

export interface MovieWithScores extends Movie {
  aggregatedScore?: AggregatedScore;
  predictedScore?: PredictedScore;
}

export type Mood =
  | "thrilling"
  | "heartwarming"
  | "mind-bending"
  | "laugh-out-loud"
  | "edge-of-seat"
  | "cozy"
  | "epic"
  | "dark"
  | "inspiring"
  | "nostalgic";

export interface MoodMapping {
  mood: Mood;
  label: string;
  emoji: string;
  genreIds: number[];
  description: string;
}

export interface TimeBudget {
  label: string;
  minMinutes: number;
  maxMinutes: number;
}

export interface DailyRanking {
  id: string;
  movieId: string;
  rankDate: string;
  globalRank: number;
  industryRank: number;
  industry: Industry;
  dailyScore: number;
  popularityVelocity: number;
  movie?: MovieWithScores;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  meta?: { page?: number; total?: number; cached?: boolean };
}
