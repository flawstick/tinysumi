"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  Clock,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { FloatingNav } from "@/app/_components/floating-nav";
import { Home, ListTodo, Heart } from "lucide-react";
import { api } from "@/trpc/react";
import { type Task } from "@/lib/types";

const navItems = [
  {
    name: "Home",
    link: "/littlespace",
    icon: <Home className="h-4 w-4 text-pink-500" />,
  },
  {
    name: "Memories",
    link: "/littlespace/memories",
    icon: <Camera className="h-4 w-4 text-pink-500" />,
  },
  {
    name: "Tasks",
    link: "/littlespace/tasks",
    icon: <ListTodo className="h-4 w-4 text-pink-500" />,
  },
];

export default function TasksPage() {
  const router = useRouter();
  const utils = api.useUtils();

  // Fetch tasks using tRPC
  const { data: tasks = [] } = api.tasks.fetchTasks.useQuery();

  // Update task status mutation
  const updateTaskStatus = api.tasks.updateTaskStatus.useMutation({
    onSuccess: () => {
      // Invalidate and refetch tasks after successful update
      utils.tasks.fetchTasks.invalidate();
    },
  });

  // Get status badge color
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "bg-gray-200 text-gray-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = (status: Task["status"]) => {
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
        return "To Do";
    }
  };

  // Format date helper
  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pb-20">
      <FloatingNav navItems={navItems} />

      <div className="container mx-auto px-4 pt-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-4 p-2 text-pink-700 hover:bg-pink-100 hover:text-pink-800"
              onClick={() => router.push("/littlespace")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-pink-700 sm:text-3xl">
              Your Tasks
            </h1>
          </div>
          <div className="flex space-x-2">
            <Badge className="bg-blue-100 px-3 py-1 text-blue-800">
              <Clock className="mr-1 h-3 w-3" />
              <span>
                In Progress:{" "}
                {tasks.filter((t) => t.status === "in_progress").length}
              </span>
            </Badge>
            <Badge className="bg-green-100 px-3 py-1 text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              <span>
                Completed:{" "}
                {tasks.filter((t) => t.status === "completed").length}
              </span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`border-l-4 ${
                  task.status === "completed"
                    ? "border-l-green-500"
                    : task.status === "in_progress"
                      ? "border-l-blue-500"
                      : task.status === "paused"
                        ? "border-l-yellow-500"
                        : "border-l-gray-300"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-lg font-semibold ${
                            task.status === "completed"
                              ? "text-gray-500 line-through"
                              : "text-gray-800"
                          }`}
                        >
                          {task.title}
                        </h3>
                        <Badge className={getStatusColor(task.status)}>
                          {getStatusText(task.status)}
                        </Badge>
                      </div>
                      <p className="mb-2 text-sm text-gray-600">
                        {task.description}
                      </p>
                      {task.dueDate && (
                        <p className="text-xs text-gray-500">
                          Due: {formatDate(task.dueDate)}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {task.status === "todo" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 sm:w-auto"
                          onClick={() =>
                            updateTaskStatus.mutate({
                              taskId: task.id,
                              status: "in_progress",
                            })
                          }
                        >
                          <PlayCircle className="mr-1 h-4 w-4" />
                          Start
                        </Button>
                      )}

                      {task.status === "in_progress" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-yellow-200 text-yellow-600 hover:bg-yellow-50 sm:w-auto"
                            onClick={() =>
                              updateTaskStatus.mutate({
                                taskId: task.id,
                                status: "paused",
                              })
                            }
                          >
                            <PauseCircle className="mr-1 h-4 w-4" />
                            Pause
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-green-200 text-green-600 hover:bg-green-50 sm:w-auto"
                            onClick={() =>
                              updateTaskStatus.mutate({
                                taskId: task.id,
                                status: "completed",
                              })
                            }
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Complete
                          </Button>
                        </>
                      )}

                      {task.status === "paused" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 sm:w-auto"
                            onClick={() =>
                              updateTaskStatus.mutate({
                                taskId: task.id,
                                status: "in_progress",
                              })
                            }
                          >
                            <PlayCircle className="mr-1 h-4 w-4" />
                            Resume
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-green-200 text-green-600 hover:bg-green-50 sm:w-auto"
                            onClick={() =>
                              updateTaskStatus.mutate({
                                taskId: task.id,
                                status: "completed",
                              })
                            }
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Complete
                          </Button>
                        </>
                      )}

                      {task.status === "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 sm:w-auto"
                          onClick={() =>
                            updateTaskStatus.mutate({
                              taskId: task.id,
                              status: "todo",
                            })
                          }
                        >
                          Reopen
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-pink-100 p-4">
            <Heart className="h-6 w-6 fill-pink-500 text-pink-500" />
          </div>
          <p className="mt-4 font-medium text-pink-700">
            Complete your tasks and make time for what matters most!
          </p>
        </div>
      </div>
    </div>
  );
}
