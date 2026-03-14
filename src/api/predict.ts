// Prediction API Service

import { apiClient } from "./client";
import { API_CONFIG } from "../constants/api";
import type { PredictedScore } from "../types";

export async function fetchPrediction(movieId: string): Promise<PredictedScore> {
  const res = await apiClient.get(API_CONFIG.ENDPOINTS.PREDICT, {
    params: { movieId },
  });
  return res.data.data;
}
