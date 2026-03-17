// Profile / Settings Screen

import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Star, Film, Zap } from "lucide-react-native";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "../../src/constants/theme";

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.featureItem}>
      {icon}
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.content}>
        {/* Brand Header */}
        <LinearGradient
          colors={["rgba(27,122,77,0.20)", "transparent"]}
          style={styles.brandGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <View style={styles.logoCircle}>
            <Star color={colors.brand.green} fill={colors.brand.green} size={32} />
          </View>
          <Text style={styles.title}>RateScope</Text>
          <Text style={styles.subtitle}>AI-Powered Movie Ratings</Text>
        </LinearGradient>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            One aggregated score from 6+ sources. AI predictions using 12 data-driven modifiers.
            Find your next movie in under 2 minutes.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          <FeatureItem
            icon={<Star color={colors.brand.green} size={18} />}
            text="6+ rating sources aggregated into one score"
          />
          <FeatureItem
            icon={<Zap color={colors.brand.amber} size={18} />}
            text="AI predictions with 12 modifiers"
          />
          <FeatureItem
            icon={<Film color={colors.text.secondary} size={18} />}
            text="Mood-based discovery & time budgets"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.founder}>Built by Emmanuel Egbuche</Text>
          <Text style={styles.version}>Version 1.0.0 (MVP)</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.dark },
  content: { flex: 1 },
  brandGradient: {
    alignItems: "center",
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface.card,
    borderWidth: 2,
    borderColor: colors.brand.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.brand.green,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  descriptionCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    backgroundColor: colors.surface.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
  descriptionText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 22,
    textAlign: "center",
  },
  featuresCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.surface.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    gap: spacing.lg,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  featureText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    flex: 1,
  },
  footer: {
    alignItems: "center",
    marginTop: "auto",
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.xl,
  },
  founder: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    fontWeight: fontWeight.medium,
  },
  version: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
});
