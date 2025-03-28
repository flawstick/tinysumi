import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { ChevronRight, ArrowRight, BookIcon } from "lucide-react-native";
import twrnc from "twrnc";
import { Task, TaskPriority } from "@/util/types";
import { formatDate, getPriorityStyle } from "@/util";
import { CheckCircle, Clock } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Easing,
} from "react-native-reanimated";

// Animated TouchableOpacity component
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// iOS-style Card for section headers with chevron
export const HeaderCard = ({
  icon,
  title,
  onPress,
  expanded,
}: {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
  expanded?: boolean;
}) => {
  // Animation for potential height changes
  const heightAnimation = useSharedValue(0);

  useEffect(() => {
    // This effect would be triggered if you add height changes based on expanded state
    heightAnimation.value = withTiming(expanded ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [expanded]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      // You could interpolate height here if needed
      opacity: interpolate(heightAnimation.value, [0, 1], [1, 1]),
    };
  });

  return (
    <AnimatedTouchable
      onPress={onPress}
      style={[
        twrnc`bg-white px-5 py-4 flex-row items-center justify-between`,
        animatedStyle,
      ]}
    >
      <View style={twrnc`flex-row items-center`}>
        {icon}
        <Text style={twrnc`text-xl font-semibold ml-4`}>{title}</Text>
      </View>
      <ChevronRight size={22} color="#D1D5DB" />
    </AnimatedTouchable>
  );
};

// Full-width separator for iOS-style cards
export const Separator = () => <View style={twrnc`h-px bg-gray-200 w-full`} />;

// Animated progress bar component
export const ProgressBar = ({ progress }: { progress: number }) => {
  const progressAnim = useSharedValue(0);

  useEffect(() => {
    // Animate to the new progress value
    progressAnim.value = withTiming(progress, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value}%`,
    };
  });

  return (
    <View style={twrnc`h-2.5 rounded-full bg-gray-100 mb-3 mt-2`}>
      <Animated.View
        style={[twrnc`h-2.5 rounded-full bg-pink-500`, progressStyle]}
      />
    </View>
  );
};

// Animated task item component
export const TaskItem = ({
  task,
  onPress,
  expanded,
}: {
  task: Task;
  onPress: () => void;
  expanded?: boolean;
}) => {
  const priorityStyle = getPriorityStyle(task.priority);
  const expandAnim = useSharedValue(expanded ? 1 : 0);

  useEffect(() => {
    expandAnim.value = withTiming(expanded ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [expanded]);

  const animatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      expandAnim.value,
      [0, 1],
      // Basic heights - adjust based on your content
      [60, task.dueDate ? 80 : 60],
    );

    return {
      height,
      opacity: interpolate(expandAnim.value, [0, 1], [1, 1]),
    };
  });

  return (
    <AnimatedTouchable
      onPress={onPress}
      style={[
        twrnc`px-5 py-3.5 flex-row items-center justify-between bg-white`,
        animatedStyle,
      ]}
    >
      <View style={twrnc`flex-row items-center flex-1`}>
        <View
          style={[
            twrnc`w-6 h-6 rounded-full items-center justify-center mr-3.5`,
            task.status === "completed"
              ? twrnc`bg-green-100`
              : priorityStyle.bg,
          ]}
        >
          {task.status === "completed" ? (
            <CheckCircle size={16} color="#22c55e" />
          ) : (
            <Clock size={16} color={priorityStyle.icon} />
          )}
        </View>
        <View style={twrnc`flex-1`}>
          <Text
            style={[
              twrnc`text-base`,
              task.status === "completed"
                ? twrnc`text-gray-400 line-through`
                : twrnc`text-gray-800`,
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          {task.dueDate && (
            <Text style={twrnc`text-xs text-gray-500 mt-0.5`}>
              Due: {formatDate(task.dueDate)}
            </Text>
          )}
        </View>
      </View>
      <ChevronRight size={18} color="#D1D5DB" />
    </AnimatedTouchable>
  );
};

// Animated greeting overlay
export const GreetingOverlay = ({
  onClose,
  visible,
}: {
  onClose: () => void;
  visible: boolean;
}) => {
  const opacity = useSharedValue(visible ? 1 : 0);
  const scale = useSharedValue(visible ? 1 : 0.8);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    scale.value = withSpring(visible ? 1 : 0.8, {
      damping: 15,
      stiffness: 150,
    });
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      // This ensures the overlay is only in the tree when visible
      display: opacity.value === 0 ? "none" : "flex",
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={[
        twrnc`absolute inset-0 z-50 flex items-center justify-center bg-pink-100/95`,
        containerStyle,
      ]}
    >
      <Animated.View style={[twrnc`max-w-md p-8 items-center`, contentStyle]}>
        <View
          style={twrnc`h-24 w-24 rounded-full border-4 border-pink-300 shadow-lg overflow-hidden mb-6 items-center justify-center`}
        >
          <Image
            source={{ uri: "https://tinysumi.com/hk.gif" }}
            style={twrnc`w-full h-full`}
            resizeMode="cover"
          />
        </View>
        <Text style={twrnc`text-3xl font-bold text-pink-700 mb-4 text-center`}>
          Welcome back, Sumi!
        </Text>
        <Text style={twrnc`text-xl text-pink-600 mb-8 text-center`}>
          Are you ready to please daddy today?
        </Text>
        <TouchableOpacity
          style={twrnc`bg-pink-500 px-8 py-4 rounded-full`}
          onPress={onClose}
        >
          <Text style={twrnc`text-lg text-white font-medium`}>
            Yes, I'm ready!
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// Animated Bible verse card
export const BibleVerseCard = ({
  verse,
  isLoading,
}: {
  verse: { text: string; reference: string; version: string } | null;
  isLoading: boolean;
}) => {
  const contentHeight = useSharedValue(0);
  const hasContent = verse || isLoading;

  useEffect(() => {
    // Update height based on content
    contentHeight.value = withTiming(hasContent ? 1 : 0, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [verse, isLoading]);

  const animatedStyle = useAnimatedStyle(() => {
    // You could interpolate to specific heights based on content if needed
    const height = interpolate(
      contentHeight.value,
      [0, 1],
      [100, verse?.text?.length > 100 ? 180 : 140],
    );

    return {
      height,
      opacity: interpolate(contentHeight.value, [0, 1], [0.7, 1]),
    };
  });

  return (
    <Animated.View
      style={[twrnc`rounded-xl overflow-hidden shadow-sm mb-8`, animatedStyle]}
    >
      <View style={twrnc`p-5 bg-white h-full`}>
        <View style={twrnc`flex-row items-center justify-center mb-3`}>
          <BookIcon size={20} color="#ec4899" style={twrnc`mr-2`} />
          <Text style={twrnc`text-xl font-semibold text-center`}>
            Today's Bible Verse
          </Text>
        </View>

        {isLoading ? (
          <Text style={twrnc`text-gray-500 text-center py-2`}>
            Loading verse...
          </Text>
        ) : !verse ? (
          <Text style={twrnc`text-red-500 text-center py-2`}>
            {"Can't fetch one"}
          </Text>
        ) : verse ? (
          <View>
            <Text
              style={twrnc`italic text-gray-700 text-center text-base mb-2`}
            >
              "{verse.text}"
            </Text>
            <Text style={twrnc`text-pink-600 text-center text-sm`}>
              {verse.reference} ({verse.version})
            </Text>
          </View>
        ) : (
          <Text style={twrnc`text-gray-500 text-center py-2`}>
            No verse for today
          </Text>
        )}
      </View>
    </Animated.View>
  );
};
