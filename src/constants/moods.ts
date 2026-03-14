// Mood-to-Genre Mappings
// TMDb genre IDs: https://developer.themoviedb.org/reference/genre-movie-list

import { MoodMapping, TimeBudget } from "../types";

export const MOOD_MAPPINGS: MoodMapping[] = [
  { mood: "thrilling", label: "Something Thrilling", emoji: "\u26A1", genreIds: [28, 53, 80], description: "Heart-pounding action and suspense" },
  { mood: "heartwarming", label: "Something Heartwarming", emoji: "\u2764\uFE0F", genreIds: [18, 10749, 10751], description: "Stories that warm the soul" },
  { mood: "mind-bending", label: "Something Mind-Bending", emoji: "\uD83E\uDDE0", genreIds: [878, 9648, 53], description: "Twists that keep you thinking" },
  { mood: "laugh-out-loud", label: "Something Funny", emoji: "\uD83D\uDE02", genreIds: [35, 10751], description: "Guaranteed laughs and good vibes" },
  { mood: "edge-of-seat", label: "Edge of My Seat", emoji: "\uD83D\uDE31", genreIds: [27, 53, 9648], description: "Tension you can cut with a knife" },
  { mood: "cozy", label: "Something Cozy", emoji: "\u2615", genreIds: [16, 10751, 35], description: "Comfort viewing at its finest" },
  { mood: "epic", label: "Something Epic", emoji: "\u2694\uFE0F", genreIds: [12, 14, 36], description: "Grand scale, sweeping stories" },
  { mood: "dark", label: "Something Dark", emoji: "\uD83C\uDF11", genreIds: [80, 53, 27], description: "Gritty, intense, no sugarcoating" },
  { mood: "inspiring", label: "Something Inspiring", emoji: "\u2728", genreIds: [18, 36, 99], description: "Stories that move and motivate" },
  { mood: "nostalgic", label: "A Classic", emoji: "\uD83C\uDFAC", genreIds: [12, 35, 878], description: "Timeless films worth revisiting" },
];

export const TIME_BUDGETS: TimeBudget[] = [
  { label: "Quick Watch", minMinutes: 0, maxMinutes: 90 },
  { label: "Standard", minMinutes: 90, maxMinutes: 120 },
  { label: "Long Film", minMinutes: 120, maxMinutes: 150 },
  { label: "Epic", minMinutes: 150, maxMinutes: 999 },
];
