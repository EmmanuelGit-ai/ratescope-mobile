// Root Layout — Stack Navigator
// Tabs are handled by (tabs)/_layout.tsx

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { colors } from "../src/constants/theme";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface.dark },
          headerTintColor: colors.text.primary,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: colors.surface.dark },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ title: "Movie Details" }} />
        <Stack.Screen name="genre/[id]" options={{ title: "Genre" }} />
      </Stack>
    </QueryClientProvider>
  );
}
