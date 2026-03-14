// Ratings API Service

import { apiClient } from "./client";
import { API_CONFIG } from "../constants/api";
import type { AggregatedScore } from "../types";

export async function fetchAggregatedScore(movieId: string): Promise<AggregatedScore> {
  const res = await apiClient.get(API_CONFIG.ENDPOINTS.RATINGS, {
    params: { movieId },
  });
  return res.data.data;
}
