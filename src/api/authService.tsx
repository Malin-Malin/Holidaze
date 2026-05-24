const LOGIN_ENDPOINT = "/auth/login";

import { post } from "./api";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterData,
  RegisterResponse,
} from "../types/api.types";

/**
 * Authenticate a user by sending their email and password to the login endpoint.
 * On successful login, the API will return user information and an access token.
 * @param email
 * @param password
 * @returns A promise that resolves to the login response containing user info and access token.
 * @throws An error if the login request fails, which should be handled by the caller (e.g., to show an error message to the user).
 */
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

/**
 * Log out the user by clearing the access token from local storage.
 */
export async function logout() {
  localStorage.removeItem("accessToken");
}

/**
 * Register a new user by sending their details to the registration endpoint.
 * On successful registration, the API will return the user's information.
 * @param name The user's name.
 * @param email The user's email address.
 * @param password The user's password.
 * @param venueManager Optional boolean indicating if the user is a venue manager (default is false).
 * @returns A promise that resolves when the registration is successful.
 * @throws An error if the registration request fails, which should be handled by the caller (e.g., to show an error message to the user).
 */
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
