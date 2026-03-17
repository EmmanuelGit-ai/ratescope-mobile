/**
 * Compute Aggregated Scores
 *
 * Reads all movies from Supabase, computes weighted aggregated scores
 * using the methodology in docs/RATING_METHODOLOGY.md, and writes
 * results to the aggregated_scores table.
 *
 * Usage: npx tsx scripts/compute-scores.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env (or environment) for writes.
 * Falls back to SUPABASE_URL from .env or the hardcoded project URL.
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// --- Config ---

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://tbhntzndvtgyckwoblte.supabase.co";

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error(
    "ERROR: SUPABASE_SERVICE_ROLE_KEY is required.\n" +
      "Set it in .env or as an environment variable.\n" +
      "Example: SUPABASE_SERVICE_ROLE_KEY=eyJ... npx tsx scripts/compute-scores.ts"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Source weights (from docs/RATING_METHODOLOGY.md) ---

type RatingSource =
  | "IMDB"
  | "RT_CRITIC"
  | "RT_AUDIENCE"
  | "METACRITIC"
  | "LETTERBOXD"
  | "BOX_OFFICE";

const SOURCE_WEIGHTS: Record<RatingSource, number> = {
  IMDB: 0.25,
  RT_CRITIC: 0.2,
  METACRITIC: 0.2,
  LETTERBOXD: 0.15,
  RT_AUDIENCE: 0.1,
  BOX_OFFICE: 0.1,
};

// Normalization: convert each source's raw score to a 0-5 scale
const NORMALIZATION: Record<RatingSource, (raw: number) => number> = {
  IMDB: (raw) => raw / 2, // 0-10 → 0-5
  RT_CRITIC: (raw) => raw / 20, // 0-100 → 0-5
  METACRITIC: (raw) => raw / 20, // 0-100 → 0-5
  LETTERBOXD: (raw) => raw, // 0.5-5.0 → already 0-5
  RT_AUDIENCE: (raw) => raw / 20, // 0-100 → 0-5
  BOX_OFFICE: (raw) => raw / 20, // percentile 0-100 → 0-5
};

// Confidence tiers based on source count
function getConfidenceTier(sourceCount: number): string {
  if (sourceCount >= 5) return "high";
  if (sourceCount >= 3) return "medium";
  return "limited";
}

// --- Main ---

interface RatingRow {
  movie_id: string;
  source_name: string;
  score: number;
  normalized_score: number | null;
}

interface MovieRow {
  id: string;
  title: string;
}

async function computeScores() {
  console.log("=== RateScope Score Computation ===\n");
  console.log(`Supabase URL: ${SUPABASE_URL}`);

  // 1. Fetch all movies
  console.log("\nFetching movies...");
  const { data: movies, error: moviesError } = await supabase
    .from("movies")
    .select("id, title")
    .order("title");

  if (moviesError) {
    console.error("Failed to fetch movies:", moviesError.message);
    process.exit(1);
  }

  if (!movies || movies.length === 0) {
    console.log("No movies found. Nothing to compute.");
    return;
  }

  console.log(`Found ${movies.length} movies.\n`);

  // 2. Fetch all rating sources in one query
  console.log("Fetching rating sources...");
  const { data: allRatings, error: ratingsError } = await supabase
    .from("rating_sources")
    .select("movie_id, source_name, score, normalized_score");

  if (ratingsError) {
    console.error("Failed to fetch ratings:", ratingsError.message);
    process.exit(1);
  }

  // Group ratings by movie_id
  const ratingsByMovie = new Map<string, RatingRow[]>();
  for (const r of allRatings ?? []) {
    const existing = ratingsByMovie.get(r.movie_id as string) ?? [];
    existing.push(r as RatingRow);
    ratingsByMovie.set(r.movie_id as string, existing);
  }

  console.log(
    `Found ${(allRatings ?? []).length} rating rows across ${ratingsByMovie.size} movies.\n`
  );

  // 3. Compute scores
  let updated = 0;
  let skipped = 0;

  for (const movie of movies as MovieRow[]) {
    const ratings = ratingsByMovie.get(movie.id) ?? [];

    if (ratings.length === 0) {
      console.log(`  [SKIP] "${movie.title}" — no rating sources`);
      skipped++;
      continue;
    }

    // Compute weighted aggregated score
    const availableSources: { source: RatingSource; normalized: number; weight: number }[] = [];

    for (const r of ratings) {
      const source = r.source_name as RatingSource;
      const weight = SOURCE_WEIGHTS[source];
      if (weight == null) {
        console.log(`  [WARN] Unknown source "${r.source_name}" for "${movie.title}", skipping`);
        continue;
      }

      // Use existing normalized_score if present, otherwise normalize raw score
      const normalizeFn = NORMALIZATION[source];
      const normalized = r.normalized_score ?? normalizeFn(r.score);
      availableSources.push({ source, normalized, weight });
    }

    if (availableSources.length === 0) {
      console.log(`  [SKIP] "${movie.title}" — no valid sources`);
      skipped++;
      continue;
    }

    // Redistribute weights proportionally among available sources
    const totalAvailableWeight = availableSources.reduce((sum, s) => sum + s.weight, 0);
    let weightedSum = 0;
    for (const s of availableSources) {
      const adjustedWeight = s.weight / totalAvailableWeight;
      weightedSum += s.normalized * adjustedWeight;
    }

    // Round to 1 decimal
    const starRating = Math.round(weightedSum * 10) / 10;
    const finalScore = Math.round(starRating * 2 * 10) / 10; // 0-10 scale
    const sourceCount = availableSources.length;
    const confidence = getConfidenceTier(sourceCount);

    // 4. Upsert into aggregated_scores
    const { error: upsertError } = await supabase
      .from("aggregated_scores")
      .upsert(
        {
          movie_id: movie.id,
          final_score: finalScore,
          star_rating: starRating,
          confidence,
          source_count: sourceCount,
          calculated_at: new Date().toISOString(),
        },
        { onConflict: "movie_id" }
      );

    if (upsertError) {
      console.error(`  [ERROR] "${movie.title}": ${upsertError.message}`);
      continue;
    }

    console.log(
      `  [OK] "${movie.title}" — ` +
        `${starRating.toFixed(1)}/5 (${finalScore.toFixed(1)}/10) · ` +
        `${sourceCount} source${sourceCount !== 1 ? "s" : ""} · ${confidence}`
    );
    updated++;
  }

  // 5. Summary
  console.log("\n=== Done ===");
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total:   ${movies.length}`);
}

computeScores().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
