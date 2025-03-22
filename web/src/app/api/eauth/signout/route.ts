// app/api/auth/discord-callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { users, sessions, accounts } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import type { InferSelectModel } from "drizzle-orm";

// Type definitions based on your schema
type User = InferSelectModel<typeof users>;
type Account = InferSelectModel<typeof accounts>;

// List of allowed Discord user IDs (as strings)
const allowedUsers = ["678386127899590659", "647127398961250316"];

export async function POST(request: NextRequest) {
  try {
    // 1. Get input from request body
    const body = await request.json();
    const { code, state } = body;

    if (!code || !state) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // 2. Exchange the authorization code for an access token
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
    });

    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!tokenResponse.ok) {
      console.error(`Token error: ${tokenResponse.status}`);
      return NextResponse.json(
        { error: "Failed to exchange code for token" },
        { status: 500 },
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    if (!access_token) {
      return NextResponse.json(
        { error: "No access token received" },
        { status: 500 },
      );
    }

    // 3. Fetch Discord user information
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user information" },
        { status: 500 },
      );
    }

    const discordUser = await userResponse.json();

    // 4. Check that the Discord user is allowed to sign in
    if (!allowedUsers.includes(discordUser.id)) {
      return NextResponse.json(
        { error: "User is not authorized" },
        { status: 403 },
      );
    }

    // 5. Look up user by Discord provider account
    const existingAccounts = await db
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.provider, "discord"),
          eq(accounts.providerAccountId, discordUser.id),
        ),
      );

    const existingAccount = existingAccounts[0] as Account | undefined;

    let userRecord: User | undefined;

    if (existingAccount) {
      // Get user from the existing account
      const userRecords = await db
        .select()
        .from(users)
        .where(eq(users.id, existingAccount.userId));

      userRecord = userRecords[0] as User | undefined;

      // Update the user's information
      if (userRecord) {
        await db
          .update(users)
          .set({
            lastSeen: new Date().toISOString(),
            name: discordUser.username,
            image: discordUser.avatar
              ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
              : userRecord.image,
          })
          .where(eq(users.id, userRecord.id));

        // Get the updated user record
        const updatedUserRecords = await db
          .select()
          .from(users)
          .where(eq(users.id, userRecord.id));

        userRecord = updatedUserRecords[0] as User;
      }
    }

    if (!userRecord) {
      // Create a new user
      const newUserRecords = await db
        .insert(users)
        .values({
          name: discordUser.username,
          email:
            discordUser.email || `${discordUser.id}@discord.placeholder.com`,
          image: discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : null,
          role: "tiny", // or "daddy" based on your business logic
          username: discordUser.username,
          createdAt: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          metadata: {},
        })
        .returning();

      userRecord = newUserRecords[0] as User;

      // Create the account record linking Discord to this user
      await db.insert(accounts).values({
        userId: userRecord.id,
        type: "oauth" as const,
        provider: "discord",
        providerAccountId: discordUser.id,
        access_token,
        refresh_token,
        expires_at: expires_in
          ? Math.floor(Date.now() / 1000) + expires_in
          : null,
        token_type: tokenData.token_type,
        scope: tokenData.scope,
      });
    } else if (!existingAccount) {
      // If user exists but account doesn't (rare case), create the account link
      await db.insert(accounts).values({
        userId: userRecord.id,
        type: "oauth" as const,
        provider: "discord",
        providerAccountId: discordUser.id,
        access_token,
        refresh_token,
        expires_at: expires_in
          ? Math.floor(Date.now() / 1000) + expires_in
          : null,
        token_type: tokenData.token_type,
        scope: tokenData.scope,
      });
    } else {
      // Update the existing account with fresh tokens
      await db
        .update(accounts)
        .set({
          access_token,
          refresh_token,
          expires_at: expires_in
            ? Math.floor(Date.now() / 1000) + expires_in
            : existingAccount.expires_at,
          token_type: tokenData.token_type,
          scope: tokenData.scope,
        })
        .where(
          and(
            eq(accounts.provider, "discord"),
            eq(accounts.providerAccountId, discordUser.id as string),
          ),
        );
    }

    // 6. Create a session record in the database
    const sessionToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(sessions).values({
      sessionToken,
      userId: userRecord.id,
      expires,
    });

    // 7. Return the session data
    return NextResponse.json({
      sessionToken,
      userId: userRecord.id,
      expires: expires.toISOString(),
      user: userRecord,
    });
  } catch (error) {
    console.error("Discord callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
