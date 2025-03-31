import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import type { Session } from "@/util/auth";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { getSession } from "@/util/auth";
import { AuthProvider } from "@/components/useAuth";

import * as Notifications from "expo-notifications";

// handle incoming notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Combined loading effect
  useEffect(() => {
    async function prepare() {
      try {
        // Load session
        const currentSession = await getSession();
        setSession(currentSession);

        // Wait for fonts to load
        if (loaded) {
          // Hide splash screen once everything is ready
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.warn(error);
      }
    }

    prepare();
  }, [loaded]);

  // Auth navigation effect
  useEffect(() => {
    if (loaded) {
      if (!session) {
        router.replace("/auth");
      } else if (session) {
        router.replace("/");
      }
    }
  }, [session, loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="auth/index"
            options={{
              headerShown: true,
              title: "Log In",
              headerBlurEffect: "light",
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
