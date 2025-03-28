import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

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
          title: "Little Space",
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
