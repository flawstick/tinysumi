import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { sessions } from "@/server/db/schema";
import { NextRequest } from "next/server";

/**
 * Authenticate a request using the bearer token from the Authorization header
 * Returns both the user and the sessionToken if authentication is successful
 */
export async function authenticateRequest(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, sessionToken: null };
  }

  const sessionToken = authHeader.substring(7); // Remove "Bearer " prefix

  if (!sessionToken) {
    return { user: null, sessionToken: null };
  }

  // Find the session with this token
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.sessionToken, sessionToken),
    with: {
      user: true,
    },
  });

  if (!session || new Date() > session.expires) {
    return { user: null, sessionToken: null };
  }

  return { user: session.user, sessionToken };
}
