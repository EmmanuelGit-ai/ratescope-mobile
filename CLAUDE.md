# RateScope Mobile

Movie rating aggregation app. Founder: Emmanuel Egbuche.
Aggregates IMDb, Rotten Tomatoes, Metacritic, Letterboxd into one five-star score.
Predicts movie quality using 12 AI modifiers before reviews exist.

## Commands

- `npx expo start` — dev server (press `a` for Android)
- `npx expo lint` — lint check
- `npx expo install <pkg>` — install Expo-compatible packages
- `eas build --platform android` — production Android build
- `eas submit --platform android` — submit to Google Play

## Tech Stack

- React Native + Expo SDK 55 (Expo Router for file-based navigation)
- TypeScript strict mode
- @tanstack/react-query for server state
- Axios for HTTP
- react-native-mmkv for local storage
- @shopify/flash-list for performant lists
- expo-image for cached images with blurhash
- lucide-react-native for icons

## Architecture

```
CLAUDE.md                     <- you are here
docs/                         <- detailed specs (read when needed)
  BUSINESS_CONTEXT.md         <- WHY we exist: market data, competitors, decision fatigue stats
  RATING_METHODOLOGY.md       <- scoring algorithm, weights, normalization
  PREDICTION_ENGINE.md        <- 12 modifiers, ML model, API format
  ARCHITECTURE.md             <- full data flow, API contracts, schema
  GENRE_SYSTEM.md             <- 10 genres with criteria, market share, mood mappings
  MVP_ROADMAP.md              <- timeline, budget, Phase 1/2/3 features, growth milestones
app/                          <- Expo Router screens
  _layout.tsx                 <- root layout (tab navigator)
  (tabs)/index.tsx            <- Home (trending + search)
  (tabs)/discover.tsx         <- Mood-based discovery
  (tabs)/search.tsx           <- Search movies
  (tabs)/profile.tsx          <- Settings/profile
  movie/[id].tsx              <- Movie detail (scores + prediction)
  genre/[id].tsx              <- Genre listing
src/
  api/client.ts               <- Axios instance + interceptors
  api/movies.ts               <- movie endpoints
  api/ratings.ts              <- score endpoints
  api/predict.ts              <- prediction endpoints
  components/                 <- shared UI components
  constants/theme.ts          <- colors, spacing, typography
  constants/moods.ts          <- mood-to-genre mappings
  hooks/                      <- React Query hooks
  types/index.ts              <- all TypeScript interfaces
```

## Code Style

- TypeScript strict, no `any` types
- Functional components only, with hooks
- Named exports (not default) for components and hooks
- StyleSheet.create for all styles — no inline style objects
- NEVER use Tailwind/NativeWind — use React Native StyleSheet only
- Colors, spacing, fonts ALWAYS from `src/constants/theme.ts` — never hardcode
- API calls ONLY through `src/api/` — never fetch directly from screens
- Types ONLY from `src/types/index.ts` — one source of truth

## Core Business Logic

The five-star score uses weighted normalization: IMDb 25%, RT Critics 20%, Metacritic 20%, Letterboxd 15%, RT Audience 10%, Box Office 10%. Missing sources redistribute weight proportionally. See @docs/RATING_METHODOLOGY.md for full algorithm.

12 predictive modifiers (Star Power, Director Track Record, Budget Ratio, Genre Momentum, Social Buzz, Sequel Factor, Trailer Engagement, Release Timing, Early Signals, Cultural Relevance, Streaming Factor, Production Quality) each scored 0-1, weighted to produce predicted five-star score. See @docs/PREDICTION_ENGINE.md for all weights and data sources.

## UI Rules

- Five-star score is the HERO element — large and prominent everywhere
- Score colors: >= 4.0 green (#1B7A4D), >= 3.0 amber (#D97706), < 3.0 red (#DC2626)
- Dark theme ONLY (surface: #0F172A, cards: #1E293B, border: #475569)
- Source breakdown always visible on detail screen — transparency builds trust
- Skeleton loaders during ALL fetches — never blank screens
- Bottom tab navigation: Home, Discover, Search, Profile
- Minimum 48x48dp touch targets on all interactive elements

## API Connection

Connects to RateScope web API. All endpoints return:
```json
{ "success": true, "data": {}, "meta": { "page": 1, "total": 100, "cached": false } }
```
Error format: `{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." } }`

## Important

- NEVER commit .env or API keys
- NEVER use console.log — use a logger utility or remove before commit
- All images through expo-image with placeholder blurhash
- Cache API responses with React Query (staleTime: 6 hours)
- Test on Android first — iOS is Phase 2
- See @docs/ARCHITECTURE.md for database schema and full data flow
- See @docs/BUSINESS_CONTEXT.md for market research, competitors, and WHY decisions were made
- See @docs/GENRE_SYSTEM.md for genre criteria, market share, and mood mappings
- See @docs/MVP_ROADMAP.md for timeline, budget, and what NOT to build yet
