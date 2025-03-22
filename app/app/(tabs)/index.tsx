import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import tw from "twrnc";
import ParallaxScrollView from "@/components/ParallaxScrollView";

interface AboutCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function HomeScreen() {
  const AboutCard = ({ icon, title, description }: AboutCardProps) => (
    <Animated.View
      entering={FadeInUp.delay(300)}
      style={tw`bg-white rounded-2xl p-5 items-center shadow-md`}
    >
      <View
        style={tw`w-12 h-12 rounded-full bg-pink-100 items-center justify-center mb-3`}
      >
        {icon}
      </View>
      <Text style={tw`text-lg font-bold text-pink-800 mb-2`}>{title}</Text>
      <Text style={tw`text-base text-pink-600 text-center`}>{description}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-pink-50`}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#fdf2f8", dark: "#fce7f3" }}
        headerImage={<Image source={require("@/assets/images/hk.jpg")} />}
        avatarImage={
          <Image
            source={require("@/assets/images/hk.gif")}
            style={tw`w-36 h-36 rounded-full`}
          />
        }
      >
        {/* Header Content */}
        <Animated.View
          entering={FadeInDown}
          style={tw`items-center px-5 pt-10`}
        >
          <Text style={tw`text-3xl font-bold text-pink-800 mt-5`}>
            Hi, I'm Sumi!
          </Text>
          <Text style={tw`text-lg text-pink-600 mt-2`}>
            Christian • Valorant Player • Tiny
          </Text>
        </Animated.View>

        {/* About Section */}
        <View style={tw`p-5`}>
          <Text style={tw`text-2xl font-bold text-pink-800 text-center mb-5`}>
            About Me
          </Text>
          <View style={tw`gap-4`}>
            <AboutCard
              icon={<AntDesign name="heart" size={24} color="#ec4899" />}
              title="Relationship"
              description="My favorite hobby is talking to my amazing boyfriend. He's my best friend and the love of my life! 💕"
            />
            <AboutCard
              icon={<FontAwesome name="book" size={24} color="#ec4899" />}
              title="Faith"
              description="My Christian faith is an important part of who I am. I love attending church and reading scripture. ✝️"
            />
            <AboutCard
              icon={<Feather name="coffee" size={24} color="#ec4899" />}
              title="Fun Facts"
              description="I'm very short but full of energy! I love cute things, the color pink, and drinking bubble-less redbull."
            />
          </View>
        </View>

        {/* Hobbies Section */}
        <View style={tw`p-5`}>
          <Text style={tw`text-2xl font-bold text-pink-800 text-center mb-5`}>
            My Hobbies
          </Text>
          <View style={tw`gap-5`}>
            <Animated.View
              entering={FadeInUp.delay(400)}
              style={[
                tw`bg-white rounded-2xl`,
                {
                  shadowColor: "#ec4899",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                  elevation: 3,
                },
              ]}
            >
              <View style={tw`overflow-hidden rounded-t-2xl`}>
                <Image
                  source={require("@/assets/images/giphy.webp")}
                  style={tw`w-full h-48`}
                />
              </View>
              <View style={tw`p-4`}>
                <Text style={tw`text-xl font-bold text-pink-800 mb-2`}>
                  Valorant
                </Text>
                <Text style={tw`text-base text-pink-600`}>
                  I love playing Valorant! My main agents are Clove and Tejo.
                  I'm not the best player, but I have a lot of fun, especially
                  when playing with my boyfriend.
                </Text>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(500)}
              style={[
                tw`bg-white rounded-2xl`,
                {
                  shadowColor: "#ec4899",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                  elevation: 3,
                },
              ]}
            >
              <View style={tw`overflow-hidden rounded-t-2xl`}>
                <Image
                  source={require("@/assets/images/happy.gif")}
                  style={tw`w-full h-48`}
                />
              </View>
              <View style={tw`p-4`}>
                <Text style={tw`text-xl font-bold text-pink-800 mb-2`}>
                  Talking with My Boyfriend
                </Text>
                <Text style={tw`text-base text-pink-600`}>
                  My absolute favorite thing to do is talk with my boyfriend.
                  Whether we're video chatting, texting, or spending time
                  together, it's always the highlight of my day!
                </Text>
              </View>
            </Animated.View>
          </View>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}
