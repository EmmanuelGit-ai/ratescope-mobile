/**
 * Daily Rankings
 *
 * Fetches today's trending movies from TMDb, combines popularity
 * velocity (40%) with aggregated star_rating (60%) to produce
 * daily_score, then generates global and per-industry rankings.
 *
 * Usage: npx tsx scripts/daily-rankings.ts
 * Requires: SUPABASE_SERVICE_ROLE_KEY and TMDB_API_KEY in .env
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// --- Config ---

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://tbhntzndvtgyckwoblte.supabase.co";

const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!SUPABASE_KEY) {
  console.error("ERROR: SUPABASE_SERVICE_ROLE_KEY is required in .env");
  process.exit(1);
}

if (!TMDB_API_KEY) {
  console.error("ERROR: TMDB_API_KEY is required in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const TMDB_BASE = "https://api.themoviedb.org/3";

// --- Types ---

interface TmdbTrendingResult {
  id: number;
  title: string;
  popularity: number;
}

interface MovieWithScore {
  id: string;
  tmdb_id: number;
  title: string;
  popularity: number | null;
  industry: string | null;
  star_rating: number | null;
}

interface RankedMovie {
  movieId: string;
  tmdbId: number;
  title: string;
  industry: string;
  dailyScore: number;
  popularityVelocity: number;
}

// --- Main ---

async function fetchTmdbTrending(): Promise<TmdbTrendingResult[]> {
  const results: TmdbTrendingResult[] = [];

  // Fetch up to 3 pages (60 movies) from TMDb trending
  for (let page = 1; page <= 3; page++) {
    const url = `${TMDB_BASE}/trending/movie/day?api_key=${TMDB_API_KEY}&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`TMDb trending ${res.status}: ${res.statusText}`);
    const data = (await res.json()) as { results: TmdbTrendingResult[] };
    results.push(...data.results);
  }

  return results;
}

async function generateRankings() {
  console.log("=== RateScope Daily Rankings ===\n");

  const today = new Date().toISOString().split("T")[0];
  console.log(`Rank date: ${today}\n`);

  // 1. Fetch trending from TMDb
  console.log("Fetching TMDb trending/movie/day...");
  const trending = await fetchTmdbTrending();
  console.log(`Got ${trending.length} trending movies from TMDb.\n`);

  // Build tmdb_id → popularity map (this is today's popularity)
  const tmdbPopularity = new Map<number, number>();
  for (const t of trending) {
    tmdbPopularity.set(t.id, t.popularity);
  }

  // 2. Get our movies that match trending TMDb IDs
  const tmdbIds = trending.map((t) => t.id);

  // Fetch movies with their aggregated scores and industry
  const { data: movies, error: moviesError } = await supabase
    .from("movies")
    .select(`
      id, tmdb_id, title, popularity, industry,
      aggregated_scores ( star_rating )
    `)
    .in("tmdb_id", tmdbIds);

  if (moviesError) {
    console.error("Failed to fetch movies:", moviesError.message);
    process.exit(1);
  }

  if (!movies || movies.length === 0) {
    console.log("No matching movies in our database. Seed more movies first.");
    return;
  }

  console.log(`Matched ${movies.length} movies in our database.\n`);

  // 3. Compute daily scores
  const ranked: RankedMovie[] = [];

  for (const movie of movies) {
    const tmdbId = movie.tmdb_id as number;
    const currentPopularity = tmdbPopularity.get(tmdbId) ?? 0;
    const previousPopularity = (movie.popularity as number) ?? 1;

    // Popularity velocity: how much popularity changed (ratio)
    const velocity = previousPopularity > 0
      ? currentPopularity / previousPopularity
      : currentPopularity;

    // Normalize velocity to 0-5 scale (cap at 5x growth = 5.0)
    const normalizedVelocity = Math.min(5, velocity);

    // Get star rating (0-5), default to 2.5 if no score
    const agg = movie.aggregated_scores as Record<string, unknown> | null;
    const starRating = (agg?.star_rating as number) ?? 2.5;

    // Daily score: 60% star_rating + 40% velocity
    const dailyScore = Math.round((starRating * 0.6 + normalizedVelocity * 0.4) * 100) / 100;

    ranked.push({
      movieId: movie.id as string,
      tmdbId,
      title: movie.title as string,
      industry: (movie.industry as string) ?? "other",
      dailyScore,
      popularityVelocity: Math.round(velocity * 100) / 100,
    });
  }

  // 4. Sort by dailyScore descending for global ranking
  ranked.sort((a, b) => b.dailyScore - a.dailyScore);

  // Assign global ranks
  for (let i = 0; i < ranked.length; i++) {
    (ranked[i] as RankedMovie & { globalRank: number }).globalRank = i + 1;
  }

  // 5. Assign per-industry ranks
  const byIndustry = new Map<string, RankedMovie[]>();
  for (const m of ranked) {
    const list = byIndustry.get(m.industry) ?? [];
    list.push(m);
    byIndustry.set(m.industry, list);
  }

  const industryRanks = new Map<string, number>();
  for (const [industry, list] of byIndustry) {
    // Already sorted by dailyScore since ranked was sorted
    for (let i = 0; i < list.length; i++) {
      industryRanks.set(`${list[i].movieId}`, i + 1);
    }
    console.log(`  ${industry}: ${list.length} movies`);
  }

  // 6. Delete existing rankings for today (re-runnable)
  const { error: deleteError } = await supabase
    .from("daily_rankings")
    .delete()
    .eq("rank_date", today);

  if (deleteError) {
    console.error("Failed to clear today's rankings:", deleteError.message);
    process.exit(1);
  }

  // 7. Insert rankings
  console.log("\nInserting rankings...");
  const rows = ranked.map((m, i) => ({
    movie_id: m.movieId,
    rank_date: today,
    global_rank: i + 1,
    industry_rank: industryRanks.get(m.movieId) ?? 1,
    industry: m.industry,
    daily_score: m.dailyScore,
    popularity_velocity: m.popularityVelocity,
  }));

  const { error: insertError } = await supabase
    .from("daily_rankings")
    .insert(rows);

  if (insertError) {
    console.error("Failed to insert rankings:", insertError.message);
    process.exit(1);
  }

  // 8. Update movie popularity with today's TMDb value
  console.log("Updating movie popularity...");
  for (const m of ranked) {
    const newPop = tmdbPopularity.get(m.tmdbId);
    if (newPop != null) {
      await supabase
        .from("movies")
        .update({ popularity: newPop })
        .eq("id", m.movieId);
    }
  }

  // 9. Print top 10
  console.log("\n=== Global Top 10 ===");
  for (let i = 0; i < Math.min(10, ranked.length); i++) {
    const m = ranked[i];
    console.log(
      `  #${i + 1} "${m.title}" — score: ${m.dailyScore} · velocity: ${m.popularityVelocity}x · ${m.industry}`
    );
  }

  console.log(`\n=== Done === (${ranked.length} movies ranked for ${today})`);
}

generateRankings().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
