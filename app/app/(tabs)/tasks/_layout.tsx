import { Stack, useRouter } from "expo-router";
import "react-native-reanimated";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CustomBackButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.dismissTo("/tasks")}
      style={{
        marginLeft: 8,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name="chevron-back" size={24} color="#ec4899" />
    </TouchableOpacity>
  );
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerBlurEffect: "prominent",
          headerLargeTitle: false,
          headerLargeTitleStyle: { color: "#333" },
          animation: "slide_from_left",
          headerLeft: () => null,
          headerBackButtonDisplayMode: undefined,
          title: "Tasks",
        }}
      />
      <Stack.Screen
        name="task"
        options={{
          title: "Task",
          headerBlurEffect: "prominent",
          headerTintColor: "#ec4899",
          headerLeft: () => <CustomBackButton />,
        }}
      />
    </Stack>
  );
}
