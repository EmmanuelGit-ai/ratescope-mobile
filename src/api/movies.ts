// Movie API Service — Supabase queries

import { supabase, supabaseConfigured, handleSupabaseError } from "./client";
import type { MovieWithScores, Genre, CastMember, DailyRanking, Industry } from "../types";

const TMDB_GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

const MOVIE_SELECT = `
  id,
  tmdb_id,
  title,
  overview,
  release_date,
  runtime,
  budget,
  revenue,
  genre_ids,
  director_name,
  poster_path,
  backdrop_path,
  popularity,
  status,
  industry,
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
  const genreIds = row.genre_ids as number[] | null;
  const genres: Genre[] = (genreIds ?? []).map((gid) => ({
    id: gid,
    name: TMDB_GENRE_MAP[gid] ?? "Unknown",
  }));
  const agg = row.aggregated_scores as Record<string, unknown> | null;

  const movie: MovieWithScores = {
    id: String(row.id),
    tmdbId: row.tmdb_id as number,
    title: row.title as string,
    overview: (row.overview as string) || undefined,
    releaseDate: (row.release_date as string) || undefined,
    runtime: (row.runtime as number) || undefined,
    budget: (row.budget as number) || undefined,
    revenue: (row.revenue as number) || undefined,
    genres,
    cast: [],
    directorName: (row.director_name as string) || undefined,
    posterPath: (row.poster_path as string) || undefined,
    backdropPath: (row.backdrop_path as string) || undefined,
    popularity: (row.popularity as number) || undefined,
    status: (row.status as string) || "released",
    industry: (row.industry as Industry) || undefined,
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
  person_name,
  character_name,
  profile_path,
  display_order
)
    `)
    .eq("id", id)
    .single();

  if (error) handleSupabaseError(error);

  const movie = mapMovie(data);

  const castRows = data.cast_members as Record<string, unknown>[] | null;
  if (castRows) {
    movie.cast = castRows.map((c, i): CastMember => ({
      id: (c.id as number) ?? i,
      name: (c.person_name as string) ?? "",
      character: (c.character_name as string) ?? "",
      profilePath: (c.profile_path as string) || undefined,
      popularity: (c.display_order as number) ?? 0,
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
      params.genreIds.map((gid) => `genre_ids.cs.{${gid}}`).join(",")
    );
  }

  if (params.maxRuntime) {
    query = query.lte("runtime", params.maxRuntime);
  }

  const { data, error } = await query;

  if (error) handleSupabaseError(error);

  return (data ?? []).map(mapMovie);
}

export async function fetchDailyTop(industry?: string): Promise<DailyRanking[]> {
  const today = new Date().toISOString().split("T")[0];

  let query = supabase
    .from("daily_rankings")
    .select(`
      id,
      movie_id,
      rank_date,
      global_rank,
      industry_rank,
      industry,
      daily_score,
      popularity_velocity,
      movies (
        ${MOVIE_SELECT}
      )
    `)
    .eq("rank_date", today)
    .order("global_rank", { ascending: true })
    .limit(20);

  if (industry && industry !== "all") {
    query = query.eq("industry", industry);
  }

  const { data, error } = await query;

  if (error) handleSupabaseError(error);

  return (data ?? []).map((row): DailyRanking => {
    const movieRow = row.movies as Record<string, unknown> | null;
    return {
      id: String(row.id),
      movieId: String(row.movie_id),
      rankDate: row.rank_date as string,
      globalRank: row.global_rank as number,
      industryRank: row.industry_rank as number,
      industry: row.industry as Industry,
      dailyScore: row.daily_score as number,
      popularityVelocity: row.popularity_velocity as number,
      movie: movieRow ? mapMovie(movieRow) : undefined,
    };
  });
}

export async function fetchByIndustry(industry: string): Promise<MovieWithScores[]> {
  const { data, error } = await supabase
    .from("movies")
    .select(MOVIE_SELECT)
    .eq("industry", industry)
    .order("popularity", { ascending: false })
    .limit(20);

  if (error) handleSupabaseError(error);

  return (data ?? []).map(mapMovie);
}
