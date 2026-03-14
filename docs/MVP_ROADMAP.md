# RateScope MVP Roadmap

## Phase 1: Movies-Only MVP (Months 1-5)

### MVP Features (Must Build)

1. Five-star aggregated score from 6 sources (IMDb, RT Critics, RT Audience, Metacritic, Letterboxd, Box Office)
2. Score breakdown showing each source contribution (transparency is our moat)
3. Movie detail pages with poster, metadata, cast, score
4. Trending movies feed (home screen)
5. Search with debounced input (300ms)
6. Genre browsing and filtering
7. Mood-based discovery (10 moods mapped to genre clusters)
8. Time-budget filtering (4 runtime tiers)
9. 12-modifier AI prediction for upcoming movies
10. Prediction breakdown showing individual modifier scores
11. Dark theme only (cinema aesthetic)
12. Skeleton loaders and smooth loading states

### NOT in MVP (Phase 2+)

- User accounts / authentication
- Push notifications
- Social features / sharing
- Music integration
- Group Decision Engine
- Regret Prevention Score
- Rating Momentum Tracking
- Cross-Cultural Normalization
- Offline-first architecture
- iOS app (Android first)
- User reviews / community ratings
- Watchlist

### Development Timeline (16 Weeks)

Week 1-2: Project setup, data pipeline, seed DB with 100+ movies from TMDb
Week 3-4: Aggregation engine live, test with real data, fix normalization edge cases
Week 5-6: Frontend screens (home, movie detail, search), connect to API
Week 7-8: Mood discovery, time-budget filtering, genre browsing
Week 9-10: Polish UI, responsive design, loading states, error handling
Week 11-12: Prediction engine (train Python model on historical data)
Week 13-14: Integration testing, beta with 10-20 users, iterate
Week 15-16: Final polish, Google Play submission, launch

### Budget Estimate

- Hosting (Vercel/Railway): 0-20 USD/month
- TMDb API: Free (with attribution)
- OMDb API: Free tier (1,000 req/day) or 1 USD/month
- YouTube Data API: Free tier (10,000 units/day)
- Domain name: about 12 USD/year
- Google Play Store fee: 25 USD one-time
- Total lean MVP: 37-300 USD
- Full budget with freelance help: 3,500-14,400 USD

## Phase 2: Expansion (Months 6-10)

- Music rating integration (songs + albums)
- User accounts with taste profiles
- Watchlist and watch history
- Social features (share scores, follow users)
- Group Decision Engine
- Push notifications for predicted high-score releases
- iOS app
- Regret Prevention Score (beta)
- Rating Momentum Tracking

## Phase 3: Scale (Months 11-16)

- Cross-Cultural Rating Normalization
- Regional cinema coverage (Nollywood, Bollywood, Korean cinema)
- ML personalization (taste profile evolution)
- Pro subscription tier (4.99 USD/mo)
- B2B API revenue launch
- Affiliate partnerships with streaming platforms
- Target: 10,000+ users, first revenue

## Growth Milestones

- Month 1-2: MVP launch, 100+ seeded movies, aggregation working
- Month 3: 1,000 movies indexed, prediction engine beta
- Month 4-5: Public beta, target 500 users, iterate on UX
- Month 6: Stable v1.0, begin music Phase 2 research
- Month 8-10: Music integration, 5,000+ users
- Month 12: B2B API beta, first revenue

## Key Technical Decisions (and Why)

- Movies-only MVP: 82-90 pct prediction accuracy vs 60-75 pct for music; 15-30 movies/day vs 24,000 songs/day (800x volume); free APIs available
- React Native + Expo: cross-platform, matches founder experience, Expo handles Android builds
- Next.js web backend: server components for SEO, API routes serve mobile, Prisma for type-safe DB
- PostgreSQL: relational data (movies to ratings to scores), JSON columns for flexible metadata
- XGBoost + Random Forest ensemble: proven 82-90 pct accuracy, interpretable feature importance