import { Tabs } from "expo-router";
import { Home, Compass, Search, User } from "lucide-react-native";
import { colors } from "../../src/constants/theme";

export default function TabLayout() {
  return (
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
        name="index"
        options={{
          title: "Home",
          headerTitle: "RateScope",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => (
            <Compass color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Search color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
