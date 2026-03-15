// Movie API Service — Supabase queries

import { supabase, supabaseConfigured, handleSupabaseError } from "./client";
import type { Movie, MovieWithScores, AggregatedScore, Genre, CastMember } from "../types";

const MOVIE_SELECT = `
  id,
  tmdb_id,
  imdb_id,
  title,
  overview,
  release_date,
  runtime,
  budget,
  revenue,
  genres,
  director_name,
  poster_path,
  backdrop_path,
  popularity,
  status,
  aggregated_scores (
    star_rating,
    confidence,
    source_count,
    calculated_at
  )
`;

interface MoviesResponse {
  movies: MovieWithScores[];
  total: number;
  page: number;
  totalPages: number;
}

function mapMovie(row: Record<string, unknown>): MovieWithScores {
  const genres = row.genres as Array<{ id: number; name: string }> | null;
  const agg = row.aggregated_scores as Record<string, unknown> | null;

  const movie: MovieWithScores = {
    id: String(row.id),
    tmdbId: row.tmdb_id as number,
    imdbId: (row.imdb_id as string) || undefined,
    title: row.title as string,
    overview: (row.overview as string) || undefined,
    releaseDate: (row.release_date as string) || undefined,
    runtime: (row.runtime as number) || undefined,
    budget: (row.budget as number) || undefined,
    revenue: (row.revenue as number) || undefined,
    genres: (genres ?? []) as Genre[],
    cast: [],
    directorName: (row.director_name as string) || undefined,
    posterPath: (row.poster_path as string) || undefined,
    backdropPath: (row.backdrop_path as string) || undefined,
    popularity: (row.popularity as number) || undefined,
    status: (row.status as string) || "released",
  };

  if (agg) {
    const sourceCount = (agg.source_count as number) ?? 0;
    movie.aggregatedScore = {
      fiveStarScore: agg.star_rating as number,
      confidence: agg.confidence as number,
      dataCompleteness: sourceCount / 6,
      sourcesAvailable: sourceCount,
      sourceBreakdown: [],
      lastCalculated: agg.calculated_at as string,
    };
  }

  return movie;
}

export async function fetchMovies(params?: {
  page?: number;
  limit?: number;
  genre?: string;
  sort?: string;
  search?: string;
}): Promise<MoviesResponse> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("movies")
    .select(MOVIE_SELECT, { count: "exact" });

  if (params?.search) {
    query = query.ilike("title", `%${params.search}%`);
  }

  if (params?.genre) {
    query = query.contains("genres", [{ name: params.genre }]);
  }

  if (params?.sort === "popularity" || !params?.sort) {
    query = query.order("popularity", { ascending: false });
  } else if (params?.sort === "release_date") {
    query = query.order("release_date", { ascending: false });
  } else if (params?.sort === "title") {
    query = query.order("title", { ascending: true });
  }

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) handleSupabaseError(error);

  const movies = (data ?? []).map(mapMovie);
  const total = count ?? 0;

  return {
    movies,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function fetchMovieDetail(id: string): Promise<MovieWithScores> {
  const { data, error } = await supabase
    .from("movies")
    .select(`
      ${MOVIE_SELECT},
      cast_members (
        id,
        name,
        character,
        profile_path,
        popularity
      )
    `)
    .eq("id", id)
    .single();

  if (error) handleSupabaseError(error);

  const movie = mapMovie(data);

  const castRows = data.cast_members as Array<Record<string, unknown>> | null;
  if (castRows) {
    movie.cast = castRows.map((c): CastMember => ({
      id: c.id as number,
      name: c.name as string,
      character: c.character as string,
      profilePath: (c.profile_path as string) || undefined,
      popularity: c.popularity as number,
    }));
  }

  return movie;
}

export async function fetchTrending(): Promise<MovieWithScores[]> {
  if (!supabaseConfigured) {
    throw new Error("Supabase not configured. Restart Expo after setting EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env");
  }

  const { data, error } = await supabase
    .from("movies")
    .select(MOVIE_SELECT)
    .order("popularity", { ascending: false })
    .limit(20);

  if (error) handleSupabaseError(error);

  return (data ?? []).map(mapMovie);
}

export async function searchMovies(query: string): Promise<MovieWithScores[]> {
  const { data, error } = await supabase
    .from("movies")
    .select(MOVIE_SELECT)
    .ilike("title", `%${query}%`)
    .order("popularity", { ascending: false })
    .limit(20);

  if (error) handleSupabaseError(error);

  return (data ?? []).map(mapMovie);
}

export async function fetchMoviesByMood(params: {
  genreIds: number[];
  maxRuntime?: number;
  limit?: number;
}): Promise<MovieWithScores[]> {
  let query = supabase
    .from("movies")
    .select(MOVIE_SELECT)
    .order("popularity", { ascending: false })
    .limit(params.limit ?? 20);

  if (params.genreIds.length > 0) {
    query = query.or(
      params.genreIds.map((gid) => `genres.cs.[{"id":${gid}}]`).join(",")
    );
  }

  if (params.maxRuntime) {
    query = query.lte("runtime", params.maxRuntime);
  }

  const { data, error } = await query;

  if (error) handleSupabaseError(error);

  return (data ?? []).map(mapMovie);
}
