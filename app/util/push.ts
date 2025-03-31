import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { apiPost, apiGet, apiDelete, apiPut } from "./api";

/**
 * Request permission and get Expo push token
 */
export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } else {
    alert("Must use physical device for Push Notifications");
  }
}

/**
 * Register push token with the server
 */
export async function registerDeviceToken(
  expoToken: string,
  deviceName?: string,
) {
  try {
    const device = Device.deviceName || Device.modelName || "Unknown device";
    const response = await apiPost("/notifications/device", {
      expoToken,
      deviceName: deviceName || device,
    });

    if (response.error) {
      console.error("Failed to register device token:", response.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error registering device token:", error);
    return false;
  }
}

/**
 * Get all registered device tokens for the current user
 */
export async function getDeviceTokens() {
  try {
    const response = await apiGet("/notifications/device");

    if (response.error) {
      console.error("Failed to fetch device tokens:", response.error);
      return [];
    }

    return response.data?.tokens || [];
  } catch (error) {
    console.error("Error fetching device tokens:", error);
    return [];
  }
}

/**
 * Delete a device token by ID
 */
export async function deleteDeviceToken(id: string) {
  try {
    const response = await apiDelete(`/notifications/device/${id}`);

    if (response.error) {
      console.error("Failed to delete device token:", response.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting device token:", error);
    return false;
  }
}

/**
 * Update a device token (e.g., rename device)
 */
export async function updateDeviceToken(
  id: string,
  updates: { deviceName?: string; isValid?: boolean },
) {
  try {
    const response = await apiPut(`/notifications/device/${id}`, updates);

    if (response.error) {
      console.error("Failed to update device token:", response.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating device token:", error);
    return false;
  }
}

/**
 * Complete registration flow - request permissions, get token and register with server
 * Returns the token ID if successful, null otherwise
 */
export async function setupPushNotifications(
  deviceName?: string,
): Promise<{ tokenId?: string; success: boolean }> {
  try {
    const expoToken = "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]";

    if (!expoToken) {
      return { success: false };
    }

    const response = await apiPost("/notifications/device", {
      expoToken,
      deviceName:
        deviceName || Device.deviceName || Device.modelName || "Unknown device",
    });

    if (response.error) {
      console.error("Failed to register device token:", response.error);
      return { success: false };
    }

    return {
      success: true,
      tokenId: response.data?.tokenId,
    };
  } catch (error) {
    console.error("Error setting up push notifications:", error);
    return { success: false };
  }
}
