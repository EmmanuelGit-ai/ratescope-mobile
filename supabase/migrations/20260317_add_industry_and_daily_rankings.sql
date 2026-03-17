-- Migration: Add industry support and daily rankings
-- Date: 2026-03-17

-- 1. Add industry columns to movies table
ALTER TABLE movies
  ADD COLUMN IF NOT EXISTS industry TEXT DEFAULT 'other',
  ADD COLUMN IF NOT EXISTS original_language TEXT,
  ADD COLUMN IF NOT EXISTS production_countries TEXT[];

-- Add check constraint for industry values
ALTER TABLE movies
  ADD CONSTRAINT movies_industry_check CHECK (
    industry IN ('hollywood', 'nollywood', 'bollywood', 'korean', 'chinese', 'anime', 'european', 'latin_american', 'other')
  );

-- Index for industry filtering
CREATE INDEX IF NOT EXISTS idx_movies_industry ON movies (industry);

-- 2. Create daily_rankings table
CREATE TABLE IF NOT EXISTS daily_rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id UUID NOT NULL REFERENCES movies (id) ON DELETE CASCADE,
  rank_date DATE NOT NULL DEFAULT CURRENT_DATE,
  global_rank INTEGER NOT NULL,
  industry_rank INTEGER NOT NULL,
  industry TEXT NOT NULL,
  daily_score FLOAT NOT NULL,
  popularity_velocity FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint: one ranking per movie per day
ALTER TABLE daily_rankings
  ADD CONSTRAINT daily_rankings_movie_date_unique UNIQUE (movie_id, rank_date);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_daily_rankings_date ON daily_rankings (rank_date);
CREATE INDEX IF NOT EXISTS idx_daily_rankings_industry ON daily_rankings (rank_date, industry);
CREATE INDEX IF NOT EXISTS idx_daily_rankings_global ON daily_rankings (rank_date, global_rank);

-- 3. Enable RLS with public read access
ALTER TABLE daily_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_rankings_public_read"
  ON daily_rankings
  FOR SELECT
  TO anon, authenticated
  USING (true);
