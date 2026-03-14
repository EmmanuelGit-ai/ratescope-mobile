// Ratings API Service — Supabase queries

import { supabase, handleSupabaseError } from "./client";
import type { AggregatedScore, SourceRating, RatingSource } from "../types";

const SOURCE_LABELS: Record<RatingSource, { label: string; maxScore: string }> = {
  IMDB: { label: "IMDb", maxScore: "10" },
  RT_CRITIC: { label: "Rotten Tomatoes (Critics)", maxScore: "100%" },
  RT_AUDIENCE: { label: "RT Audience Score", maxScore: "100%" },
  METACRITIC: { label: "Metacritic", maxScore: "100" },
  LETTERBOXD: { label: "Letterboxd", maxScore: "5.0" },
  BOX_OFFICE: { label: "Box Office/Streaming", maxScore: "100" },
};

const SOURCE_WEIGHTS: Record<RatingSource, number> = {
  IMDB: 0.25,
  RT_CRITIC: 0.20,
  METACRITIC: 0.20,
  LETTERBOXD: 0.15,
  RT_AUDIENCE: 0.10,
  BOX_OFFICE: 0.10,
};

export async function fetchAggregatedScore(movieId: string): Promise<AggregatedScore> {
  const [aggResult, sourcesResult] = await Promise.all([
    supabase
      .from("aggregated_scores")
      .select("five_star_score, confidence, data_completeness, sources_available, source_breakdown, last_calculated")
      .eq("movie_id", movieId)
      .single(),
    supabase
      .from("rating_sources")
      .select("source, raw_score, normalized_score, vote_count")
      .eq("movie_id", movieId),
  ]);

  if (aggResult.error) handleSupabaseError(aggResult.error);
  if (sourcesResult.error) handleSupabaseError(sourcesResult.error);

  const agg = aggResult.data;
  const sources = sourcesResult.data ?? [];

  const sourceBreakdown: SourceRating[] = sources.map((s) => {
    const source = s.source as RatingSource;
    const meta = SOURCE_LABELS[source];
    return {
      source,
      rawScore: s.raw_score as number,
      normalizedScore: s.normalized_score as number,
      weight: SOURCE_WEIGHTS[source],
      voteCount: (s.vote_count as number) || undefined,
      label: meta?.label ?? source,
      maxScore: meta?.maxScore ?? "?",
    };
  });

  return {
    fiveStarScore: agg.five_star_score as number,
    confidence: agg.confidence as number,
    dataCompleteness: agg.data_completeness as number,
    sourcesAvailable: agg.sources_available as number,
    sourceBreakdown,
    lastCalculated: agg.last_calculated as string,
  };
}
