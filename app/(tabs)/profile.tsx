// Profile / Settings Screen

import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontSize, fontWeight, spacing } from "../../src/constants/theme";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.content}>
        <Text style={styles.title}>RateScope</Text>
        <Text style={styles.subtitle}>AI-Powered Movie Ratings</Text>
        <Text style={styles.founder}>Built by Emmanuel Egbuche</Text>
        <Text style={styles.version}>Version 1.0.0 (MVP)</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.dark },
  content: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.lg },
  title: { fontSize: fontSize.hero, fontWeight: fontWeight.bold, color: colors.brand.green },
  subtitle: { fontSize: fontSize.md, color: colors.text.secondary, marginTop: spacing.xs },
  founder: { fontSize: fontSize.sm, color: colors.text.muted, marginTop: spacing.xxl },
  version: { fontSize: fontSize.xs, color: colors.text.muted, marginTop: spacing.xs },
});
