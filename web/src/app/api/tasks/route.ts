import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db";
import { tasks } from "@/server/db/schema";
import { checkUserRole } from "@/lib/auth";
import { and, eq, gte, lt, or, sql } from "drizzle-orm";

const addTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  dueDate: z.string().optional(),
});

// POST: Add a new task
export async function POST(request: NextRequest) {
  try {
    const user = await checkUserRole(request, ["daddy"]);
    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await request.json();
    const validatedData = addTaskSchema.parse(body);
    const newTask = await db
      .insert(tasks)
      .values({
        title: validatedData.title,
        description: validatedData.description,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        status: validatedData.status ?? "todo",
        priority: validatedData.priority ?? "medium",
        createdById: user.id,
      })
      .returning();
    return NextResponse.json(newTask[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
  }
}

// GET: Fetch filtered tasks
export async function GET(request: NextRequest) {
  try {
    const user = await checkUserRole(request, ["tiny", "daddy"]);
    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get today's date at the start of the day (midnight) in UTC
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    // Get tomorrow's date at the start of the day (midnight) in UTC
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setUTCDate(tomorrowStart.getUTCDate() + 1);

    // Get current date and time for overdue comparison
    const now = new Date();

    // Build the query to fetch:
    // 1. Completed tasks that were updated today (completed today)
    // 2. All in_progress tasks
    // 3. All todo or paused tasks
    // 4. All tasks that have a due date and are not completed
    const filteredTasks = await db
      .select()
      .from(tasks)
      .where(
        or(
          // Completed tasks that were updated today
          and(
            eq(tasks.status, "completed"),
            gte(tasks.updatedAt, todayStart),
            lt(tasks.updatedAt, tomorrowStart),
          ),
          // All in_progress tasks
          eq(tasks.status, "in_progress"),
          // All todo or paused tasks
          eq(tasks.status, "todo"),
          eq(tasks.status, "paused"),
          // Tasks with due date that aren't completed (includes overdue)
          and(
            sql`${tasks.dueDate} IS NOT NULL`,
            sql`${tasks.status} != 'completed'`,
          ),
        ),
      )
      .orderBy(tasks.status, tasks.dueDate, tasks.updatedAt);

    // For better UX, attach a flag to indicate if a task is overdue
    const tasksWithOverdueFlag = filteredTasks.map((task) => {
      const isOverdue =
        task.dueDate &&
        new Date(task.dueDate) < now &&
        task.status !== "completed";
      return {
        ...task,
        isOverdue,
      };
    });

    return NextResponse.json(tasksWithOverdueFlag);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}
