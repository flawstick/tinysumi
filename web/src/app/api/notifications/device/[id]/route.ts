import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";
import { pushNotificationTokens } from "@/server/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/middleware";

// Schema for updating a token
const updateTokenSchema = z.object({
  deviceName: z.string().optional(),
  isValid: z.boolean().optional(),
});

/**
 * Update a device token
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user } = await authenticateRequest(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const validationResult = updateTokenSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validationResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    // Check if the token belongs to the user
    const token = await db.query.pushNotificationTokens.findFirst({
      where: and(
        eq(pushNotificationTokens.id, id),
        eq(pushNotificationTokens.userId, user.id),
      ),
    });

    if (!token) {
      return NextResponse.json(
        { error: "Token not found or unauthorized" },
        { status: 404 },
      );
    }

    // Update the token
    await db
      .update(pushNotificationTokens)
      .set({
        ...validationResult.data,
        lastUsed: new Date(),
      })
      .where(eq(pushNotificationTokens.id, id));

    return NextResponse.json({
      success: true,
      message: "Device token updated",
    });
  } catch (error) {
    console.error("Error updating device token:", error);
    return NextResponse.json(
      { error: "Failed to update device token" },
      { status: 500 },
    );
  }
}

/**
 * Delete a device token
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user } = await authenticateRequest(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
      const { id } = await params;

    // Delete by ID
    const result = await db
      .delete(pushNotificationTokens)
      .where(
        and(
          eq(pushNotificationTokens.id, id),
          eq(pushNotificationTokens.userId, user.id),
        ),
      )
      .returning({ id: pushNotificationTokens.id });

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Token not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Device token deleted",
    });
  } catch (error) {
    console.error("Error deleting device token:", error);
    return NextResponse.json(
      { error: "Failed to delete device token" },
      { status: 500 },
    );
  }
}
