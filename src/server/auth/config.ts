import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import { eq } from "drizzle-orm";
import DiscordProvider from "next-auth/providers/discord";

import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";

/**
 * this app is only for tiny and her owner
 * so, we only allow the owner to and her to sign in
 */
export type UserRole = "daddy" | "tiny";
export const allowedUsers: string[] = [
  "678386127899590659",
  "647127398961250316",
];

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      lastSeen?: string;
      metadata: Record<string, any> & { lastSeenTasks?: string };
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    signIn: async ({ account }) => {
      return allowedUsers.includes(account!.providerAccountId.toString());
    },
    session: async ({ session, user }) => {
      // Update lastSeen whenever a session is checked
      await db
        .update(users)
        .set({ lastSeen: new Date() })
        .where(eq(users.id, user.id));

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
} satisfies NextAuthConfig;
