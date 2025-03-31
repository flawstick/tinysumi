// index.tsx - Main Page Component
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Heart, CheckCircle, ListTodo, ArrowRight } from "lucide-react-native";
import twrnc from "twrnc";
import Animated, { FadeIn, FadeOut, SlideInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Import components, hooks, and utilities
import {
  HeaderCard,
  Separator,
  ProgressBar,
  TaskItem,
  GreetingOverlay,
  BibleVerseCard,
} from "@/components/ui/Card";
import { useTaskData } from "@/hooks/useTaskData";
import { veryLightPinkBackground } from "@/util";
import { useAuth } from "@/components/useAuth";
import { DailyVerse, SessionUser } from "@/util/types";
import { api } from "@/util/api";

export default function LittleSpacePage() {
  const { session } = useAuth() as { session: SessionUser | null };
  const {
    tasks,
    isTasksLoading,
    showGreeting,
    setShowGreeting,
    completedTasks,
    completionPercentage,
    fetchData,
  } = useTaskData(session);

  // Bible verse state
  const [verse, setVerse] = useState<DailyVerse | null>(null);
  const [isVerseLoading, setIsVerseLoading] = useState(true);

  // Refresh control state
  const [refreshing, setRefreshing] = useState(false);

  // Fetch Bible verse
  const fetchVerse = async () => {
    setIsVerseLoading(true);
    try {
      const response = await api<DailyVerse>("/bible/daily-verse");
      if (response.data) {
        setVerse(response.data);
      }
    } catch (error) {
      setVerse(null);
    } finally {
      setIsVerseLoading(false);
    }
  };

  useEffect(() => {
    fetchVerse();
  }, []);

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // Refresh Bible verse
    await fetchVerse();

    // Refresh Tasks
    await fetchData();

    setRefreshing(false);
  }, [session]);

  return (
    <SafeAreaView style={[twrnc`flex-1`, veryLightPinkBackground]}>
      <StatusBar style="auto" />

      {/* Initial greeting overlay */}
      {showGreeting && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Animated.View entering={SlideInUp.delay(200)}>
            <GreetingOverlay onClose={() => setShowGreeting(false)} visible />
          </Animated.View>
        </Animated.View>
      )}

      {/* Main content - iOS Settings-like UI */}
      <ScrollView
        contentContainerStyle={[twrnc`p-5 flex-grow`, veryLightPinkBackground]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ec4899"
            colors={["#ec4899"]}
            progressBackgroundColor="#fff"
          />
        }
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustContentInsets={true}
      >
        <View style={twrnc`flex-1`}>
          {/* Daily Overview section */}
          <View style={twrnc`mb-8 rounded-xl overflow-hidden shadow-sm`}>
            <HeaderCard
              icon={<Heart size={24} color="#ec4899" fill="#ec4899" />}
              title="Daily Overview"
              onPress={() => {}}
            />
            <Separator />
            <View style={twrnc`px-5 py-4 bg-white`}>
              <View style={twrnc`flex-row items-center mb-1`}>
                <CheckCircle size={20} color="#ec4899" />
                <Text style={twrnc`text-lg ml-2`}>Today's Task Completion</Text>
              </View>
              <ProgressBar progress={completionPercentage} />
              <View style={twrnc`flex-row justify-between`}>
                <Text style={twrnc`text-gray-500`}>
                  {completedTasks}/{tasks.length} tasks completed
                </Text>
                <Text style={twrnc`text-gray-500`}>
                  {Math.round(completionPercentage)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Your Tasks section */}
          <View style={twrnc`mb-8 rounded-xl overflow-hidden shadow-sm`}>
            {/* Tasks Header */}
            <HeaderCard
              icon={<ListTodo size={24} color="#ec4899" />}
              title="Your Tasks"
              onPress={() => router.push("/tasks")}
            />

            {/* Full width separator */}
            <Separator />

            {/* Task list */}
            {isTasksLoading ? (
              <View style={twrnc`p-5 items-center justify-center bg-white`}>
                <Text style={twrnc`text-gray-500`}>Loading...</Text>
              </View>
            ) : tasks.length === 0 ? (
              <View style={twrnc`p-5 items-center justify-center bg-white`}>
                <Text style={twrnc`text-gray-500`}>No tasks for today</Text>
              </View>
            ) : (
              <>
                {tasks.slice(0, 3).map((task, index) => (
                  <React.Fragment key={task.id}>
                    {index > 0 && <Separator />}
                    <TaskItem
                      task={task}
                      onPress={() => router.push(`/tasks/task/${task.id}`)}
                    />
                  </React.Fragment>
                ))}
              </>
            )}

            {/* Full width separator before View All */}
            <Separator />

            {/* View All Tasks */}
            <View style={twrnc`p-4 items-center bg-white`}>
              <TouchableOpacity onPress={() => router.push("/tasks")}>
                <View style={twrnc`flex-row items-center`}>
                  <Text style={twrnc`text-pink-500 text-base font-medium`}>
                    View All Tasks
                  </Text>
                  <View style={twrnc`ml-1`}>
                    <ArrowRight size={20} color="#ec4899" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bible Verse Card */}
          <BibleVerseCard verse={verse} isLoading={isVerseLoading} />

          {/* Affirmation card */}
          <View style={twrnc`rounded-xl overflow-hidden shadow-sm`}>
            <View style={twrnc`p-5 bg-white`}>
              <Text style={twrnc`text-xl font-semibold text-center mb-3`}>
                Today's Affirmation
              </Text>
              <Text style={twrnc`italic text-pink-600 text-center text-base`}>
                "You are daddy's good little girl. Always remember how special
                and loved you are."
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
