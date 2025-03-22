import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

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
  expires: string;
  user: SessionUser;
}

const SESSION_KEY = "auth_session";
const API_URL = "https://tinysumi.com/api/auth";

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Initialize WebBrowser
WebBrowser.maybeCompleteAuthSession();

export const signIn = async (): Promise<Session | null> => {
  try {
    // Create a specific auth URL with mobile flag
    const authUrl = `${API_URL}/signin?platform=mobile`;

    // The URL to watch for (this corresponds to the redirect URL in NextAuth config)
    const successUrl = "https://tinysumi.com/?auth=success";

    console.log("Opening auth browser session to:", authUrl);

    // Open the auth browser
    const result = await WebBrowser.openAuthSessionAsync(authUrl, successUrl, {
      showInRecents: true,
      dismissButtonStyle: "done",
      preferEphemeralSession: false,
    });

    console.log("Auth browser result:", result);

    // Check if we got a success result (redirect to our successUrl happened)
    if (result.type === "success") {
      // Give the system a moment to complete the auth process
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Now try to fetch the session
      const session = await fetchSession();
      console.log("Session after auth:", session ? "Success" : "Failed");

      if (session) {
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
        return session;
      }
    } else {
      console.log("Auth was not successful or was canceled");
    }

    return null;
  } catch (error) {
    console.error("Error in signIn:", error);
    return null;
  }
};

export const fetchSession = async (): Promise<Session | null> => {
  try {
    // Different approach based on platform
    const options =
      Platform.OS === "ios" ? { headers: { "Cache-Control": "no-cache" } } : {};

    // Try to get the session with proper credentials
    const response = await axios.get(`${API_URL}/session`, {
      ...options,
      withCredentials: true,
    });

    if (response.data?.user) {
      return response.data as Session;
    }
    return null;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
};

export const getSession = async (): Promise<Session | null> => {
  try {
    // First check local storage
    const storedSession = await SecureStore.getItemAsync(SESSION_KEY);

    if (storedSession) {
      const parsedSession = JSON.parse(storedSession) as Session;

      // Check if session is expired
      const expiryDate = new Date(parsedSession.expires);
      if (expiryDate > new Date()) {
        // Not expired, we can use it
        return parsedSession;
      }
    }

    // If no stored session or expired, try fetching from server
    return await fetchSession();
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await axios.post(`${API_URL}/signout`);
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch (error) {
    console.error("Sign-out error:", error);
    // Still delete local session
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getSession();
  return !!session;
};
