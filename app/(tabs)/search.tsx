// Search Screen — Debounced movie search with results

import { View, Text, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { FlashList } from "@shopify/flash-list";
import { Search as SearchIcon } from "lucide-react-native";
import { MovieCard } from "../../src/components/MovieCard";
import { useMovieSearch } from "../../src/hooks/useMovies";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "../../src/constants/theme";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results, isLoading, error } = useMovieSearch(debouncedQuery);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.searchBar}>
        <View style={styles.inputWrapper}>
          <SearchIcon color={colors.text.muted} size={18} style={styles.searchIcon} />
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
      </View>

      {debouncedQuery.length < 2 ? (
        <View style={styles.emptyState}>
          <SearchIcon color={colors.text.muted} size={48} />
          <Text style={styles.emptyTitle}>Search Movies</Text>
          <Text style={styles.emptyText}>Type at least 2 characters to search</Text>
        </View>
      ) : isLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.brand.green} />
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <Text style={styles.errorText}>Something went wrong. Try again.</Text>
        </View>
      ) : results && results.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No results</Text>
          <Text style={styles.emptyText}>
            No movies found for "{debouncedQuery}"
          </Text>
        </View>
      ) : (
        <FlashList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MovieCard movie={item} />}
          estimatedItemSize={190}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface.dark },
  searchBar: { padding: spacing.lg },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surface.border,
    paddingHorizontal: spacing.md,
  },
  searchIcon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    color: colors.text.primary,
    fontSize: fontSize.md,
  },
  list: { paddingTop: spacing.sm },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  emptyText: { color: colors.text.muted, fontSize: fontSize.md },
  errorText: { color: colors.brand.red, fontSize: fontSize.md },
});
