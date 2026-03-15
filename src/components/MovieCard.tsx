// MovieCard — Poster + title + star rating + year + genres
// Tappable card that navigates to movie detail screen

import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StarRating } from "./StarRating";
import {
  colors,
  fontSize,
  fontWeight,
  spacing,
  borderRadius,
} from "../constants/theme";
import type { MovieWithScores } from "../types";

interface MovieCardProps {
  movie: MovieWithScores;
}

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
const POSTER_WIDTH = 120;
const POSTER_HEIGHT = 180;
const BLURHASH = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

export function MovieCard({ movie }: MovieCardProps) {
  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  const posterUri = movie.posterPath
    ? `${TMDB_IMAGE_BASE}/w342${movie.posterPath}`
    : null;

  const genreNames = movie.genres?.slice(0, 2).map((g) => g.name) ?? [];
  const score = movie.aggregatedScore?.fiveStarScore;

  return (
    <Link href={`/movie/${movie.id}`} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
        accessibilityLabel={`${movie.title}${score ? `, rated ${score.toFixed(1)} out of 5` : ""}`}
      >
        {posterUri ? (
          <Image
            source={{ uri: posterUri }}
            style={styles.poster}
            placeholder={{ blurhash: BLURHASH }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.poster, styles.posterPlaceholder]}>
            <Text style={styles.posterPlaceholderText}>No Poster</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {movie.title}
          </Text>

          <View style={styles.meta}>
            {year && <Text style={styles.year}>{year}</Text>}
            {genreNames.length > 0 && (
              <Text style={styles.genres} numberOfLines={1}>
                {genreNames.join(" · ")}
              </Text>
            )}
          </View>

          {score != null && <StarRating score={score} size="sm" />}

          {movie.overview && (
            <Text style={styles.overview} numberOfLines={2}>
              {movie.overview}
            </Text>
          )}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface.card,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  cardPressed: {
    backgroundColor: colors.surface.hover,
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
  },
  posterPlaceholder: {
    backgroundColor: colors.surface.hover,
    alignItems: "center",
    justifyContent: "center",
  },
  posterPlaceholderText: {
    color: colors.text.muted,
    fontSize: fontSize.xs,
  },
  info: {
    flex: 1,
    padding: spacing.md,
    justifyContent: "center",
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  year: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: fontWeight.medium,
  },
  genres: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    flexShrink: 1,
  },
  overview: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
});
