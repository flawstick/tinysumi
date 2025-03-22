import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "@/server/db";
import { users, sessions, accounts } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import type { InferSelectModel } from "drizzle-orm";

// Type definitions based on your schema
type User = InferSelectModel<typeof users>;
type Account = InferSelectModel<typeof accounts>;

// Input schema for the Discord callback mutation
const discordCallbackInput = z.object({
  code: z.string(),
  state: z.string(),
  // If you decide to support PKCE manually, you can add:
  // codeVerifier: z.string().optional(),
});

// List of allowed Discord user IDs (as strings)
const allowedUsers = ["678386127899590659", "647127398961250316"];

export const authRouter = createTRPCRouter({
  discordCallback: publicProcedure
    .input(discordCallbackInput)
    .mutation(async ({ input }) => {
      // 1. Exchange the authorization code for an access token
      let tokenData: {
        access_token: string;
        refresh_token?: string;
        expires_in?: number;
        token_type?: string;
        scope?: string;
      };

      try {
        const params = new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID!,
          client_secret: process.env.DISCORD_CLIENT_SECRET!,
          grant_type: "authorization_code",
          code: input.code,
          // Must match the redirect URI used on the client side
          redirect_uri: process.env.DISCORD_REDIRECT_URI!,
        });

        const tokenResponse = await fetch(
          "https://discord.com/api/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
          },
        );

        if (!tokenResponse.ok) {
          throw new Error(`HTTP error! status: ${tokenResponse.status}`);
        }

        tokenData = (await tokenResponse.json()) as {
          access_token: string;
          refresh_token?: string;
          expires_in?: number;
          token_type?: string;
          scope?: string;
        };
      } catch (error) {
        console.error("Error exchanging code:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error exchanging code for tokens",
          cause: error,
        });
      }

      const { access_token, refresh_token, expires_in } = tokenData;
      if (!access_token) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No access token received from Discord",
        });
      }

      // 2. Fetch Discord user information
      type DiscordUser = {
        id: string;
        username: string;
        email?: string;
        avatar?: string;
      };

      let discordUser: DiscordUser;
      try {
        const userResponse = await fetch("https://discord.com/api/users/@me", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error(`HTTP error! status: ${userResponse.status}`);
        }

        discordUser = (await userResponse.json()) as DiscordUser;
      } catch (error) {
        console.error("Error fetching Discord user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching Discord user info",
          cause: error,
        });
      }

      // 3. Check that the Discord user is allowed to sign in
      if (!allowedUsers.includes(discordUser.id)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not allowed to sign in",
        });
      }

      // 4. Look up user by Discord provider account
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
        return;
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
              eq(accounts.providerAccountId, discordUser.id),
            ),
          );
      }

      // 5. Create a session record in the database
      const sessionToken = crypto.randomUUID();
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // e.g., session valid for 7 days

      await db.insert(sessions).values({
        sessionToken,
        userId: userRecord.id,
        expires,
      });

      // 6. Return the session data to the client
      return {
        sessionToken,
        userId: userRecord.id,
        expires: expires.toISOString(),
        user: userRecord,
      };
    }),

  // Sign out procedure
  signOut: publicProcedure
    .input(z.object({ sessionToken: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .delete(sessions)
        .where(eq(sessions.sessionToken, input.sessionToken));

      return { success: true };
    }),
});
