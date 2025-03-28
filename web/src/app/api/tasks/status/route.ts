// File: app/api/tasks/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { checkUserRole } from "@/lib/auth";

const allowedStatuses = ["todo", "in_progress", "paused", "completed"] as const;

const updateTaskStatusSchema = z.object({
  taskId: z.string(),
  status: z.enum(allowedStatuses),
});

// PATCH: Update task status
export async function PATCH(request: NextRequest) {
  try {
    const user = await checkUserRole(request, ["tiny", "daddy"]);
    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateTaskStatusSchema.parse(body);

    const updatedTask = await db
      .update(tasks)
      .set({
        status: validatedData.status,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, validatedData.taskId))
      .returning();

    if (!updatedTask.length) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update task status" },
      { status: 500 },
    );
  }
}
