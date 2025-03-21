"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  CheckCircle,
  Clock,
  Calendar,
  Camera,
  ListTodo,
  ArrowRight,
  Home,
} from "lucide-react";
import { api } from "@/trpc/react";
import { type Task } from "@/lib/types";
import { FloatingNav } from "../_components/floating-nav";

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

export default function LittleSpacePage() {
  const [showGreeting, setShowGreeting] = useState(true);

  // Fetch tasks using tRPC
  const { data: tasks = [] } = api.tasks.fetchTasks.useQuery();

  // Sample memories data (TODO: Implement memories feature)
  const memories = [
    {
      id: 1,
      title: "First date night",
      date: "June 15",
      location: "Italian Restaurant",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Beach day together",
      date: "July 22",
      location: "Sunset Beach",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Movie night",
      date: "August 5",
      location: "Home",
      image: "/placeholder.svg?height=200&width=300",
    },
  ];

  // Calculate task completion percentage for today's tasks
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todaysTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate!);
    return taskDate >= todayStart;
  });

  const completedTasks = todaysTasks.filter(
    (task) => task.status === "completed",
  ).length;
  const completionPercentage =
    todaysTasks.length > 0 ? (completedTasks / todaysTasks.length) * 100 : 0;

  // Helper function to get priority styling
  const getPriorityStyle = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          icon: "text-red-500",
        };
      case "medium":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: "text-yellow-500",
        };
      case "low":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: "text-blue-500",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: "text-gray-500",
        };
    }
  };

  // Helper function to format date
  const formatDate = (date: Date | null) => {
    if (!date) return "No due date";
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (taskDate.toDateString() === today.toDateString()) return "Today";
    if (taskDate.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return taskDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <FloatingNav navItems={navItems} />

      {/* Initial greeting overlay */}
      {showGreeting && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-pink-100/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="max-w-md p-8 text-center"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mx-auto mb-6 h-24 w-24 overflow-hidden rounded-full border-4 border-pink-300 shadow-lg">
              <Image
                src="/placeholder.svg?height=96&width=96"
                alt="Sumi"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-pink-700">
              Welcome back, Sumi!
            </h1>
            <p className="mb-8 text-xl text-pink-600">
              Are you ready to please daddy today?
            </p>
            <Button
              className="rounded-full bg-pink-500 px-8 py-6 text-lg text-white shadow-lg transition-all duration-300 hover:bg-pink-600 hover:shadow-xl"
              onClick={() => setShowGreeting(false)}
            >
              Yes, I'm ready!
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 mt-12 text-center">
          <h1 className="mb-2 text-3xl font-bold text-pink-700">
            Sumi's Little Space
          </h1>
          <p className="text-pink-600">
            Your special place for tasks and memories
          </p>
        </header>

        {/* Daily overview */}
        <Card className="mb-8 border-pink-200 shadow-md">
          <CardHeader className="border-b border-pink-100 pb-2">
            <CardTitle className="flex items-center text-2xl text-pink-700">
              <Heart className="mr-2 h-5 w-5 fill-pink-500 text-pink-500" />
              Daily Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex-1">
                <h3 className="mb-2 flex items-center font-medium text-pink-700">
                  <CheckCircle className="mr-2 h-4 w-4 text-pink-500" />
                  Today's Task Completion
                </h3>
                <div className="mb-2 h-4 rounded-full bg-pink-100">
                  <div
                    className="h-4 rounded-full bg-gradient-to-r from-pink-400 to-pink-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-pink-600">
                  <span>
                    {completedTasks}/{todaysTasks.length} tasks completed
                  </span>
                  <span>{Math.round(completionPercentage)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks overview */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="border-pink-200 shadow-md">
            <CardHeader className="border-b border-pink-100 pb-2">
              <CardTitle className="flex items-center text-xl text-pink-700">
                <ListTodo className="mr-2 h-5 w-5 text-pink-500" />
                Your Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {todaysTasks.map((task) => {
                  const priorityStyle = getPriorityStyle(task.priority);
                  return (
                    <div key={task.id} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 rounded-full p-1 ${
                          task.status === "completed"
                            ? "bg-green-100"
                            : priorityStyle.bg
                        }`}
                      >
                        {task.status === "completed" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className={`h-4 w-4 ${priorityStyle.icon}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            task.status === "completed"
                              ? "text-gray-400 line-through"
                              : "text-gray-700"
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-pink-400" />
                          <p className="text-xs text-pink-600">
                            Due: {formatDate(task.dueDate)}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`${priorityStyle.bg} ${priorityStyle.text}`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="border-t border-pink-100 pt-4">
              <Link href="/littlespace/tasks" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-pink-200 text-pink-600 hover:bg-pink-50"
                >
                  View All Tasks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Memories overview */}
          <Card className="border-pink-200 shadow-md">
            <CardHeader className="border-b border-pink-100 pb-2">
              <CardTitle className="flex items-center text-xl text-pink-700">
                <Camera className="mr-2 h-5 w-5 text-pink-500" />
                Special Memories
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {memories.map((memory) => (
                  <div key={memory.id} className="flex gap-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={memory.image || "/placeholder.svg"}
                        alt={memory.title}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">
                        {memory.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-pink-400" />
                        <p className="text-xs text-pink-600">{memory.date}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {memory.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-pink-100 pt-4">
              <Link href="/memories" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-pink-200 text-pink-600 hover:bg-pink-50"
                >
                  View All Memories
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Affirmation card */}
        <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 shadow-md">
          <CardContent className="p-6 text-center">
            <h3 className="mb-3 text-xl font-medium text-pink-700">
              Today's Affirmation
            </h3>
            <p className="mb-4 italic text-pink-600">
              "You are daddy's good little girl. Always remember how special and
              loved you are."
            </p>
            <div className="flex justify-center">
              <Heart className="h-6 w-6 fill-pink-500 text-pink-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
