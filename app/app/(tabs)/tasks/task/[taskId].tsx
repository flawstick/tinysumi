import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Pause,
  ChevronLeft,
  Calendar,
  Edit3,
  Trash2,
  XCircle,
  PlayCircle,
} from "lucide-react-native";
import { format } from "date-fns";
import twrnc from "twrnc";
import { api, apiPatch } from "@/util/api";

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

export default function TaskDetailPage() {
  const { taskId } = useLocalSearchParams();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const formatStatus = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "in_progress":
        return "In Progress";
      case "paused":
        return "Paused";
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  // Fetch task details function
  const fetchTask = async (showLoading = true) => {
    if (!taskId) return;

    try {
      if (showLoading) setIsLoading(true);
      const response = await api<Task>(`/tasks/${taskId}`);
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error fetching task:", error);
      if (showLoading) {
        Alert.alert("Error", "Failed to load task details");
      }
    } finally {
      if (showLoading) setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchTask();
  }, [taskId]);

  // Refresh on focus (when navigating back to this screen)
  useFocusEffect(
    useCallback(() => {
      fetchTask(false);
    }, [taskId]),
  );

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTask(false);
  }, [taskId]);

  // Update task status
  const updateStatus = async (newStatus: Task["status"]) => {
    if (!task) return;

    try {
      setIsUpdating(true);
      const response = await apiPatch<Task>("/tasks/status", {
        taskId: task.id,
        status: newStatus,
      });

      if (response.data) {
        setTask(response.data);
        Alert.alert("Success", `Task marked as ${formatStatus(newStatus)}`);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      Alert.alert("Error", "Failed to update task status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Get status icon and style based on task status
  const getStatusStyle = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return {
          bg: twrnc`bg-pink-100`,
          icon: (size: number) => <Clock size={size} color="#be185d" />,
          iconColor: "#be185d",
          textColor: twrnc`text-pink-700`,
        };
      case "in_progress":
        return {
          bg: twrnc`bg-pink-100`,
          icon: (size: number) => <Clock size={size} color="#ec4899" />,
          iconColor: "#ec4899",
          textColor: twrnc`text-pink-600`,
        };
      case "paused":
        return {
          bg: twrnc`bg-amber-100`,
          icon: (size: number) => <Pause size={size} color="#f59e0b" />,
          iconColor: "#f59e0b",
          textColor: twrnc`text-amber-700`,
        };
      case "completed":
        return {
          bg: twrnc`bg-green-100`,
          icon: (size: number) => <CheckCircle size={size} color="#22c55e" />,
          iconColor: "#22c55e",
          textColor: twrnc`text-green-700`,
        };
      default:
        return {
          bg: twrnc`bg-pink-100`,
          icon: (size: number) => <Clock size={size} color="#be185d" />,
          iconColor: "#be185d",
          textColor: twrnc`text-pink-700`,
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

  // Format date for display
  const formattedDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy h:mm a");
    } catch (e) {
      return "Invalid date";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView
        style={[twrnc`flex-1`, { backgroundColor: COLORS.background }]}
      >
        <View style={twrnc`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text
            style={[twrnc`text-gray-500 mt-4`, { color: COLORS.primaryDark }]}
          >
            Loading task details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state - no task found
  if (!task) {
    return (
      <SafeAreaView
        style={[twrnc`flex-1`, { backgroundColor: COLORS.background }]}
      >
        <View style={twrnc`flex-1 items-center justify-center`}>
          <XCircle size={40} color="#EF4444" />
          <Text style={twrnc`text-lg font-medium text-gray-800 mt-4`}>
            Task not found
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              twrnc`mt-6 px-5 py-2.5 rounded-full`,
              { backgroundColor: COLORS.primary },
            ]}
          >
            <Text style={twrnc`text-white font-medium`}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusStyle(task.status);
  const priorityStyle = getPriorityStyle(task.priority);
  const isPastDue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  // Available status transitions based on current status
  const availableStatusTransitions = () => {
    switch (task.status) {
      case "todo":
        return [
          {
            status: "in_progress",
            label: "Start Task",
            icon: PlayCircle,
            color: COLORS.primary,
          },
          {
            status: "paused",
            label: "Pause Task",
            icon: Pause,
            color: "#F59E0B",
          },
          {
            status: "completed",
            label: "Mark Complete",
            icon: CheckCircle,
            color: "#22C55E",
          },
        ];
      case "in_progress":
        return [
          {
            status: "paused",
            label: "Pause Task",
            icon: Pause,
            color: "#F59E0B",
          },
          {
            status: "completed",
            label: "Mark Complete",
            icon: CheckCircle,
            color: "#22C55E",
          },
        ];
      case "paused":
        return [
          {
            status: "in_progress",
            label: "Resume Task",
            icon: PlayCircle,
            color: COLORS.primary,
          },
          {
            status: "completed",
            label: "Mark Complete",
            icon: CheckCircle,
            color: "#22C55E",
          },
        ];
      case "completed":
        return [
          {
            status: "todo",
            label: "Reopen Task",
            icon: Clock,
            color: COLORS.primaryDark,
          },
          {
            status: "in_progress",
            label: "Continue Working",
            icon: PlayCircle,
            color: COLORS.primary,
          },
        ];
      default:
        return [];
    }
  };

  return (
    <SafeAreaView
      style={[twrnc`flex-1`, { backgroundColor: COLORS.background }]}
    >
      <ScrollView
        contentContainerStyle={twrnc`pb-12`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
            progressBackgroundColor="#FFFFFF"
          />
        }
      >
        {/* Header/Status Bar */}
        <View
          style={twrnc`bg-white px-4 pt-2 pb-5 border-pink-100 rounded-xl m-4`}
        >
          <View style={twrnc`flex-row justify-between items-center mt-2`}>
            <View style={twrnc`flex-1`}>
              <Text
                style={twrnc`text-2xl font-bold text-gray-800`}
                numberOfLines={2}
              >
                {task.title}
              </Text>
            </View>

            {/* Action buttons */}
            <View style={twrnc`flex-row ml-2`}></View>
          </View>

          {/* Status badge */}
          <View style={twrnc`flex-row items-center mt-3`}>
            <View
              style={[
                twrnc`px-3 py-1.5 rounded-full flex-row items-center`,
                statusStyle.bg,
              ]}
            >
              {statusStyle.icon(16)}
              <Text
                style={[
                  twrnc`text-sm font-medium ml-1.5`,
                  statusStyle.textColor,
                ]}
              >
                {formatStatus(task.status)}
              </Text>
            </View>

            {/* Priority badge - only for medium/high */}
            {task.priority !== "low" && (
              <View
                style={[
                  twrnc`ml-2 px-3 py-1.5 rounded-full flex-row items-center`,
                  task.priority === "high"
                    ? twrnc`bg-red-50`
                    : twrnc`bg-amber-50`,
                ]}
              >
                {task.priority === "high" && (
                  <AlertTriangle size={16} color="#EF4444" />
                )}
                <Text
                  style={[
                    twrnc`text-sm font-medium ml-1`,
                    task.priority === "high"
                      ? twrnc`text-red-700`
                      : twrnc`text-amber-700`,
                  ]}
                >
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}{" "}
                  Priority
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Task details sections */}
        <View style={twrnc`px-4 mt-6`}>
          {/* Description section */}
          <View style={twrnc`mb-6`}>
            <Text
              style={[
                twrnc`text-sm font-medium mb-2 uppercase`,
                { color: COLORS.primaryDark },
              ]}
            >
              Description
            </Text>
            <View style={twrnc`bg-white p-4 rounded-xl shadow-sm`}>
              <Text style={twrnc`text-gray-800 leading-6`}>
                {task.description || "No description provided."}
              </Text>
            </View>
          </View>

          {/* Due date section - if available */}
          {task.dueDate && (
            <View style={twrnc`mb-6`}>
              <Text
                style={[
                  twrnc`text-sm font-medium mb-2 uppercase`,
                  { color: COLORS.primaryDark },
                ]}
              >
                Due Date
              </Text>
              <View
                style={twrnc`bg-white p-4 rounded-xl flex-row items-center shadow-sm`}
              >
                <Calendar
                  size={20}
                  color={isPastDue ? "#EF4444" : COLORS.primaryDark}
                />
                <Text
                  style={[
                    twrnc`ml-3 text-base`,
                    isPastDue
                      ? twrnc`text-red-600 font-medium`
                      : twrnc`text-gray-800`,
                  ]}
                >
                  {formattedDate(task.dueDate)}
                  {isPastDue && " (Overdue)"}
                </Text>
              </View>
            </View>
          )}

          {/* Meta information */}
          <View style={twrnc`mb-8`}>
            <Text
              style={[
                twrnc`text-sm font-medium mb-2 uppercase`,
                { color: COLORS.primaryDark },
              ]}
            >
              Details
            </Text>
            <View style={twrnc`bg-white rounded-xl overflow-hidden shadow-sm`}>
              <View style={twrnc`px-4 py-3.5 border-b border-pink-100`}>
                <Text style={{ color: COLORS.gray[500], fontSize: 12 }}>
                  Created
                </Text>
                <Text style={twrnc`text-base text-gray-800 mt-1`}>
                  {formattedDate(task.createdAt)}
                </Text>
              </View>
              <View style={twrnc`px-4 py-3.5`}>
                <Text style={{ color: COLORS.gray[500], fontSize: 12 }}>
                  Last Updated
                </Text>
                <Text style={twrnc`text-base text-gray-800 mt-1`}>
                  {formattedDate(task.updatedAt)}
                </Text>
              </View>
            </View>
          </View>

          {/* Status change buttons */}
          <View style={twrnc`mb-6`}>
            <Text
              style={[
                twrnc`text-sm font-medium mb-2 uppercase`,
                { color: COLORS.primaryDark },
              ]}
            >
              Actions
            </Text>
            <View style={twrnc`bg-white p-4 rounded-xl shadow-sm`}>
              {isUpdating ? (
                <View style={twrnc`items-center justify-center py-4`}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={{ color: COLORS.primary, marginTop: 8 }}>
                    Updating task...
                  </Text>
                </View>
              ) : (
                <View>
                  {availableStatusTransitions().map((transition, index) => (
                    <TouchableOpacity
                      key={transition.status}
                      onPress={() =>
                        updateStatus(transition.status as Task["status"])
                      }
                      style={[
                        twrnc`flex-row items-center px-4 py-3.5 rounded-lg active:bg-pink-50`,
                        index > 0 && twrnc`mt-2`,
                        { borderWidth: 1, borderColor: COLORS.primaryLight },
                      ]}
                      activeOpacity={0.7}
                    >
                      <transition.icon size={20} color={transition.color} />
                      <Text style={twrnc`text-gray-800 font-medium ml-3`}>
                        {transition.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
