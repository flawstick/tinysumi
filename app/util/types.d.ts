export interface Task {
  id: string;
  title: string;
  status: "pending" | "completed";
  priority: TaskPriority;
  dueDate: string | null;
}

export type TaskPriority = "high" | "medium" | "low";

export interface LastSeenData {
  lastSeenTasks?: string | null;
}

export interface SessionUser {
  user: {
    role: string;
  };
}

interface DailyVerse {
  text: string;
  reference: string;
  version: string;
  verseUrl: string;
}
