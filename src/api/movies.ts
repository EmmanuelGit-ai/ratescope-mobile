// Movie API Service

import { apiClient } from "./client";
import { API_CONFIG } from "../constants/api";
import type { Movie, MovieWithScores } from "../types";

interface MoviesResponse {
  movies: MovieWithScores[];
  total: number;
  page: number;
  totalPages: number;
}

export async function fetchMovies(params?: {
  page?: number;
  limit?: number;
  genre?: string;
  sort?: string;
  search?: string;
}): Promise<MoviesResponse> {
  const res = await apiClient.get(API_CONFIG.ENDPOINTS.MOVIES, { params });
  return res.data.data;
}

export async function fetchMovieDetail(id: string): Promise<MovieWithScores> {
  const res = await apiClient.get(API_CONFIG.ENDPOINTS.MOVIE_DETAIL(id));
  return res.data.data;
}

export async function fetchTrending(): Promise<MovieWithScores[]> {
  const res = await apiClient.get(API_CONFIG.ENDPOINTS.TRENDING);
  return res.data.data.movies;
}

export async function searchMovies(query: string): Promise<MovieWithScores[]> {
  const res = await apiClient.get(API_CONFIG.ENDPOINTS.MOVIES, {
    params: { search: query, limit: 20 },
  });
  return res.data.data.movies;
}
