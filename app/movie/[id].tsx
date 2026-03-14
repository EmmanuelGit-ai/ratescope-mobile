// Movie Detail Screen — Scores + Prediction + Cast

import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontSize, fontWeight, spacing, borderRadius, getScoreColor } from "../../src/constants/theme";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero Poster Placeholder */}
        <View style={styles.posterPlaceholder}>
          <Text style={styles.placeholderText}>Movie Poster</Text>
        </View>

        {/* Title + Score */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>Loading movie {id}...</Text>
          <Text style={styles.subtitle}>Connect API to display movie details</Text>
        </View>

        {/* Score Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Score Breakdown</Text>
          <Text style={styles.cardSub}>Source-by-source ratings will appear here</Text>
        </View>

        {/* AI Prediction */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Prediction</Text>
          <Text style={styles.cardSub}>12-modifier breakdown will appear here</Text>
        </View>

        {/* Cast */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cast & Crew</Text>
          <Text style={styles.cardSub}>Horizontal cast scroll will appear here</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.dark },
  scroll: { paddingBottom: spacing.xxxl },
  posterPlaceholder: {
    height: 280,
    backgroundColor: colors.surface.card,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { color: colors.text.muted, fontSize: fontSize.md },
  infoSection: { padding: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text.primary },
  subtitle: { fontSize: fontSize.md, color: colors.text.muted, marginTop: spacing.xs },
  card: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
  cardTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text.primary },
  cardSub: { fontSize: fontSize.sm, color: colors.text.muted, marginTop: spacing.xs },
});
