// File: app/api/tasks/last-seen/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { checkUserRole } from "@/lib/auth";
import { z } from "zod";

const updateLastSeenSchema = z.object({
  timestamp: z.string().optional(),
});

// POST: Update last seen tasks
export async function POST(request: NextRequest) {
  try {
    const user = await checkUserRole(request, ["tiny", "daddy"]);
    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateLastSeenSchema.parse(body);
    const timestamp = validatedData.timestamp ?? new Date().toISOString();

    const updatedUser = await db
      .update(users)
      .set({
        metadata: {
          ...user.metadata,
          lastSeenTasks: timestamp,
        },
      })
      .where(eq(users.id, user.id))
      .returning();

    if (!updatedUser.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ lastSeenTasks: timestamp });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update last seen tasks" },
      { status: 500 },
    );
  }
}

// GET: Get last seen tasks
export async function GET(request: NextRequest) {
  try {
    const user = await checkUserRole(request, ["tiny", "daddy"]);
    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      lastSeenTasks: user.metadata?.lastSeenTasks ?? null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get last seen tasks" },
      { status: 500 },
    );
  }
}
