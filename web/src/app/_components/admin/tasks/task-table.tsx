import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Task } from "@/lib/types";
import { TaskBadges } from "./task-badges";
import { TaskActions } from "./task-actions";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%] md:w-auto">Title</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Priority</TableHead>
            <TableHead className="hidden md:table-cell">Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">
                <div>
                  {task.title}
                  <div className="mt-1 flex flex-wrap gap-2 md:hidden">
                    <TaskBadges.Status status={task.status} />
                    <TaskBadges.Priority priority={task.priority} />
                  </div>
                  {task.dueDate && (
                    <div className="mt-1 text-xs text-muted-foreground md:hidden">
                      Due: {formatDate(task.dueDate.toISOString())}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <TaskBadges.Status status={task.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <TaskBadges.Priority priority={task.priority} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(task.dueDate?.toISOString())}
              </TableCell>
              <TableCell className="text-right">
                <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No tasks found. Add a task to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
