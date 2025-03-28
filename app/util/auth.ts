// utils/auth.ts
import * as SecureStore from "expo-secure-store";

// Base URL of your API endpoint
export const API_URL = "http://10.0.0.17:3000/api";

// Define your custom session type based on your output
export interface SessionUser {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  role: "daddy" | "tiny";
  username: string | null;
  password: string | null;
  createdAt: string;
  lastSeen: string;
  metadata: { lastSeenTasks?: string };
}

export interface Session {
  sessionToken: string;
  userId: string;
  expires: string; // ISO date string
  user: SessionUser;
}

// Key to store session data securely
const SESSION_KEY = "auth_session";

// Function to retrieve a stored session
export const getSession = async (): Promise<Session | null> => {
  try {
    const storedSession = await SecureStore.getItemAsync(SESSION_KEY);
    if (storedSession) {
      const session = JSON.parse(storedSession) as Session;
      // Check for local expiration
      if (new Date(session.expires) < new Date()) {
        await SecureStore.deleteItemAsync(SESSION_KEY);
        return null;
      }
      return session;
    }
    return null;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
};

export async function getSessionTokenAsync(): Promise<string | null> {
  const session = await getSession();
  return session?.sessionToken ?? null;
}

// Simple sign in with username only
export const signIn = async (username: string): Promise<Session | null> => {
  try {
    console.log(`Signing in with username: ${username}`);

    const response = await fetch(`${API_URL}/eauth/discord-callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    console.log(`Sign in response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Sign in error: ${response.status} - ${errorText}`);

      if (response.status === 404) {
        console.error(`User "${username}" not found`);
      }

      return null;
    }

    const sessionData = (await response.json()) as Session;
    console.log(`Session received for: ${sessionData.user.username}`);

    if (sessionData && sessionData.sessionToken) {
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(sessionData));
      return sessionData;
    }

    return null;
  } catch (error) {
    console.error("Sign in error:", error);
    return null;
  }
};

// Sign out by calling your API and clearing the stored session
export const signOut = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    console.log("Signed out successfully");
  } catch (error) {
    console.error("Sign out error:", error);
  }
};
