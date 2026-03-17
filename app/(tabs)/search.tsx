// Search Screen — Debounced movie search with results

import { View, Text, TextInput, StyleSheet, ActivityIndicator, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import { Search as SearchIcon, X } from "lucide-react-native";
import { MovieCard } from "../../src/components/MovieCard";
import { useMovieSearch } from "../../src/hooks/useMovies";
import { colors, fontSize, fontWeight, spacing, borderRadius } from "../../src/constants/theme";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results, isLoading, error } = useMovieSearch(debouncedQuery);

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.searchBar}>
        <View style={styles.inputWrapper}>
          <SearchIcon color={colors.text.muted} size={18} style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Search any movie..."
            placeholderTextColor={colors.text.muted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable
              onPress={handleClear}
              style={styles.clearButton}
              accessibilityLabel="Clear search"
              hitSlop={8}
            >
              <View style={styles.clearIcon}>
                <X color={colors.text.muted} size={14} />
              </View>
            </Pressable>
          )}
        </View>
      </View>

      {debouncedQuery.length < 2 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <SearchIcon color={colors.text.muted} size={32} />
          </View>
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
            No movies found for &quot;{debouncedQuery}&quot;
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
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    paddingHorizontal: spacing.md,
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
    }),
  },
  searchIcon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    color: colors.text.primary,
    fontSize: fontSize.md,
  },
  clearButton: {
    padding: spacing.xs,
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  clearIcon: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface.hover,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { paddingTop: spacing.sm },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.surface.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
  },
  emptyText: { color: colors.text.muted, fontSize: fontSize.md },
  errorText: { color: colors.brand.red, fontSize: fontSize.md },
});
