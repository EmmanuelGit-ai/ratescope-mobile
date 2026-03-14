// Home Screen — Trending Movies + Quick Search

import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontSize, fontWeight, spacing } from "../../src/constants/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Stop Scrolling.{" "}
          <Text style={styles.heroAccent}>Start Watching.</Text>
        </Text>
        <Text style={styles.heroSub}>
          One score from 6+ sources. AI predictions. Find your movie in under 2 minutes.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending This Week</Text>
        <Text style={styles.sectionSub}>Connect API to populate trending movies</Text>
      </View>
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
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  sectionSub: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
});
