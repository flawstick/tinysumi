import { View, Text, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { signIn } from "@/util/auth";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import twrnc from "twrnc";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AuthScreen() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleSignIn = async () => {
    setIsSigningIn(true);
    const session = await signIn();
    setIsSigningIn(false);
    if (session) {
      router.replace("/");
    } else {
      console.log("Sign-in failed");
    }
  };

  return (
    <LinearGradient
      colors={["#fce7f3", "#fbcfe8", "#f9a8d4"]}
      style={twrnc`flex-1`}
    >
      <View style={twrnc`flex-1 justify-center items-center p-5`}>
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={twrnc`items-center mb-12`}
        >
          <Image
            source={require("@/assets/images/hk.gif")}
            style={twrnc`w-30 h-30 rounded-full mb-6`}
          />
          <Text style={twrnc`text-3xl font-bold text-pink-900 mb-2`}>
            Welcome Back!
          </Text>
          <Text style={twrnc`text-base text-pink-900 opacity-80 text-center`}>
            Sign in to continue your kawaii journey
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(400).springify()}
          style={twrnc`w-full`}
        >
          <AnimatedPressable
            disabled={isSigningIn}
            onPress={handleSignIn}
            onPressIn={() => {
              scale.value = withSpring(0.95);
            }}
            onPressOut={() => {
              scale.value = withSpring(1);
            }}
            style={[
              twrnc`bg-[#5865F2] rounded-full flex-row items-center justify-center py-4 px-6 shadow-lg`,
              animatedStyle,
              {
                opacity: isSigningIn ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              name="logo-discord"
              size={24}
              color="white"
              style={twrnc`mr-2`}
            />
            <Text style={twrnc`text-white text-base font-semibold`}>
              {isSigningIn ? "Signing in..." : "Continue with Discord"}
            </Text>
          </AnimatedPressable>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}
