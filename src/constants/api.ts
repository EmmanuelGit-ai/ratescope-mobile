// API Configuration
// Change BASE_URL to point to your deployed RateScope web backend

export const API_CONFIG = {
  // For local development with web backend running
  BASE_URL: "http://localhost:3000",

  // Endpoints
  ENDPOINTS: {
    MOVIES: "/api/movies",
    MOVIE_DETAIL: (id: string) => `/api/movies/${id}`,
    RATINGS: "/api/ratings",
    PREDICT: "/api/predict",
    TRENDING: "/api/movies?sort=popularity&limit=20",
    DISCOVER: "/api/movies/discover",
  },

  // Cache durations (milliseconds)
  CACHE: {
    STALE_TIME: 6 * 60 * 60 * 1000,  // 6 hours
    GC_TIME: 12 * 60 * 60 * 1000,    // 12 hours
  },

  // Timeouts
  TIMEOUT: 10000, // 10 seconds
};
