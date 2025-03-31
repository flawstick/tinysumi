import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { pushNotificationTokens, sessions } from "@/server/db/schema";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handle signout - clean up push notification tokens
 * This would be used in addition to your normal signout handler
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionToken = authHeader.substring(7);

  if (!sessionToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    // Find the session
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.sessionToken, sessionToken),
      with: { user: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Invalidate all push notification tokens for this session
    await db
      .update(pushNotificationTokens)
      .set({ isValid: false })
      .where(eq(pushNotificationTokens.sessionToken, sessionToken));

    // Delete session from databsae
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));

    return NextResponse.json({
      success: true,
      message: "Signed out and invalidated push notification tokens",
    });
  } catch (error) {
    console.error("Error during signout:", error);
    return NextResponse.json(
      { error: "Failed to process signout" },
      { status: 500 },
    );
  }
}
