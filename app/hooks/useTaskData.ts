// hooks.ts - Custom Hooks
import { useState, useEffect } from "react";
import { api, HttpMethod } from "@/util/api";
import { Task, LastSeenData, SessionUser } from "@/util/types";

export const useTaskData = (session: SessionUser | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [lastSeenData, setLastSeenData] = useState<LastSeenData | undefined>();
  const [showGreeting, setShowGreeting] = useState(false);
  const [lastSeenUpdated, setLastSeenUpdated] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch tasks - assuming the server already filters for today's tasks
      const tasksResponse = await api<Task[]>("/tasks");
      if (tasksResponse.data) {
        setTasks(tasksResponse.data);
        setIsTasksLoading(false);
      }

      // Fetch last seen tasks
      const lastSeenResponse = await api<LastSeenData>("/tasks/last-seen");
      if (lastSeenResponse.data) {
        setLastSeenData(lastSeenResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsTasksLoading(false);
    }
  };

  // Fetch tasks and last seen data
  useEffect(() => {
    fetchData();
  }, []);

  // Check and update last seen - optimized to prevent excessive calls
  useEffect(() => {
    // Only run this effect when we have session and lastSeenData and haven't updated yet
    if (!session || !lastSeenData || lastSeenUpdated) {
      return;
    }

    const checkAndUpdateLastSeen = async () => {
      if (session?.user.role === "tiny") {
        const lastSeenDate = lastSeenData?.lastSeenTasks
          ? new Date(lastSeenData.lastSeenTasks).getDate()
          : null;
        const currentDate = new Date().getDate();

        if (lastSeenDate === null || lastSeenDate !== currentDate) {
          setShowGreeting(true);

          // Update the last seen timestamp only once
          try {
            await api("/tasks/last-seen", {
              method: HttpMethod.POST,
              body: {},
            });
            // Mark as updated to prevent further calls
            setLastSeenUpdated(true);
          } catch (error) {
            console.error("Error updating last seen:", error);
          }
        } else {
          // If dates match, still mark as updated to prevent further calls
          setLastSeenUpdated(true);
        }
      }
    };

    checkAndUpdateLastSeen();
  }, [session, lastSeenData, lastSeenUpdated]);

  return {
    tasks,
    isTasksLoading,
    showGreeting,
    setShowGreeting,
    completedTasks: tasks.filter((task) => task.status === "completed").length,
    completionPercentage:
      tasks.length > 0
        ? (tasks.filter((task) => task.status === "completed").length /
            tasks.length) *
          100
        : 0,
    fetchData,
  };
};
