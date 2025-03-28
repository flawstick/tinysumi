import {
  View,
  Text,
  Image,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardEvent,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
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
import { getSession, signIn } from "@/util/auth";
import { useAuth } from "@/components/useAuth";

const AnimatedButton = Animated.createAnimatedComponent(Animated.View);

export default function AuthScreen() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const scale = useSharedValue(1);
  const { setSession } = useAuth();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleSignIn = async () => {
    if (!username.trim()) return;

    setIsSigningIn(true);
    try {
      await signIn(username);
      const session = await getSession();
      if (session) {
        setSession(session);
        router.replace("/");
      }
    } catch (error) {
      console.log("Sign-in failed");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={twrnc`flex-1`}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                Welcome!
              </Text>
              <Text
                style={twrnc`text-base text-pink-900 opacity-80 text-center`}
              >
                Enter your username to continue
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(400).springify()}
              style={twrnc`w-full gap-4`}
            >
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                placeholderTextColor="#831843"
                style={twrnc`w-full bg-white/80 rounded-full py-4 px-6 text-base pb-5 text-pink-800 shadow-sm`}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />

              <AnimatedButton
                entering={FadeInUp.delay(500).springify()}
                style={[
                  twrnc`bg-pink-500 rounded-full overflow-hidden shadow-lg`,
                  animatedStyle,
                  {
                    opacity: isSigningIn || !username.trim() ? 0.7 : 1,
                  },
                ]}
              >
                <TouchableWithoutFeedback
                  disabled={isSigningIn || !username.trim()}
                  onPress={handleSignIn}
                  onPressIn={() => {
                    scale.value = withSpring(0.95);
                  }}
                  onPressOut={() => {
                    scale.value = withSpring(1);
                  }}
                >
                  <View
                    style={twrnc`flex-row items-center justify-center py-4 px-6`}
                  >
                    <Ionicons
                      name="arrow-forward"
                      size={24}
                      color="white"
                      style={twrnc`mr-2`}
                    />
                    <Text style={twrnc`text-white text-base font-semibold`}>
                      {isSigningIn ? "Signing in..." : "Continue"}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </AnimatedButton>
            </Animated.View>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
