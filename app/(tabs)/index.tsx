// Home Screen — Daily Top Picks + Industry Filter + Trending

import { View, Text, StyleSheet, ActivityIndicator, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Star, TrendingUp, Trophy } from "lucide-react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { useTrending, useDailyTop } from "../../src/hooks/useMovies";
import { MovieCard } from "../../src/components/MovieCard";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "../../src/constants/theme";
import type { MovieWithScores, DailyRanking } from "../../src/types";

// --- Industry filter chips ---

interface IndustryChip {
  key: string;
  label: string;
}

const INDUSTRY_CHIPS: IndustryChip[] = [
  { key: "all", label: "All" },
  { key: "hollywood", label: "Hollywood" },
  { key: "nollywood", label: "Nollywood" },
  { key: "bollywood", label: "Bollywood" },
  { key: "korean", label: "Korean" },
  { key: "anime", label: "Anime" },
  { key: "european", label: "European" },
  { key: "chinese", label: "Chinese" },
  { key: "latin_american", label: "Latin American" },
];

const BLURHASH = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

function IndustryFilter({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (key: string) => void;
}) {
  return (
    <FlatList
      horizontal
      data={INDUSTRY_CHIPS}
      keyExtractor={(item) => item.key}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipList}
      renderItem={({ item }) => {
        const isActive = selected === item.key;
        return (
          <Pressable
            onPress={() => onSelect(item.key)}
            style={[styles.chip, isActive && styles.chipActive]}
            accessibilityLabel={`Filter by ${item.label}`}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {item.label}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

// --- Top Picks section ---

function TopPicksSection({ rankings }: { rankings: DailyRanking[] }) {
  if (rankings.length === 0) return null;

  return (
    <View style={styles.topPicksSection}>
      <View style={styles.sectionHeader}>
        <Trophy color={colors.brand.amber} size={20} />
        <Text style={styles.sectionTitle}>Today&apos;s Top Picks</Text>
      </View>
      <FlatList
        horizontal
        data={rankings.slice(0, 10)}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topPicksList}
        renderItem={({ item, index }) => {
          const movie = item.movie;
          if (!movie) return null;

          const posterUri = movie.posterPath
            ? `https://image.tmdb.org/t/p/w342${movie.posterPath}`
            : null;
          const score = movie.aggregatedScore?.fiveStarScore;

          return (
            <Link href={`/movie/${movie.id}`} asChild>
              <Pressable style={styles.topPickCard} accessibilityLabel={`#${index + 1} ${movie.title}`}>
                <View style={styles.topPickPosterWrap}>
                  {posterUri ? (
                    <Image
                      source={{ uri: posterUri }}
                      style={styles.topPickPoster}
                      placeholder={{ blurhash: BLURHASH }}
                      contentFit="cover"
                      transition={200}
                    />
                  ) : (
                    <View style={[styles.topPickPoster, styles.topPickPosterPlaceholder]} />
                  )}
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>#{index + 1}</Text>
                  </View>
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.7)"]}
                    style={styles.topPickGradient}
                  />
                </View>
                <Text style={styles.topPickTitle} numberOfLines={2}>{movie.title}</Text>
                {score != null && (
                  <Text style={[styles.topPickScore, { color: score >= 4 ? colors.score.high : score >= 3 ? colors.score.mid : colors.score.low }]}>
                    {score.toFixed(1)}/5
                  </Text>
                )}
              </Pressable>
            </Link>
          );
        }}
      />
    </View>
  );
}

// --- List header ---

function ListHeader({
  selectedIndustry,
  onSelectIndustry,
  rankings,
  rankingsLoading,
}: {
  selectedIndustry: string;
  onSelectIndustry: (key: string) => void;
  rankings: DailyRanking[];
  rankingsLoading: boolean;
}) {
  return (
    <View>
      <LinearGradient
        colors={["rgba(27,122,77,0.25)", "rgba(27,122,77,0.08)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.heroGradient}
      >
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Star color={colors.brand.green} fill={colors.brand.green} size={14} />
            <Text style={styles.heroBadgeText}>6+ SOURCES · 1 SCORE</Text>
          </View>
          <Text style={styles.heroTitle}>
            Stop Scrolling.{"\n"}
            <Text style={styles.heroAccent}>Start Watching.</Text>
          </Text>
          <Text style={styles.heroSub}>
            One score from 6+ sources. AI predictions.{"\n"}Find your movie in under 2 minutes.
          </Text>
        </View>
      </LinearGradient>

      {/* Industry Filter */}
      <IndustryFilter selected={selectedIndustry} onSelect={onSelectIndustry} />

      {/* Today's Top Picks */}
      {rankingsLoading ? (
        <View style={styles.topPicksLoading}>
          <ActivityIndicator size="small" color={colors.brand.green} />
        </View>
      ) : (
        <TopPicksSection rankings={rankings} />
      )}

      {/* Trending section header */}
      <View style={styles.sectionHeader}>
        <TrendingUp color={colors.brand.green} size={20} />
        <Text style={styles.sectionTitle}>Trending This Week</Text>
      </View>
    </View>
  );
}

// --- Main screen ---

export default function HomeScreen() {
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  const { data: movies, isLoading, isError, error, refetch, failureCount } = useTrending();
  const { data: rankings, isLoading: rankingsLoading } = useDailyTop(
    selectedIndustry === "all" ? undefined : selectedIndustry
  );

  // Filter trending movies by industry if selected
  const filteredMovies =
    selectedIndustry === "all"
      ? movies
      : movies?.filter((m) => m.industry === selectedIndustry);

  const header = (
    <ListHeader
      selectedIndustry={selectedIndustry}
      onSelectIndustry={setSelectedIndustry}
      rankings={rankings ?? []}
      rankingsLoading={rankingsLoading}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        {header}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.brand.green} />
          {failureCount > 0 && (
            <Text style={styles.retryingText}>
              Retrying... (attempt {failureCount + 1})
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        {header}
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : "Failed to load movies"}
          </Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => refetch()}
            accessibilityLabel="Retry loading trending movies"
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!filteredMovies || filteredMovies.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        {header}
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {selectedIndustry !== "all"
              ? `No ${INDUSTRY_CHIPS.find((c) => c.key === selectedIndustry)?.label ?? selectedIndustry} movies found`
              : "No trending movies found"}
          </Text>
          {selectedIndustry !== "all" ? (
            <Pressable
              style={styles.retryButton}
              onPress={() => setSelectedIndustry("all")}
              accessibilityLabel="Show all movies"
            >
              <Text style={styles.retryText}>Show All</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.retryButton}
              onPress={() => refetch()}
              accessibilityLabel="Retry loading trending movies"
            >
              <Text style={styles.retryText}>Refresh</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <FlashList
        data={filteredMovies}
        keyExtractor={(item: MovieWithScores) => item.id}
        renderItem={({ item }: { item: MovieWithScores }) => (
          <MovieCard movie={item} />
        )}
        estimatedItemSize={192}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.dark,
  },
  heroGradient: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(27,122,77,0.15)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  heroBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.brand.green,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    textAlign: "center",
    lineHeight: 40,
  },
  heroAccent: {
    color: colors.brand.green,
  },
  heroSub: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: spacing.md,
    lineHeight: 22,
  },

  // Industry filter chips
  chipList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: colors.surface.card,
    minHeight: 48,
    justifyContent: "center",
  },
  chipActive: {
    borderColor: colors.brand.green,
    backgroundColor: "rgba(27,122,77,0.15)",
  },
  chipText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: fontWeight.medium,
  },
  chipTextActive: {
    color: colors.brand.green,
    fontWeight: fontWeight.semibold,
  },

  // Top picks
  topPicksSection: {
    marginBottom: spacing.lg,
  },
  topPicksLoading: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  topPicksList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  topPickCard: {
    width: 120,
    alignItems: "center",
  },
  topPickPosterWrap: {
    width: 120,
    height: 170,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    position: "relative",
  },
  rankBadge: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    zIndex: 1,
    backgroundColor: colors.brand.amber,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  rankText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: "#000",
  },
  topPickPoster: {
    width: 120,
    height: 170,
  },
  topPickPosterPlaceholder: {
    backgroundColor: colors.surface.hover,
  },
  topPickGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  topPickTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  topPickScore: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },

  // Section headers
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxxl,
  },
  retryingText: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.brand.green,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  retryText: {
    color: colors.text.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  listContent: {
    paddingBottom: spacing.xxxl,
  },
});
