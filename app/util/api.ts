import { getSessionTokenAsync } from "./auth";

const API_URL = "https://tinysumi.com/api";

// Enum for HTTP methods
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

// Generic type for API response
export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

// Interface for API request options
interface ApiRequestOptions<T> {
  method?: HttpMethod;
  body?: T;
  headers?: Record<string, string>;
}

// Main API utility function
export async function api<ResponseType = any, BodyType = any>(
  route: string,
  options: ApiRequestOptions<BodyType> = {},
): Promise<ApiResponse<ResponseType>> {
  // Get session token
  const sessionToken = await getSessionTokenAsync();
  if (!sessionToken) {
    return { error: "No session token found" };
  }

  // Default to GET method if not specified
  const method = options.method ?? HttpMethod.GET;

  try {
    // Prepare headers
    const headers: Record<string, string> = {
      Authorization: `Bearer ${sessionToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Prepare request configuration
    const config: RequestInit = {
      method,
      headers,
      ...(options.body && { body: JSON.stringify(options.body) }),
    };

    // Make the request
    const response = await fetch(API_URL.concat(route), config);

    // Handle response
    if (!response.ok) {
      // Try to parse error message
      const errorBody = await response.json().catch(() => ({}));
      return {
        error: errorBody.error || `HTTP error! status: ${response.status}`,
      };
    }

    // Parse and return successful response
    const data = await response.json();
    return { data };
  } catch (error) {
    // Handle network errors or parsing errors
    console.error("API request failed:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

// Helper functions for specific HTTP methods
export const apiGet = <ResponseType = any>(route: string) =>
  api<ResponseType>(route);

export const apiPost = <ResponseType = any, BodyType = any>(
  route: string,
  body: BodyType,
) => api<ResponseType, BodyType>(route, { method: HttpMethod.POST, body });

export const apiPut = <ResponseType = any, BodyType = any>(
  route: string,
  body: BodyType,
) => api<ResponseType, BodyType>(route, { method: HttpMethod.PUT, body });

export const apiPatch = <ResponseType = any, BodyType = any>(
  route: string,
  body: BodyType,
) => api<ResponseType, BodyType>(route, { method: HttpMethod.PATCH, body });

export const apiDelete = <ResponseType = any>(route: string) =>
  api<ResponseType>(route, { method: HttpMethod.DELETE });
