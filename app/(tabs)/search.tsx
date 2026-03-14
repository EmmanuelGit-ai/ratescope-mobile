// Search Screen

import { View, Text, TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "../../src/constants/theme";

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search any movie..."
          placeholderTextColor={colors.text.muted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          {query.length < 2
            ? "Type at least 2 characters to search"
            : "Connect API to show search results"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.dark },
  searchBar: { padding: spacing.lg },
  input: {
    backgroundColor: colors.surface.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surface.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text.primary,
    fontSize: fontSize.md,
  },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: colors.text.muted, fontSize: fontSize.md },
});
