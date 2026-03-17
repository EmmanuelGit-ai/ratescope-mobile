// Discover Screen — Mood-Based Movie Discovery

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Clock } from "lucide-react-native";
import { MovieCard } from "../../src/components/MovieCard";
import { useMoviesByMood } from "../../src/hooks/useMovies";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "../../src/constants/theme";
import { MOOD_MAPPINGS, TIME_BUDGETS } from "../../src/constants/moods";
import type { Mood } from "../../src/types";

// Each mood gets a unique gradient for visual distinctness
const MOOD_GRADIENTS: Record<string, [string, string]> = {
  thrilling: ["rgba(220,38,38,0.25)", "rgba(220,38,38,0.05)"],
  heartwarming: ["rgba(244,63,94,0.25)", "rgba(244,63,94,0.05)"],
  "mind-bending": ["rgba(139,92,246,0.25)", "rgba(139,92,246,0.05)"],
  "laugh-out-loud": ["rgba(245,158,11,0.25)", "rgba(245,158,11,0.05)"],
  "edge-of-seat": ["rgba(239,68,68,0.25)", "rgba(239,68,68,0.05)"],
  cozy: ["rgba(251,191,36,0.25)", "rgba(251,191,36,0.05)"],
  epic: ["rgba(59,130,246,0.25)", "rgba(59,130,246,0.05)"],
  dark: ["rgba(100,116,139,0.30)", "rgba(100,116,139,0.05)"],
  inspiring: ["rgba(34,197,94,0.25)", "rgba(34,197,94,0.05)"],
  nostalgic: ["rgba(168,85,247,0.25)", "rgba(168,85,247,0.05)"],
};

const MOOD_ACCENT: Record<string, string> = {
  thrilling: "#DC2626",
  heartwarming: "#F43F5E",
  "mind-bending": "#8B5CF6",
  "laugh-out-loud": "#F59E0B",
  "edge-of-seat": "#EF4444",
  cozy: "#FBBF24",
  epic: "#3B82F6",
  dark: "#64748B",
  inspiring: "#22C55E",
  nostalgic: "#A855F7",
};

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
          {MOOD_MAPPINGS.map((m) => {
            const isSelected = selectedMood === m.mood;
            const gradient = MOOD_GRADIENTS[m.mood] ?? ["transparent", "transparent"];
            const accent = MOOD_ACCENT[m.mood] ?? colors.brand.green;

            return (
              <TouchableOpacity
                key={m.mood}
                style={[styles.moodCard, isSelected && { borderColor: accent }]}
                onPress={() => setSelectedMood(isSelected ? null : m.mood)}
                accessibilityLabel={m.label}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={isSelected ? [gradient[0], gradient[1]] : ["transparent", "transparent"]}
                  style={styles.moodGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={[styles.moodLabel, isSelected && { color: accent, fontWeight: fontWeight.semibold }]}>
                    {m.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.timeSectionHeader}>
          <Clock color={colors.text.secondary} size={18} />
          <Text style={styles.heading}>How much time?</Text>
        </View>

        <View style={styles.timeRow}>
          {TIME_BUDGETS.map((t) => (
            <TouchableOpacity
              key={t.label}
              style={[styles.timeChip, selectedTime === t.label && styles.timeSelected]}
              onPress={() => setSelectedTime(selectedTime === t.label ? null : t.label)}
              accessibilityLabel={t.label}
              activeOpacity={0.7}
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
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    overflow: "hidden",
  },
  moodGradient: {
    alignItems: "center",
    padding: spacing.md,
  },
  moodEmoji: { fontSize: 28, marginBottom: spacing.xs },
  moodLabel: { fontSize: fontSize.xs, color: colors.text.secondary, textAlign: "center" },
  timeSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  timeRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  timeChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: colors.surface.card,
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
