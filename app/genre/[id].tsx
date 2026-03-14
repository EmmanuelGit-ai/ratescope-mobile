// Genre Listing Screen

import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontSize, fontWeight, spacing } from "../../src/constants/theme";

export default function GenreScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <Text style={styles.title}>Genre: {id}</Text>
      <Text style={styles.subtitle}>Connect API to show genre-filtered movies</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.dark, padding: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text.primary },
  subtitle: { fontSize: fontSize.md, color: colors.text.muted, marginTop: spacing.xs },
});
