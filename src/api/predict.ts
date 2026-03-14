// Prediction API Service — Supabase queries

import { supabase, handleSupabaseError } from "./client";
import type { PredictedScore, ModifierScore } from "../types";

export async function fetchPrediction(movieId: string): Promise<PredictedScore> {
  const { data, error } = await supabase
    .from("predictions")
    .select("predicted_score, confidence_interval, modifier_breakdown, model_version, predicted_at")
    .eq("movie_id", movieId)
    .single();

  if (error) handleSupabaseError(error);

  return {
    predictedScore: data.predicted_score as number,
    confidenceInterval: data.confidence_interval as { low: number; high: number },
    modifierBreakdown: data.modifier_breakdown as ModifierScore[],
    modelVersion: data.model_version as string,
    predictedAt: data.predicted_at as string,
  };
}
