"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type Task, type NewTask, type EditTask } from "@/lib/types";
import { AddTaskDialog } from "@/app/_components/admin/tasks/add-task-dialog";
import { EditTaskDialog } from "@/app/_components/admin/tasks/edit-task-dialog";
import { TaskTable } from "@/app/_components/admin/tasks/task-table";
import { DeleteTaskDialog } from "@/app/_components/admin/tasks/delete-task-dialog";
import { api } from "@/trpc/react";

export default function AdminTasks() {
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });

  const [editingTask, setEditingTask] = useState<EditTask | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Fetch tasks query
  const { data: tasks = [] } = api.tasks.fetchTasks.useQuery();

  const utils = api.useUtils();

  const addTaskMutation = api.tasks.addTask.useMutation({
    onSuccess: async () => {
      await utils.tasks.fetchTasks.invalidate();
      setIsNewTaskDialogOpen(false);
      setNewTask({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
      });
    },
  });

  const editTaskMutation = api.tasks.editTask.useMutation({
    onSuccess: async () => {
      await utils.tasks.fetchTasks.invalidate();
      setIsEditDialogOpen(false);
      setEditingTask(null);
    },
  });

  const deleteTaskMutation = api.tasks.deleteTask.useMutation({
    onSuccess: async () => {
      await utils.tasks.fetchTasks.invalidate();
      setTaskToDelete(null);
      setIsDeleteDialogOpen(false);
    },
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    addTaskMutation.mutate({
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      status: "todo",
      priority: newTask.priority,
    });
  };

  const handleSaveEdit = () => {
    if (!editingTask) return;

    const editTaskData: EditTask = {
      taskId: editingTask.taskId,
      title: editingTask.title,
      description: editingTask.description,
      status: editingTask.status,
      priority: editingTask.priority,
      dueDate: editingTask.dueDate,
    };

    editTaskMutation.mutate(editTaskData);
  };

  const handleDeleteTask = () => {
    if (!taskToDelete) return;
    deleteTaskMutation.mutate({ taskId: taskToDelete });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask({
      ...task,
      taskId: task.id,
      dueDate: task.dueDate.toISOString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage tasks for your girlfriend.
          </p>
        </div>
        <Button onClick={() => setIsNewTaskDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>
            View and manage all tasks. Click on a task to edit or delete it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskTable
            tasks={tasks as Task[]}
            onEdit={handleEditTask}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      <AddTaskDialog
        isOpen={isNewTaskDialogOpen}
        onOpenChange={setIsNewTaskDialogOpen}
        newTask={newTask}
        setNewTask={setNewTask}
        onAddTask={handleAddTask}
      />

      <EditTaskDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        onSaveEdit={handleSaveEdit}
      />

      <DeleteTaskDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
