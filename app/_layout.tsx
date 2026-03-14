// Root Layout — Tab Navigator
// This is the entry point for Expo Router

import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home, Compass, Search, User } from "lucide-react-native";
import { colors } from "../src/constants/theme";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface.dark },
          headerTintColor: colors.text.primary,
          headerTitleStyle: { fontWeight: "700" },
          tabBarStyle: {
            backgroundColor: colors.surface.dark,
            borderTopColor: colors.surface.border,
          },
          tabBarActiveTintColor: colors.brand.green,
          tabBarInactiveTintColor: colors.text.muted,
        }}
      >
        <Tabs.Screen
          name="(tabs)/index"
          options={{
            title: "Home",
            headerTitle: "RateScope",
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="(tabs)/discover"
          options={{
            title: "Discover",
            tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="(tabs)/search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="(tabs)/profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
        <Tabs.Screen name="movie/[id]" options={{ href: null }} />
        <Tabs.Screen name="genre/[id]" options={{ href: null }} />
      </Tabs>
    </QueryClientProvider>
  );
}
