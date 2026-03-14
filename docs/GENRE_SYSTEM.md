# RateScope Genre Rating System

## Movie Genres (MVP Phase 1)

Each genre has custom rating criteria. A great action movie succeeds for different reasons than a great drama.

| Genre | Avg Rating | Market Share | Demand | Key Rating Criteria |
|-------|-----------|-------------|--------|-------------------|
| Drama | 4.0/5 | 18% | High | Narrative depth, acting, emotional impact, cinematography |
| Action | 3.0/5 | 16% | Medium | Spectacle, choreography, stakes, practical vs CGI balance |
| Comedy | 3.0/5 | 15% | Medium | Humor consistency, cultural relevance, rewatchability, writing |
| Thriller | 4.0/5 | 14% | High | Tension, plot construction, pacing, twist quality |
| Sci-Fi | 4.0/5 | 12% | High | Innovation, world-building, VFX quality, concept originality |
| Animation | 4.0/5 | 10% | High | Artistic merit, storytelling, family appeal, animation quality |
| Horror | 3.0/5 | 8% | Medium | Atmosphere, originality, scares vs gore ratio, psychological depth |
| Romance | 3.0/5 | 6% | Medium | Chemistry, emotional authenticity, dialogue, narrative freshness |
| Documentary | 5.0/5 | 3% | Low | Research depth, storytelling craft, impact, access, objectivity |
| Musical | 4.0/5 | 2% | Low | Music quality, integration with narrative, performance, choreography |

## Genre-Specific Notes

- Drama: strongest average critical scores across all platforms
- Comedy: widest critic-audience gap (critics score lower than audiences)
- Horror: most polarizing. Elevated horror (A24) scores well, generic slashers do not
- Documentary: highest average critic score but lowest viewership volume
- Animation: benefits from Pixar/Ghibli quality lift across the genre
- Action: highly franchise-dependent. Standalone action films score lower
- Sci-Fi: high innovation premium. VFX quality heavily weights the score

## TMDb Genre IDs (for API filtering)

28=Action, 12=Adventure, 16=Animation, 35=Comedy, 80=Crime, 99=Documentary, 18=Drama, 10751=Family, 14=Fantasy, 36=History, 27=Horror, 10402=Music, 9648=Mystery, 10749=Romance, 878=Sci-Fi, 10770=TV Movie, 53=Thriller, 10752=War, 37=Western

## Mood-to-Genre Mappings (10 Moods)

| Mood | Label | Genre IDs | Use Case |
|------|-------|-----------|---------|
| thrilling | Something Thrilling | 28, 53, 80 | Heart-pounding suspense |
| heartwarming | Something Heartwarming | 18, 10749, 10751 | Stories that warm the soul |
| mind-bending | Something Mind-Bending | 878, 9648, 53 | Twists that keep you thinking |
| laugh-out-loud | Something Funny | 35, 10751 | Guaranteed laughs |
| edge-of-seat | Edge of My Seat | 27, 53, 9648 | Tension you can cut with a knife |
| cozy | Something Cozy | 16, 10751, 35 | Comfort viewing |
| epic | Something Epic | 12, 14, 36 | Grand scale stories |
| dark | Something Dark | 80, 53, 27 | Gritty, intense, no sugarcoating |
| inspiring | Something Inspiring | 18, 36, 99 | Stories that move and motivate |
| nostalgic | A Classic | 12, 35, 878 | Timeless films worth revisiting |

## Time-Budget Filtering (4 Tiers)

| Tier | Label | Runtime |
|------|-------|---------|
| 1 | Quick Watch | 0-90 min |
| 2 | Standard | 90-120 min |
| 3 | Long Film | 120-150 min |
| 4 | Epic | 150+ min |

## Five-Star Quality Classification

| Stars | Label | Description |
|-------|-------|------------|
| 5 | MASTERPIECE | Exceptional across all criteria. Must-watch. Top 5% |
| 4 | EXCELLENT | High quality with minor flaws. Strongly recommended |
| 3 | SOLID | Good entertainment. Enjoyable but not outstanding |
| 2 | BELOW AVERAGE | Noticeable issues. Only for dedicated fans |
| 1 | POOR | Significant quality issues. Generally not recommended |

## Music Genres (Phase 2 Reference - NOT in MVP)

Hip-Hop/Rap (4/5, dominant streaming), Pop (3/5, widest reach), R&B/Soul (4/5, critical darling), Rock (4/5, enduring), Electronic (3/5, production-quality driven), Afrobeats (4/5, fastest-growing global genre), Country (3/5, strong regional loyalty), Classical (5/5, highest critical rating)
