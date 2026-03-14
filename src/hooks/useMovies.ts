// React Query hooks for movie data

import { useQuery } from "@tanstack/react-query";
import { fetchMovies, fetchMovieDetail, fetchTrending, searchMovies, fetchMoviesByMood } from "../api/movies";
import { fetchAggregatedScore } from "../api/ratings";
import { fetchPrediction } from "../api/predict";
import { API_CONFIG } from "../constants/api";

const staleTime = API_CONFIG.CACHE.STALE_TIME;

export function useTrending() {
  return useQuery({
    queryKey: ["movies", "trending"],
    queryFn: fetchTrending,
    staleTime,
  });
}

export function useMovies(params?: {
  page?: number;
  limit?: number;
  genre?: string;
  sort?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["movies", "list", params],
    queryFn: () => fetchMovies(params),
    staleTime,
  });
}

export function useMovieDetail(id: string) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovieDetail(id),
    staleTime,
    enabled: !!id,
  });
}

export function useMovieSearch(query: string) {
  return useQuery({
    queryKey: ["movies", "search", query],
    queryFn: () => searchMovies(query),
    staleTime: 60 * 1000,
    enabled: query.length >= 2,
  });
}

export function useAggregatedScore(movieId: string) {
  return useQuery({
    queryKey: ["score", movieId],
    queryFn: () => fetchAggregatedScore(movieId),
    staleTime,
    enabled: !!movieId,
  });
}

export function usePrediction(movieId: string) {
  return useQuery({
    queryKey: ["prediction", movieId],
    queryFn: () => fetchPrediction(movieId),
    staleTime,
    enabled: !!movieId,
  });
}

export function useMoviesByMood(params: {
  genreIds: number[];
  maxRuntime?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["movies", "mood", params.genreIds, params.maxRuntime],
    queryFn: () => fetchMoviesByMood(params),
    staleTime,
    enabled: params.genreIds.length > 0,
  });
}
