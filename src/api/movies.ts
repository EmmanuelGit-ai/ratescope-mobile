// Movie API Service

import { supabase } from "./supabase";
import type { MovieWithScores, Genre, AggregatedScore } from "../types";

interface SupabaseMovie {
  id: string;
  tmdb_id: number;
  imdb_id: string | null;
  title: string;
  overview: string | null;
  release_date: string | null;
  runtime: number | null;
  budget: number | null;
  revenue: number | null;
  genres: Genre[];
  director_name: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number | null;
  status: string;
  aggregated_scores: SupabaseAggregatedScore[];
}

interface SupabaseAggregatedScore {
  five_star_score: number;
  confidence: number;
  data_completeness: number;
  sources_available: number;
  source_breakdown: AggregatedScore["sourceBreakdown"];
  last_calculated: string;
}

function mapMovie(row: SupabaseMovie): MovieWithScores {
  const score = row.aggregated_scores?.[0];
  return {
    id: row.id,
    tmdbId: row.tmdb_id,
    imdbId: row.imdb_id ?? undefined,
    title: row.title,
    overview: row.overview ?? undefined,
    releaseDate: row.release_date ?? undefined,
    runtime: row.runtime ?? undefined,
    budget: row.budget ?? undefined,
    revenue: row.revenue ?? undefined,
    genres: row.genres ?? [],
    cast: [],
    directorName: row.director_name ?? undefined,
    posterPath: row.poster_path ?? undefined,
    backdropPath: row.backdrop_path ?? undefined,
    popularity: row.popularity ?? undefined,
    status: row.status,
    aggregatedScore: score
      ? {
          fiveStarScore: score.five_star_score,
          confidence: score.confidence,
          dataCompleteness: score.data_completeness,
          sourcesAvailable: score.sources_available,
          sourceBreakdown: score.source_breakdown ?? [],
          lastCalculated: score.last_calculated,
        }
      : undefined,
  };
}

const MOVIE_SELECT = `
  id, tmdb_id, imdb_id, title, overview, release_date, runtime,
  budget, revenue, genres, director_name, poster_path, backdrop_path,
  popularity, status,
  aggregated_scores (
    five_star_score, confidence, data_completeness,
    sources_available, source_breakdown, last_calculated
  )
`;

export async function fetchTrending(): Promise<MovieWithScores[]> {
  const { data, error } = await supabase
    .from("movies")
    .select(MOVIE_SELECT)
    .order("popularity", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return (data as SupabaseMovie[]).map(mapMovie);
}

export async function fetchMovieDetail(id: string): Promise<MovieWithScores> {
  const { data, error } = await supabase
    .from("movies")
    .select(MOVIE_SELECT)
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return mapMovie(data as SupabaseMovie);
}

export async function searchMovies(query: string): Promise<MovieWithScores[]> {
  const { data, error } = await supabase
    .from("movies")
    .select(MOVIE_SELECT)
    .ilike("title", `%${query}%`)
    .order("popularity", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return (data as SupabaseMovie[]).map(mapMovie);
}
