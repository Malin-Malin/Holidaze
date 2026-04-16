const BASE_URL = "https://v2.api.noroff.dev";

/**
 * Generic API client to make HTTP requests.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} options - Fetch options including method, headers, and body.
 * @returns {Promise<object>} The parsed JSON response from the API.
 * @throws Will throw an error if the response is not ok.
 *
 * @example
 * // GET request
 * TODO: Update example to match actual API endpoints and data structure
 * // POST request
 * // PUT request
 * // DELETE request
 */
export async function apiClient<T, R>(
  endpoint: string,
  options: {
    body?: T;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
  } = {},
) {
  const { body, ...customOptions } = options;
  //TODO: Consider using a library like axios for better error handling and features like interceptors for token refresh
  //use state management to store tokens and user info instead of localStorage for better security and reactivity
  const accessToken = localStorage.getItem("accessToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const config: Record<string, unknown> = {
    method: body ? "POST" : "GET", // default GET unless body is provided
    ...customOptions, // allow overrides
    headers: {
      ...headers,
      ...customOptions.headers, // allow overrides
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(BASE_URL + endpoint, config);

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData?.errors?.[0] || `API error (${response.status})`;
      throw new Error(errorMessage);
    }

    return (await response.json()) as R;
  } catch (error) {
    console.error(error);
    console.error("API Client Error:", error);
    throw error; // Escalate to caller
  }
}

// Export helpers
export const get = <T,>(endpoint: string) => apiClient<undefined, T>(endpoint);

export const post = <T, R>(endpoint: string, body: T) =>
  apiClient<T, R>(endpoint, { method: "POST", body });

export const put = <T, R>(endpoint: string, body: T) =>
  apiClient<T, R>(endpoint, { method: "PUT", body });

export const del = <R,>(endpoint: string) =>
  apiClient<undefined, R>(endpoint, { method: "DELETE" });
