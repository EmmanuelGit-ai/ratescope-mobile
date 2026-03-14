# RateScope Prediction Engine

## Purpose
Predict movie quality BEFORE comprehensive reviews exist using 12 data-driven modifiers.

## The 12 Predictive Modifiers

| # | Modifier | Weight | Data Sources |
|---|----------|--------|-------------|
| 1 | Star Power Index | 12% | TMDb person popularity + historical box office of top-5 cast |
| 2 | Director Track Record | 11% | Average Metacritic of last 5 films + consistency (low std dev = bonus) |
| 3 | Budget-to-Revenue Ratio | 10% | Budget percentile within genre + historical comparable analysis |
| 4 | Genre Momentum | 9% | Genre average score trend over last 6 months from TMDb trending |
| 5 | Social Media Buzz Velocity | 9% | Trailer view growth rate + social mention acceleration (YouTube + Reddit) |
| 6 | Sequel/Franchise Factor | 8% | Franchise score trajectory + fatigue curve position from TMDb collections |
| 7 | Trailer Engagement Score | 8% | YouTube views-to-likes ratio vs genre average + comment sentiment |
| 8 | Release Timing Optimizer | 7% | Holiday proximity + competing release density analysis |
| 9 | Critical Early Signals | 7% | Festival awards/nominations + early critic sentiment |
| 10 | Cultural Relevance Score | 7% | Topic timeliness + social conversation alignment |
| 11 | Streaming Platform Factor | 6% | Platform historical quality + marketing investment signals |
| 12 | Production Quality Index | 6% | Cinematographer + VFX house track records |

## Scoring

Each modifier scored 0.0 to 1.0, then:
  predictedScore = sum(modifier_score[i] * modifier_weight[i]) * 5.0

Result is 0-5 scale matching aggregated score format.

## Confidence Interval

- Low: predictedScore - 0.5
- High: predictedScore + 0.5
- Narrows as more modifiers have actual data

## Model Architecture (Backend Reference)

- XGBoost Regressor (primary, 60% ensemble weight)
- Random Forest Regressor (secondary, 40% ensemble weight)
- Training: historical movies with known aggregated scores
- Features: 12 modifier scores as input
- Target: actual five-star aggregated score
- Accuracy target: 82-90% within 0.5 stars

## API Response Format

GET /api/predict?movieId=xxx returns:
{
  "predictedScore": 4.2,
  "confidenceInterval": { "low": 3.7, "high": 4.7 },
  "modifierBreakdown": [
    { "name": "starPower", "label": "Star Power Index", "score": 0.85, "weight": 0.12, "contribution": 0.102 },
    { "name": "directorTrackRecord", "label": "Director Track Record", "score": 0.72, "weight": 0.11, "contribution": 0.079 },
    ...
  ],
  "modelVersion": "v1",
  "predictedAt": "2026-03-03T..."
}

## Mobile Display Rules

- Show composite predicted score as StarRating component (same as aggregated)
- Below it, show all 12 modifiers as labeled horizontal progress bars
- Each bar: modifier name | score (0.85) | visual bar filled to score proportion
- Color bars by score: >= 0.7 green, >= 0.4 amber, < 0.4 red
- Add "AI Predicted" badge to distinguish from aggregated score
- Show confidence interval as "+/- X.X" text below predicted score

## Transparency Principle

ALWAYS show individual modifier scores alongside composite prediction.
This is RateScope's competitive moat. No other platform shows WHY it predicts what it predicts.
