// Movie Detail Screen — Scores + Cast + Source Breakdown

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Clock, Calendar, Film, User } from "lucide-react-native";
import { StarRating } from "../../src/components/StarRating";
import { useMovieDetail, useAggregatedScore } from "../../src/hooks/useMovies";
import {
  colors,
  fontSize,
  fontWeight,
  spacing,
  borderRadius,
  getScoreColor,
  getScoreLabel,
} from "../../src/constants/theme";
import type { CastMember, SourceRating } from "../../src/types";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
const BLURHASH = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: movie, isLoading, error } = useMovieDetail(id ?? "");
  const { data: scoreData } = useAggregatedScore(id ?? "");

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.brand.green} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !movie) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load movie details</Text>
        </View>
      </SafeAreaView>
    );
  }

  const backdropUri = movie.backdropPath
    ? `${TMDB_IMAGE_BASE}/w780${movie.backdropPath}`
    : null;
  const posterUri = movie.posterPath
    ? `${TMDB_IMAGE_BASE}/w342${movie.posterPath}`
    : null;
  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;
  const score = movie.aggregatedScore?.fiveStarScore;
  const genreNames = movie.genres?.map((g) => g.name).join(", ") ?? "";

  const sourceBreakdown = scoreData?.sourceBreakdown ?? [];

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero Backdrop */}
        {backdropUri ? (
          <Image
            source={{ uri: backdropUri }}
            style={styles.backdrop}
            placeholder={{ blurhash: BLURHASH }}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={[styles.backdrop, styles.backdropPlaceholder]} />
        )}

        {/* Poster + Title Row */}
        <View style={styles.headerRow}>
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
              <Film color={colors.text.muted} size={32} />
            </View>
          )}

          <View style={styles.headerInfo}>
            <Text style={styles.title}>{movie.title}</Text>

            {score != null && (
              <View style={styles.scoreRow}>
                <StarRating score={score} size="lg" showLabel />
              </View>
            )}

            <View style={styles.metaRow}>
              {year && (
                <View style={styles.metaItem}>
                  <Calendar color={colors.text.muted} size={14} />
                  <Text style={styles.metaText}>{year}</Text>
                </View>
              )}
              {movie.runtime != null && movie.runtime > 0 && (
                <View style={styles.metaItem}>
                  <Clock color={colors.text.muted} size={14} />
                  <Text style={styles.metaText}>{movie.runtime} min</Text>
                </View>
              )}
            </View>

            {genreNames.length > 0 && (
              <Text style={styles.genres} numberOfLines={2}>
                {genreNames}
              </Text>
            )}

            {movie.directorName && (
              <View style={styles.metaItem}>
                <User color={colors.text.muted} size={14} />
                <Text style={styles.metaText}>{movie.directorName}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Overview */}
        {movie.overview && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>
        )}

        {/* Score Breakdown */}
        {sourceBreakdown.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Score Breakdown</Text>
            <View style={styles.card}>
              {sourceBreakdown.map((source) => (
                <SourceBar key={source.source} source={source} />
              ))}
              {scoreData && (
                <Text style={styles.confidenceText}>
                  Based on {scoreData.sourcesAvailable} source
                  {scoreData.sourcesAvailable !== 1 ? "s" : ""}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Cast */}
        {movie.cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <FlatList
              horizontal
              data={movie.cast}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <CastCard member={item} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.castList}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SourceBar({ source }: { source: SourceRating }) {
  const barWidth = Math.min(100, (source.normalizedScore / 5) * 100);
  const barColor = getScoreColor(source.normalizedScore);

  return (
    <View style={styles.sourceRow}>
      <View style={styles.sourceHeader}>
        <Text style={styles.sourceLabel}>{source.label}</Text>
        <Text style={styles.sourceWeight}>{Math.round(source.weight * 100)}%</Text>
      </View>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: `${barWidth}%`, backgroundColor: barColor },
          ]}
        />
      </View>
      <Text style={[styles.sourceScore, { color: barColor }]}>
        {source.rawScore}/{source.maxScore}
      </Text>
    </View>
  );
}

function CastCard({ member }: { member: CastMember }) {
  const imageUri = member.profilePath
    ? `${TMDB_IMAGE_BASE}/w185${member.profilePath}`
    : null;

  return (
    <View style={styles.castCard}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.castImage}
          placeholder={{ blurhash: BLURHASH }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={[styles.castImage, styles.castImagePlaceholder]}>
          <User color={colors.text.muted} size={24} />
        </View>
      )}
      <Text style={styles.castName} numberOfLines={1}>
        {member.name}
      </Text>
      <Text style={styles.castCharacter} numberOfLines={1}>
        {member.character}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.dark },
  scroll: { paddingBottom: spacing.xxxl },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: colors.text.muted, fontSize: fontSize.md },

  backdrop: { width: "100%", height: 220 },
  backdropPlaceholder: { backgroundColor: colors.surface.card },

  headerRow: {
    flexDirection: "row",
    padding: spacing.lg,
    marginTop: -60,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  posterPlaceholder: {
    backgroundColor: colors.surface.hover,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.lg,
    paddingTop: 64,
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  scoreRow: { marginTop: spacing.xs },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  genres: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
  },

  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  overview: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 22,
  },

  card: {
    backgroundColor: colors.surface.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
  sourceRow: {
    marginBottom: spacing.md,
  },
  sourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  sourceLabel: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: fontWeight.medium,
  },
  sourceWeight: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
  },
  barTrack: {
    height: 6,
    backgroundColor: colors.surface.hover,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
  },
  barFill: {
    height: 6,
    borderRadius: borderRadius.sm,
  },
  sourceScore: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    marginTop: 2,
  },
  confidenceText: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
    textAlign: "center",
    marginTop: spacing.sm,
  },

  castList: {
    gap: spacing.md,
  },
  castCard: {
    width: 100,
    alignItems: "center",
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  castImagePlaceholder: {
    backgroundColor: colors.surface.hover,
    alignItems: "center",
    justifyContent: "center",
  },
  castName: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  castCharacter: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
    textAlign: "center",
  },
});
