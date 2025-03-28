import { db } from "@/server/db";
import { sessions, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function getUserFromSession(request: NextRequest) {
  // Extract session token from Authorization header
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return null;
  }
  const sessionToken = authHeader.replace("Bearer ", "");

  // Find the session and associated user
  const sessionResult = await db
    .select({
      userId: sessions.userId,
      expires: sessions.expires,
      user: {
        id: users.id,
        role: users.role,
        name: users.name,
        email: users.email,
        metadata: users.metadata,
      },
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.sessionToken, sessionToken))
    .limit(1);

  // Check if session exists and hasn't expired
  if (sessionResult.length === 0 || new Date() > sessionResult[0]!.expires) {
    return null;
  }

  return {
    ...sessionResult[0]!.user,
    expires: sessionResult[0]!.expires,
  };
}

export async function checkUserRole(
  request: NextRequest,
  requiredRoles: string[],
) {
  const user = await getUserFromSession(request);

  if (!user || !requiredRoles.includes(user.role)) {
    return null;
  }

  return user;
}
