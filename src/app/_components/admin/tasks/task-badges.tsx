import { Badge } from "@/components/ui/badge";
import type { TaskPriority, TaskStatus } from "@/lib/types";

export const TaskBadges = {
  Priority: ({ priority }: { priority: TaskPriority }) => {
    switch (priority) {
      case "low":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/20 bg-blue-500/10 text-blue-500"
          >
            Low
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500/20 bg-yellow-500/10 text-yellow-500"
          >
            Medium
          </Badge>
        );
      case "high":
        return (
          <Badge
            variant="outline"
            className="border-red-500/20 bg-red-500/10 text-red-500"
          >
            High
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  },

  Status: ({ status }: { status: TaskStatus }) => {
    switch (status) {
      case "todo":
        return (
          <Badge
            variant="outline"
            className="border-slate-500/20 bg-slate-500/10 text-slate-500"
          >
            To Do
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/20 bg-blue-500/10 text-blue-500"
          >
            In Progress
          </Badge>
        );
      case "paused":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500/20 bg-yellow-500/10 text-yellow-500"
          >
            Paused
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="border-green-500/20 bg-green-500/10 text-green-500"
          >
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  },
};
