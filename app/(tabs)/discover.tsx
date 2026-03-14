// Discover Screen — Mood-Based Movie Discovery

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "../../src/constants/theme";
import { MOOD_MAPPINGS, TIME_BUDGETS } from "../../src/constants/moods";

export default function DiscoverScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>How are you feeling?</Text>

        <View style={styles.moodGrid}>
          {MOOD_MAPPINGS.map((m) => (
            <TouchableOpacity
              key={m.mood}
              style={[styles.moodCard, selectedMood === m.mood && styles.moodSelected]}
              onPress={() => setSelectedMood(m.mood)}
              accessibilityLabel={m.label}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={styles.moodLabel}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.heading, { marginTop: spacing.xxl }]}>How much time?</Text>

        <View style={styles.timeRow}>
          {TIME_BUDGETS.map((t) => (
            <TouchableOpacity
              key={t.label}
              style={[styles.timeChip, selectedTime === t.label && styles.timeSelected]}
              onPress={() => setSelectedTime(t.label)}
              accessibilityLabel={t.label}
            >
              <Text style={[styles.timeLabel, selectedTime === t.label && styles.timeLabelSelected]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedMood && selectedTime && (
          <View style={styles.resultPlaceholder}>
            <Text style={styles.resultText}>Finding your perfect movie...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.dark },
  scroll: { padding: spacing.lg },
  heading: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text.primary, marginBottom: spacing.md },
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
  moodSelected: { borderColor: colors.brand.green, backgroundColor: "rgba(27,122,77,0.1)" },
  moodEmoji: { fontSize: 28, marginBottom: spacing.xs },
  moodLabel: { fontSize: fontSize.xs, color: colors.text.secondary, textAlign: "center" },
  timeRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  timeChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
  timeSelected: { borderColor: colors.brand.green, backgroundColor: "rgba(27,122,77,0.1)" },
  timeLabel: { fontSize: fontSize.sm, color: colors.text.secondary },
  timeLabelSelected: { color: colors.brand.green },
  resultPlaceholder: {
    marginTop: spacing.xxl,
    padding: spacing.xxl,
    borderRadius: borderRadius.lg,
    backgroundColor: "rgba(27,122,77,0.05)",
    borderWidth: 1,
    borderColor: "rgba(27,122,77,0.3)",
    alignItems: "center",
  },
  resultText: { fontSize: fontSize.md, color: colors.brand.green, fontWeight: fontWeight.semibold },
});
