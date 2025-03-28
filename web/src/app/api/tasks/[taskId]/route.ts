import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { checkUserRole } from "@/lib/auth";

const editTaskSchema = z.object({
  taskId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
});

// PUT: Edit a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  try {
    const user = await checkUserRole(request, ["daddy"]);
    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { taskId } = await params;
    const body = await request.json();
    const validatedData = editTaskSchema.parse({
      taskId,
      ...body,
    });

    const updatedTask = await db
      .update(tasks)
      .set({
        title: validatedData.title,
        description: validatedData.description,
        dueDate: validatedData.dueDate
          ? new Date(validatedData.dueDate)
          : undefined,
        priority: validatedData.priority,
        status: validatedData.status,
      })
      .where(eq(tasks.id, taskId))
      .returning();

    return NextResponse.json(updatedTask[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to edit task" }, { status: 500 });
  }
}

// DELETE: Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  try {
    const user = await checkUserRole(request, ["daddy"]);
    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { taskId } = await params;
    const deletedTask = await db
      .delete(tasks)
      .where(eq(tasks.id, taskId))
      .returning();

    return NextResponse.json(deletedTask[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) {
  try {
    const user = await checkUserRole(request, ["tiny", "daddy"]);
    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { taskId } = await params;

    // Query for a specific task
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 },
    );
  }
}
