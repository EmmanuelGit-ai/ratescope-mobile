// Discover Screen — Mood-Based Movie Discovery

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { MovieCard } from "../../src/components/MovieCard";
import { useMoviesByMood } from "../../src/hooks/useMovies";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "../../src/constants/theme";
import { MOOD_MAPPINGS, TIME_BUDGETS } from "../../src/constants/moods";
import type { Mood } from "../../src/types";

export default function DiscoverScreen() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const moodMapping = MOOD_MAPPINGS.find((m) => m.mood === selectedMood);
  const timeBudget = TIME_BUDGETS.find((t) => t.label === selectedTime);

  const { data: movies, isLoading, error } = useMoviesByMood({
    genreIds: moodMapping?.genreIds ?? [],
    maxRuntime: timeBudget?.maxMinutes,
    limit: 20,
  });

  const hasSelection = selectedMood != null;

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll} stickyHeaderIndices={[]}>
        <Text style={styles.heading}>How are you feeling?</Text>

        <View style={styles.moodGrid}>
          {MOOD_MAPPINGS.map((m) => (
            <TouchableOpacity
              key={m.mood}
              style={[styles.moodCard, selectedMood === m.mood && styles.moodSelected]}
              onPress={() => setSelectedMood(selectedMood === m.mood ? null : m.mood)}
              accessibilityLabel={m.label}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={[styles.moodLabel, selectedMood === m.mood && styles.moodLabelSelected]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.heading, { marginTop: spacing.xxl }]}>How much time?</Text>

        <View style={styles.timeRow}>
          {TIME_BUDGETS.map((t) => (
            <TouchableOpacity
              key={t.label}
              style={[styles.timeChip, selectedTime === t.label && styles.timeSelected]}
              onPress={() => setSelectedTime(selectedTime === t.label ? null : t.label)}
              accessibilityLabel={t.label}
            >
              <Text style={[styles.timeLabel, selectedTime === t.label && styles.timeLabelSelected]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Results */}
        {hasSelection && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsHeading}>
              {moodMapping?.description ?? "Movies for you"}
            </Text>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.brand.green} />
              </View>
            ) : error ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Something went wrong. Try again.</Text>
              </View>
            ) : movies && movies.length === 0 ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.emptyText}>No movies match this combination. Try a different mood or time budget.</Text>
              </View>
            ) : (
              movies?.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.dark },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  heading: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  moodGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  moodCard: {
    width: "31%",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: colors.surface.card,
  },
  moodSelected: {
    borderColor: colors.brand.green,
    backgroundColor: "rgba(27,122,77,0.15)",
  },
  moodEmoji: { fontSize: 28, marginBottom: spacing.xs },
  moodLabel: { fontSize: fontSize.xs, color: colors.text.secondary, textAlign: "center" },
  moodLabelSelected: { color: colors.brand.green, fontWeight: fontWeight.medium },
  timeRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  timeChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
  timeSelected: {
    borderColor: colors.brand.green,
    backgroundColor: "rgba(27,122,77,0.15)",
  },
  timeLabel: { fontSize: fontSize.sm, color: colors.text.secondary },
  timeLabelSelected: { color: colors.brand.green, fontWeight: fontWeight.medium },
  resultsSection: {
    marginTop: spacing.xxl,
  },
  resultsHeading: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.brand.green,
    marginBottom: spacing.lg,
  },
  loadingContainer: {
    paddingVertical: spacing.xxxl,
    alignItems: "center",
  },
  errorText: { color: colors.brand.red, fontSize: fontSize.md },
  emptyText: { color: colors.text.muted, fontSize: fontSize.md, textAlign: "center" },
});
