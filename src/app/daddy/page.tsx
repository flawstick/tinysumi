"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ListTodo, Camera, Heart, Calendar, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const upcomingTasks = [
  { id: 1, title: "Buy groceries", dueDate: "2023-12-10", priority: "high" },
  {
    id: 2,
    title: "Plan date night",
    dueDate: "2023-12-15",
    priority: "medium",
  },
  {
    id: 3,
    title: "Schedule dentist appointment",
    dueDate: "2023-12-20",
    priority: "low",
  },
];

export default function AdminPage() {
  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-blue-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with user profile */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your website content and activity.
          </p>
        </div>
      </div>

      {/* Recent activity and upcoming tasks */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on the website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Camera className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">New memory added</p>
                  <p className="text-sm text-muted-foreground">
                    Beach Weekend Getaway
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Heart className="h-4 w-4 text-pink-500" />
                </Button>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Memory favorited</p>
                  <p className="text-sm text-muted-foreground">
                    Valentine&apos;s Day Surprise
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <ListTodo className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Task completed</p>
                  <p className="text-sm text-muted-foreground">Call parents</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
                <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  Completed
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View All Activity
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-4">
                  <div
                    className={`rounded-full p-2 ${
                      task.priority === "high"
                        ? "bg-red-100"
                        : task.priority === "medium"
                          ? "bg-yellow-100"
                          : "bg-blue-100"
                    }`}
                  >
                    <Clock
                      className={`h-4 w-4 ${getPriorityColor(task.priority)}`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Due {formatDate(task.dueDate)}
                      </p>
                    </div>
                    <div className="mt-2">
                      <div className="mb-1 flex justify-between text-xs">
                        <span>Progress</span>
                        <span>
                          {task.priority === "high"
                            ? "25%"
                            : task.priority === "medium"
                              ? "50%"
                              : "75%"}
                        </span>
                      </div>
                      <Progress
                        value={
                          task.priority === "high"
                            ? 25
                            : task.priority === "medium"
                              ? 50
                              : 75
                        }
                        className={`h-1.5 ${
                          task.priority === "high"
                            ? "bg-red-100"
                            : task.priority === "medium"
                              ? "bg-yellow-100"
                              : "bg-blue-100"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View All Tasks
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
