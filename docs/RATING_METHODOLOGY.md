# RateScope Rating Methodology

## The Five-Star Aggregated Score

NOT a simple average. Weighted, normalized aggregation from multiple authoritative sources.

## Source Weights and Normalization

| Source | Weight | Original Scale | Normalization |
|--------|--------|----------------|---------------|
| IMDb | 25% | 1-10 | raw / 2 |
| Rotten Tomatoes (Critics) | 20% | 0-100% | raw / 20 |
| Metacritic | 20% | 0-100 | raw / 20 |
| Letterboxd | 15% | 0.5-5.0 | use directly |
| RT Audience Score | 10% | 0-100% | raw / 20 |
| Box Office/Streaming | 10% | relative | percentile / 20 |

## Missing Data Handling

When a source is unavailable, redistribute its weight proportionally:
  adjustedWeight = originalWeight / sumOfAvailableWeights

Example: If Letterboxd (15%) is missing, remaining 85% becomes new 100%:
  IMDb: 25/85 = 29.4%, RT: 20/85 = 23.5%, etc.

## Confidence Tiers

- High (5-6 sources): Full confidence, show score as-is
- Medium (3-4 sources): Show with "Based on X sources" note
- Limited (1-2 sources): Show with "Limited data" warning badge

## Score Display Rules

- Format: X.X / 5.0 (one decimal place, e.g., 4.2 not 4.23)
- Color coding:
  - >= 4.0: green (#1B7A4D)
  - >= 3.0: amber (#D97706)
  - < 3.0: red (#DC2626)
- Labels:
  - 4.5+ "Exceptional"
  - 4.0+ "Excellent"
  - 3.5+ "Great"
  - 3.0+ "Good"
  - 2.5+ "Average"
  - 2.0+ "Below Average"
  - < 2.0 "Poor"

## Aggregation Algorithm (TypeScript reference)

function calculateAggregatedScore(ratings):
  1. For each rating, normalize rawScore to 0-5 scale using source config
  2. Sum available weights to get totalAvailableWeight
  3. For each source: adjustedWeight = source.weight / totalAvailableWeight
  4. weightedSum = sum(normalizedScore * adjustedWeight)
  5. fiveStarScore = round(weightedSum, 1 decimal)
  6. confidence = min(100, (sourcesAvailable / 6) * 120)
  7. Return { fiveStarScore, confidence, dataCompleteness, sourcesAvailable, sourceBreakdown }

## Source Breakdown Display

Always show each source's contribution visually:
- Horizontal bar per source, width proportional to normalized score (0-5)
- Show original score in source's native format (e.g., "8.2/10" for IMDb)
- Show weight percentage next to source name
- Order by weight (IMDb first, Box Office last)

This transparency is critical for user trust — no other platform shows the math.

## Future: Regret Prevention Score
Predicts post-viewing satisfaction using: completion rates, rewatch rates, audience sentiment delta (expectation vs reality). Phase 2 feature.
