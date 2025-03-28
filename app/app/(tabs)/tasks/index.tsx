import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import {
  ChevronRight,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Pause,
} from "lucide-react-native";
import twrnc from "twrnc";
import { router, useFocusEffect } from "expo-router";
import { api } from "@/util/api";
import { formatDate } from "@/util";

// Pink theme colors
const COLORS = {
  primary: "#ec4899", // Pink accent color
  primaryLight: "#fce7f3", // Light pink for backgrounds
  primaryDark: "#be185d", // Darker pink for text
  background: "#fdf2f8", // Very light pink background
  gray: {
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
  },
};

// Define Task type based on the schema
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "paused" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string | null;
  assignedToId: string | null;
}

// Get status icon and style based on task status
const getStatusStyle = (status: Task["status"]) => {
  switch (status) {
    case "todo":
      return {
        bg: twrnc`bg-pink-100`,
        icon: (size: number) => <Clock size={size} color="#be185d" />,
        iconColor: "#be185d",
      };
    case "in_progress":
      return {
        bg: twrnc`bg-pink-100`,
        icon: (size: number) => <Clock size={size} color="#ec4899" />,
        iconColor: "#ec4899",
      };
    case "paused":
      return {
        bg: twrnc`bg-amber-100`,
        icon: (size: number) => <Pause size={size} color="#f59e0b" />,
        iconColor: "#f59e0b",
      };
    case "completed":
      return {
        bg: twrnc`bg-green-100`,
        icon: (size: number) => <CheckCircle size={size} color="#22c55e" />,
        iconColor: "#22c55e",
      };
    default:
      return {
        bg: twrnc`bg-pink-100`,
        icon: (size: number) => <Clock size={size} color="#be185d" />,
        iconColor: "#be185d",
      };
  }
};

// Get priority style
const getPriorityStyle = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return {
        bg: twrnc`bg-red-50`,
        text: twrnc`text-red-700`,
        icon: (size: number) => <AlertTriangle size={size} color="#ef4444" />,
      };
    case "medium":
      return {
        bg: twrnc`bg-amber-50`,
        text: twrnc`text-amber-700`,
        icon: null,
      };
    case "low":
      return {
        bg: twrnc`bg-blue-50`,
        text: twrnc`text-blue-700`,
        icon: null,
      };
    default:
      return {
        bg: twrnc`bg-gray-50`,
        text: twrnc`text-gray-700`,
        icon: null,
      };
  }
};

// Task item component styled like iOS settings
const TaskItem = ({ task, onPress }: { task: Task; onPress: () => void }) => {
  const statusStyle = getStatusStyle(task.status);
  const priorityStyle = getPriorityStyle(task.priority);

  const isPastDue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={twrnc`px-4 py-3.5 flex-row items-center justify-between bg-white active:bg-pink-50`}
      activeOpacity={0.7}
    >
      <View style={twrnc`flex-row items-center flex-1`}>
        <View
          style={[
            twrnc`w-8 h-8 rounded-full items-center justify-center mr-3.5`,
            statusStyle.bg,
          ]}
        >
          {statusStyle.icon(18)}
        </View>
        <View style={twrnc`flex-1 pr-3`}>
          <Text
            style={[
              twrnc`text-base font-medium`,
              task.status === "completed"
                ? twrnc`text-gray-400 line-through`
                : twrnc`text-gray-800`,
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>

          {/* Show description preview if available */}
          {task.description && (
            <Text style={twrnc`text-sm text-gray-500 mt-0.5`} numberOfLines={1}>
              {task.description}
            </Text>
          )}

          {/* Due date with color coding */}
          {task.dueDate && (
            <Text
              style={[
                twrnc`text-xs mt-1`,
                isPastDue
                  ? twrnc`text-red-600 font-medium`
                  : twrnc`text-gray-500`,
              ]}
            >
              {isPastDue ? "Overdue: " : "Due: "}
              {formatDate(task.dueDate)}
            </Text>
          )}
        </View>
      </View>

      {/* Priority badge */}
      {task.priority !== "low" && (
        <View
          style={[
            twrnc`mr-3 px-2.5 py-1 rounded-full`,
            task.priority === "high" ? twrnc`bg-red-50` : twrnc`bg-amber-50`,
          ]}
        >
          <Text
            style={[
              twrnc`text-xs font-medium`,
              task.priority === "high"
                ? twrnc`text-red-700`
                : twrnc`text-amber-700`,
            ]}
          >
            {task.priority === "high" ? "High" : "Medium"}
          </Text>
        </View>
      )}

      <ChevronRight size={18} color="#F9A8D4" />
    </TouchableOpacity>
  );
};

// Full-width separator for iOS-style cards
const Separator = () => <View style={twrnc`h-px bg-pink-100 ml-16`} />;

// Section Header for task groups - iOS style
const SectionHeader = ({ title, count }: { title: string; count: number }) => (
  <View style={twrnc`px-4 pt-6 pb-2 flex-row justify-between items-center`}>
    <Text style={[twrnc`text-lg font-semibold`, { color: COLORS.primaryDark }]}>
      {title}
    </Text>
    <View
      style={[
        twrnc`rounded-full px-2 py-0.5`,
        { backgroundColor: COLORS.primaryLight },
      ]}
    >
      <Text style={[twrnc`text-xs font-medium`, { color: COLORS.primaryDark }]}>
        {count}
      </Text>
    </View>
  </View>
);

// Empty state component
const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <View style={twrnc`py-20 items-center justify-center`}>
    <View
      style={[
        twrnc`w-16 h-16 rounded-full items-center justify-center mb-4`,
        { backgroundColor: COLORS.primaryLight },
      ]}
    >
      <Clock size={28} color={COLORS.primary} />
    </View>
    <Text
      style={[twrnc`text-lg font-medium mb-1`, { color: COLORS.primaryDark }]}
    >
      No tasks yet
    </Text>
    <Text
      style={[twrnc`text-center max-w-64 mb-6`, { color: COLORS.gray[600] }]}
    >
      Add your first task to get started with your to-do list
    </Text>
    <TouchableOpacity
      onPress={onAdd}
      style={[
        twrnc`px-5 py-2.5 rounded-full flex-row items-center active:bg-pink-600`,
        { backgroundColor: COLORS.primary },
      ]}
      activeOpacity={0.8}
    >
      <Plus size={18} color="#FFFFFF" />
      <Text style={twrnc`text-white font-medium ml-1.5`}>Add New Task</Text>
    </TouchableOpacity>
  </View>
);

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const response = await api<Task[]>("/tasks");
      if (response.data) {
        setTasks(response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      if (showLoading) setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Refresh on focus (when navigating back to this screen)
  useFocusEffect(
    useCallback(() => {
      fetchTasks(false);
    }, []),
  );

  // Group tasks by status
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const pausedTasks = tasks.filter((task) => task.status === "paused");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  // Handler for adding a new task
  const handleAddTask = () => {
    router.push("/tasks/new");
  };

  async function onRefresh() {
    setRefreshing(true);
    await fetchTasks(false);
  }

  return (
    <SafeAreaView
      style={[twrnc`flex-1`, { backgroundColor: COLORS.background }]}
    >
      <StatusBar barStyle="dark-content" />

      {/* Tasks list */}
      {isLoading ? (
        <View style={twrnc`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[twrnc`mt-4`, { color: COLORS.primaryDark }]}>
            Loading tasks...
          </Text>
        </View>
      ) : tasks.length === 0 ? (
        <EmptyState onAdd={handleAddTask} />
      ) : (
        <>
          <ScrollView
            style={twrnc`flex-1`}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
                progressBackgroundColor="#fff"
              />
            }
          >
            {/* Todo tasks section */}
            {todoTasks.length > 0 && (
              <View>
                <SectionHeader title="To Do" count={todoTasks.length} />
                <View
                  style={twrnc`bg-white rounded-xl mx-4 overflow-hidden shadow-sm `}
                >
                  {todoTasks.map((task, index) => (
                    <React.Fragment key={task.id}>
                      {index > 0 && <Separator />}
                      <TaskItem
                        task={task}
                        onPress={() => router.push(`/tasks/${task.id}`)}
                      />
                    </React.Fragment>
                  ))}
                </View>
              </View>
            )}

            {/* In Progress tasks section */}
            {inProgressTasks.length > 0 && (
              <View>
                <SectionHeader
                  title="In Progress"
                  count={inProgressTasks.length}
                />
                <View
                  style={twrnc`bg-white rounded-xl mx-4 overflow-hidden shadow-sm `}
                >
                  {inProgressTasks.map((task, index) => (
                    <React.Fragment key={task.id}>
                      {index > 0 && <Separator />}
                      <TaskItem
                        task={task}
                        onPress={() => router.push(`/tasks/${task.id}`)}
                      />
                    </React.Fragment>
                  ))}
                </View>
              </View>
            )}

            {/* Paused tasks section */}
            {pausedTasks.length > 0 && (
              <View>
                <SectionHeader title="Paused" count={pausedTasks.length} />
                <View
                  style={twrnc`bg-white rounded-xl mx-4 overflow-hidden shadow-sm `}
                >
                  {pausedTasks.map((task, index) => (
                    <React.Fragment key={task.id}>
                      {index > 0 && <Separator />}
                      <TaskItem
                        task={task}
                        onPress={() => router.push(`/tasks/${task.id}`)}
                      />
                    </React.Fragment>
                  ))}
                </View>
              </View>
            )}

            {/* Completed tasks section */}
            {completedTasks.length > 0 && (
              <View>
                <SectionHeader
                  title="Completed"
                  count={completedTasks.length}
                />
                <View
                  style={twrnc`bg-white rounded-xl mx-4 overflow-hidden shadow-sm `}
                >
                  {completedTasks.map((task, index) => (
                    <React.Fragment key={task.id}>
                      {index > 0 && <Separator />}
                      <TaskItem
                        task={task}
                        onPress={() => router.push(`/tasks/${task.id}`)}
                      />
                    </React.Fragment>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
