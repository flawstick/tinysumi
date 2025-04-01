import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";
import { pushNotificationTokens } from "@/server/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/middleware";

// Schema for creating/updating a token
const tokenSchema = z.object({
  expoToken: z.string().min(1),
  deviceName: z.string().optional(),
});

/**
 * Register a new push notification token
 */
export async function POST(request: NextRequest) {
  const { user, sessionToken } = await authenticateRequest(request);

  if (!user || !sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validationResult = tokenSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validationResult.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { expoToken, deviceName } = validationResult.data;

    // Check if token already exists for this user and session
    const existingToken = await db.query.pushNotificationTokens.findFirst({
      where: and(
        eq(pushNotificationTokens.userId, user.id),
        eq(pushNotificationTokens.expoToken, expoToken),
      ),
    });

    if (existingToken) {
      // Update the existing token
      await db
        .update(pushNotificationTokens)
        .set({
          isValid: true,
          lastUsed: new Date(),
          deviceName: deviceName || existingToken.deviceName,
        })
        .where(eq(pushNotificationTokens.id, existingToken.id));

      return NextResponse.json({
        success: true,
        message: "Device token updated",
        tokenId: existingToken.id,
      });
    }

    // Create new token
    const newToken = await db
      .insert(pushNotificationTokens)
      .values({
        userId: user.id,
        expoToken,
        deviceName: deviceName || "Unknown device",
        sessionToken, // Link to the current session
        isValid: true,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Device token registered",
        tokenId: newToken[0]!.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering device token:", error);
    return NextResponse.json(
      { error: "Failed to register device token" },
      { status: 500 },
    );
  }
}

/**
 * Get all device tokens for the current user
 */
export async function GET(request: NextRequest) {
  const { user } = await authenticateRequest(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tokens = await db.query.pushNotificationTokens.findMany({
      where: eq(pushNotificationTokens.userId, user.id),
      orderBy: (tokens, { desc }) => [desc(tokens.lastUsed)],
      with: {
        session: true,
      },
    });

    // Add session status (active/expired) to each token
    const tokensWithSessionStatus = tokens.map((token) => {
      let sessionStatus = "unknown";
      if (token.session) {
        sessionStatus =
          new Date() > token.session.expires ? "expired" : "active";
      }

      // Don't return the entire session object to the client
      const { session, ...tokenData } = token;

      return {
        ...tokenData,
        sessionStatus,
      };
    });

    return NextResponse.json({ tokens: tokensWithSessionStatus });
  } catch (error) {
    console.error("Error fetching device tokens:", error);
    return NextResponse.json(
      { error: "Failed to fetch device tokens" },
      { status: 500 },
    );
  }
}
