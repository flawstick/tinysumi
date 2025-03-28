import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { CalendarIcon } from "lucide-react-native";
import { Pressable, View, Modal, Text, TouchableOpacity } from "react-native";
import "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import twrnc from "twrnc";
import { useState, useCallback } from "react";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";

// Pink theme colors
const COLORS = {
  primary: "#ec4899", // Pink accent color
  primaryLight: "#fce7f3", // Light pink for backgrounds
  primaryDark: "#be185d", // Darker pink for text
  background: "#fdf2f8", // Very light pink background
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerBlurEffect: "prominent",
          headerLargeTitle: true,
          headerLargeStyle: { backgroundColor: "transparent" },
          headerLargeTitleStyle: { color: "#333" },
          headerTintColor: "#ec4899",
          title: "Tasks",
        }}
      />
      <Stack.Screen
        name="[taskId]"
        options={{
          title: "Task",
          headerBlurEffect: "prominent",
          headerTintColor: "#ec4899",
          headerBackButtonDisplayMode: "default",
          headerBackButtonMenuEnabled: true,
        }}
      />
    </Stack>
  );
}
