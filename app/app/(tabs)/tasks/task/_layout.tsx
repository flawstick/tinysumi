import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[taskId]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
