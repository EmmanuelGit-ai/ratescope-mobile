// Home Screen — Trending Movies + Quick Search

import { View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { useTrending } from "../../src/hooks/useMovies";
import { MovieCard } from "../../src/components/MovieCard";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "../../src/constants/theme";
import type { MovieWithScores } from "../../src/types";

function ListHeader() {
  return (
    <View>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Stop Scrolling.{" "}
          <Text style={styles.heroAccent}>Start Watching.</Text>
        </Text>
        <Text style={styles.heroSub}>
          One score from 6+ sources. AI predictions. Find your movie in under 2
          minutes.
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending This Week</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { data: movies, isLoading, isError, error, refetch, failureCount } = useTrending();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <ListHeader />
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
        <ListHeader />
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

  if (!movies || movies.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <ListHeader />
        <View style={styles.centered}>
          <Text style={styles.errorText}>No trending movies found</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => refetch()}
            accessibilityLabel="Retry loading trending movies"
          >
            <Text style={styles.retryText}>Refresh</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <FlashList
        data={movies}
        keyExtractor={(item: MovieWithScores) => item.id}
        renderItem={({ item }: { item: MovieWithScores }) => (
          <MovieCard movie={item} />
        )}
        estimatedItemSize={192}
        ListHeaderComponent={ListHeader}
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
  hero: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxxl,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    textAlign: "center",
  },
  heroAccent: {
    color: colors.brand.green,
  },
  heroSub: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  sectionHeader: {
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
