# RateScope Architecture Reference

## What Problem We Solve
Viewers waste 25 min/week choosing movies (NOW UK Study). 49% give up entirely. 110 hours/year lost.
RateScope eliminates this with one aggregated score + AI predictions.

## Data Flow
1. TMDb API provides movie metadata (title, cast, genres, poster, release date, budget)
2. OMDb API provides scores (IMDb rating, RT critic %, RT audience %, Metacritic)
3. Aggregation engine normalizes all scores to 0-5 scale, applies weights, outputs single five-star score
4. Prediction engine (12 modifiers) produces predicted score for upcoming movies
5. Mobile app fetches via REST API, caches with React Query, displays with score components

## API Endpoints (RateScope Web Backend)

Base URL: configured in src/constants/api.ts

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/movies | GET | List movies. Params: page, limit, genre, sort, search |
| /api/movies/[id] | GET | Single movie with scores + prediction |
| /api/ratings?movieId=x | GET | Aggregated score breakdown for a movie |
| /api/predict?movieId=x | GET | AI prediction with 12-modifier breakdown |
| /api/movies/trending | GET | Trending movies this week |
| /api/movies/discover | GET | Mood-based results. Params: mood, maxRuntime |

## Response Contract

Success: { success: true, data: T, meta?: { page, total, cached } }
Error: { success: false, error: { code: string, message: string } }

## Database Schema (Backend Reference)

Movies: tmdb_id, imdb_id, title, overview, release_date, runtime, budget, revenue, genres (JSON), cast_ids (JSON), director_name, poster_path, backdrop_path, popularity, status

Ratings: movie_id (FK), source (IMDB|RT_CRITIC|RT_AUDIENCE|METACRITIC|LETTERBOXD|BOX_OFFICE), raw_score, normalized_score, vote_count, fetched_at

AggregatedScores: movie_id (FK unique), five_star_score, confidence, data_completeness, sources_available, source_breakdown (JSON), last_calculated

PredictedScores: movie_id (FK unique), predicted_score, confidence_interval (JSON), modifier_breakdown (JSON), model_version, predicted_at

## Mobile Screen Map

- Home Tab -> Trending list (FlashList) + Search bar -> tap card -> Movie Detail
- Discover Tab -> Mood grid -> tap mood -> filtered results + time budget picker
- Search Tab -> debounced search (300ms) -> results list -> tap -> Movie Detail
- Profile Tab -> settings, about, cache management
- Movie Detail -> hero poster + score + source breakdown accordion + prediction breakdown + cast scroll

## Component Hierarchy

App (_layout.tsx)
  TabNavigator
    HomeScreen
      SearchBar
      MovieList (FlashList)
        MovieCard (poster + title + StarRating + year + genres)
    DiscoverScreen
      MoodSelector (emoji grid)
      TimeBudgetPicker (horizontal buttons)
      MovieList
    SearchScreen
      SearchInput (debounced)
      MovieList
    ProfileScreen
  MovieDetailScreen (movie/[id].tsx)
    HeroPoster (parallax)
    ScoreSection
      StarRating (hero size)
      ScoreBreakdown (6 source bars)
    PredictionSection
      PredictionBreakdown (12 modifier bars)
    CastSection (horizontal scroll)
  GenreScreen (genre/[id].tsx)
    MovieList (filtered by genre)

## Performance Targets
- App launch to content: < 2 seconds
- Screen transitions: < 300ms
- API cache: staleTime 6 hours via React Query
- Images: expo-image with blurhash placeholders
- Lists: FlashList with estimatedItemSize for recycling
