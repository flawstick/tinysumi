import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";
import { pushNotificationTokens, sessions } from "@/server/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware";

/**
 * Delete all tokens for a specific session (used when a session is terminated)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionToken: string }> },
) {
  const { user } = await authenticateRequest(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // await params
  const { sessionToken } = await params;

  // Admin check if needed
  if (user.role !== "admin") {
    // Check if the session belongs to the user
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.sessionToken, sessionToken),
        eq(sessions.userId, user.id),
      ),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized to manage this session" },
        { status: 403 },
      );
    }
  }

  try {
    // Find tokens for this session
    const tokens = await db.query.pushNotificationTokens.findMany({
      where: eq(pushNotificationTokens.sessionToken, sessionToken),
    });

    if (tokens.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No tokens found for this session",
      });
    }

    // Invalidate all tokens for this session
    await db
      .update(pushNotificationTokens)
      .set({ isValid: false })
      .where(eq(pushNotificationTokens.sessionToken, sessionToken));

    return NextResponse.json({
      success: true,
      message: `Invalidated ${tokens.length} push notification tokens`,
      count: tokens.length,
    });
  } catch (error) {
    console.error("Error invalidating session tokens:", error);
    return NextResponse.json(
      { error: "Failed to invalidate tokens" },
      { status: 500 },
    );
  }
}

/**
 * Get all tokens for a specific session
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionToken: string }> },
) {
  const { user } = await authenticateRequest(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // await params
  const { sessionToken } = await params;

  // Admin check if needed
  if (user.role !== "admin") {
    // Check if the session belongs to the user
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.sessionToken, sessionToken),
        eq(sessions.userId, user.id),
      ),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized to view this session" },
        { status: 403 },
      );
    }
  }

  try {
    // Get tokens for this session
    const tokens = await db.query.pushNotificationTokens.findMany({
      where: eq(pushNotificationTokens.sessionToken, sessionToken),
      orderBy: (tokens, { desc }) => [desc(tokens.lastUsed)],
    });

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("Error fetching session tokens:", error);
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 },
    );
  }
}
