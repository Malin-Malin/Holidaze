const LOGIN_ENDPOINT = "/auth/login";

import { post } from "./api";
import type { ApiResponse } from "../types/api.types";
import type { Media } from "../types/common.types";

//TODO: Make work now, then refactor to AXIOS or improve token storage and state management later.

interface LoginResponse {
  //TODO: Adjust these fields based on the actual API response structure
  name: string;
  email: string;
  bio?: string;
  venueManager?: boolean;
  avatar?: Media;
  banner?: Media;
  accessToken: string;
}

interface RegisterResponse {
  name: string;
  email: string;
  bio?: string;
  venueManager?: boolean;
  avatar?: Media;
  banner?: Media;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  bio?: string;
  venueManager?: boolean;
  avatar?: Media;
  banner?: Media;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const response = await post<LoginRequest, ApiResponse<LoginResponse>>(
      LOGIN_ENDPOINT + "?_holidaze=true",
      { email, password },
    );
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error; // Let the caller handle the error (e.g., show a message to the user)
  }
}

// TODO: Implement logout, user registration .

export async function logout() {
  // Clear tokens and user info from storage
  localStorage.removeItem("accessToken");
  // Optionally, you could also make an API call to invalidate the token on the server
}

export async function register(
  name: string,
  email: string,
  password: string,
  venueManager = false,
): Promise<void> {
  try {
    const response = await post<RegisterData, ApiResponse<RegisterResponse>>(
      "/auth/register",
      { name, email, password, venueManager },
    );
    if (response) {
      console.log("Registration successful");
    }
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}
