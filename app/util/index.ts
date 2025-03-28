// utils.ts - Utility Functions
import twrnc from "twrnc";
import { TaskPriority } from "./types";

// Helper function to get priority styling
export const getPriorityStyle = (priority: TaskPriority) => {
  switch (priority) {
    case "high":
      return {
        bg: twrnc`bg-red-100`,
        text: twrnc`text-red-700`,
        icon: "#ef4444", // text-red-500
      };
    case "medium":
      return {
        bg: twrnc`bg-yellow-100`,
        text: twrnc`text-yellow-700`,
        icon: "#eab308", // text-yellow-500
      };
    case "low":
      return {
        bg: twrnc`bg-blue-100`,
        text: twrnc`text-blue-700`,
        icon: "#3b82f6", // text-blue-500
      };
    default:
      return {
        bg: twrnc`bg-gray-100`,
        text: twrnc`text-gray-700`,
        icon: "#6b7280", // text-gray-500
      };
  }
};

// Helper function to format date
export const formatDate = (date: string | null) => {
  if (!date) return "No due date";
  const taskDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (taskDate.toDateString() === today.toDateString()) return "Today";
  if (taskDate.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return taskDate.toLocaleDateString();
};

// Very light pink background style
export const veryLightPinkBackground = {
  backgroundColor: "rgba(252, 231, 243, 0.3)",
};
