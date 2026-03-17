/**
 * Assign Industries
 *
 * Reads all movies from Supabase, fetches full details from TMDb
 * (original_language, production_countries), and auto-assigns an
 * industry classification.
 *
 * Usage: npx tsx scripts/assign-industries.ts
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

// Rate limiting: TMDb allows ~40 req/10s
const DELAY_MS = 260;
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Industry classification ---

type Industry =
  | "hollywood"
  | "nollywood"
  | "bollywood"
  | "korean"
  | "chinese"
  | "anime"
  | "european"
  | "latin_american"
  | "other";

const NOLLYWOOD_LANGUAGES = new Set(["yo", "ig", "ha"]);
const BOLLYWOOD_LANGUAGES = new Set(["hi", "ta", "te", "ml", "kn", "bn", "mr", "pa", "gu"]);
const CHINESE_LANGUAGES = new Set(["zh", "cn", "cmn", "yue"]);
const EUROPEAN_LANGUAGES = new Set([
  "fr", "de", "es", "it", "pt", "nl", "sv", "da", "no", "fi",
  "pl", "cs", "ro", "hu", "el", "bg", "hr", "sk", "sl", "uk",
  "tr", "is", "et", "lv", "lt", "ga", "ca", "eu", "gl",
]);
const LATIN_AMERICAN_COUNTRIES = new Set([
  "MX", "BR", "AR", "CO", "CL", "PE", "VE", "EC", "BO", "PY",
  "UY", "CR", "PA", "CU", "DO", "GT", "HN", "SV", "NI", "PR",
]);
const EUROPEAN_COUNTRIES = new Set([
  "FR", "DE", "ES", "IT", "PT", "NL", "SE", "DK", "NO", "FI",
  "PL", "CZ", "RO", "HU", "GR", "BG", "HR", "SK", "SI", "UA",
  "AT", "BE", "CH", "IE", "IS", "EE", "LV", "LT", "TR",
]);
const ENGLISH_SPEAKING = new Set(["US", "GB", "CA", "AU", "NZ", "IE"]);

interface TmdbMovieDetail {
  original_language: string;
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  genres: Array<{ id: number; name: string }>;
}

function classifyIndustry(
  lang: string,
  countries: string[],
  genreIds: number[]
): Industry {
  const isAnimation = genreIds.includes(16);

  // Japanese + Animation = anime
  if (lang === "ja" && isAnimation) return "anime";

  // Korean
  if (lang === "ko" || countries.includes("KR")) return "korean";

  // Nollywood: Nigerian languages or Nigeria
  if (NOLLYWOOD_LANGUAGES.has(lang) || countries.includes("NG")) return "nollywood";

  // Bollywood: Indian languages or India
  if (BOLLYWOOD_LANGUAGES.has(lang) || countries.includes("IN")) return "bollywood";

  // Chinese: Chinese languages or China/HK
  if (CHINESE_LANGUAGES.has(lang) || countries.includes("CN") || countries.includes("HK"))
    return "chinese";

  // Hollywood: English + US/UK/Canada/Australia
  if (lang === "en" && countries.some((c) => ENGLISH_SPEAKING.has(c))) return "hollywood";

  // Latin American: Spanish/Portuguese + Latin American countries
  if (
    (lang === "es" || lang === "pt") &&
    countries.some((c) => LATIN_AMERICAN_COUNTRIES.has(c))
  )
    return "latin_american";

  // European: European languages + European countries
  if (
    EUROPEAN_LANGUAGES.has(lang) &&
    countries.some((c) => EUROPEAN_COUNTRIES.has(c))
  )
    return "european";

  // Japanese non-animation
  if (lang === "ja") return "other";

  // English but not from English-speaking countries
  if (lang === "en") return "hollywood";

  return "other";
}

// --- Main ---

async function fetchTmdbDetails(tmdbId: number): Promise<TmdbMovieDetail | null> {
  const url = `${TMDB_BASE}/movie/${tmdbId}?api_key=${TMDB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`TMDb ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<TmdbMovieDetail>;
}

async function assignIndustries() {
  console.log("=== RateScope Industry Assignment ===\n");

  // 1. Fetch all movies
  const { data: movies, error } = await supabase
    .from("movies")
    .select("id, tmdb_id, title, genre_ids")
    .order("title");

  if (error) {
    console.error("Failed to fetch movies:", error.message);
    process.exit(1);
  }

  if (!movies || movies.length === 0) {
    console.log("No movies found.");
    return;
  }

  console.log(`Found ${movies.length} movies. Fetching TMDb details...\n`);

  let updated = 0;
  let skipped = 0;
  const industryCounts: Record<string, number> = {};

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const tmdbId = movie.tmdb_id as number;

    if (!tmdbId) {
      console.log(`  [SKIP] "${movie.title}" — no tmdb_id`);
      skipped++;
      continue;
    }

    // Fetch TMDb details
    let details: TmdbMovieDetail | null;
    try {
      details = await fetchTmdbDetails(tmdbId);
    } catch (err) {
      console.error(`  [ERROR] "${movie.title}" — TMDb fetch failed: ${err}`);
      skipped++;
      await sleep(DELAY_MS);
      continue;
    }

    if (!details) {
      console.log(`  [SKIP] "${movie.title}" — not found on TMDb`);
      skipped++;
      await sleep(DELAY_MS);
      continue;
    }

    const lang = details.original_language;
    const countries = details.production_countries.map((c) => c.iso_3166_1);
    const countryNames = details.production_countries.map((c) => c.name);
    const genreIds = (movie.genre_ids as number[]) ?? details.genres.map((g) => g.id);

    const industry = classifyIndustry(lang, countries, genreIds);

    // Update movie
    const { error: updateError } = await supabase
      .from("movies")
      .update({
        industry,
        original_language: lang,
        production_countries: countryNames,
      })
      .eq("id", movie.id);

    if (updateError) {
      console.error(`  [ERROR] "${movie.title}": ${updateError.message}`);
      skipped++;
    } else {
      industryCounts[industry] = (industryCounts[industry] ?? 0) + 1;
      console.log(
        `  [${i + 1}/${movies.length}] "${movie.title}" → ${industry} (${lang}, ${countries.join("/")})`
      );
      updated++;
    }

    await sleep(DELAY_MS);
  }

  // Summary
  console.log("\n=== Done ===");
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log("\nIndustry breakdown:");
  for (const [ind, count] of Object.entries(industryCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${ind}: ${count}`);
  }
}

assignIndustries().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
