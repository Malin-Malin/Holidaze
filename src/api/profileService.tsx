import type { Profile, ProfileData } from "../types/profile.types";
import type { ApiResponse } from "../types/api.types";
import type { Booking, Venue } from "../types/venue.types";
import { get, put } from "./api";

const PROFILES_ENDPOINT = "/holidaze/profiles";

/**
 * Fetch all profiles from the API.
 * @returns An array of profile objects returned from the API.
 * @throws Will throw an error if the API request fails.
 */
async function getProfiles() {
  try {
    const response = await get<ApiResponse<Profile[]>>(PROFILES_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error; // Let the caller handle the error
  }
}

/**
 * Fetch a profile by its name from the API.
 * @param name The name of the profile to fetch.
 * @returns The profile object returned from the API.
 * @throws Will throw an error if the API request fails.
 */
async function getProfileByName(name: string) {
  try {
    const response = await get<ApiResponse<Profile>>(
      `${PROFILES_ENDPOINT}/${name}?_venues=true&_bookings=true`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching profile with name ${name}:`, error);
    throw error; // Let the caller handle the error
  }
}

/**
 * Update a profile by its name with the provided profile data.
 * @param name The name of the profile to update.
 * @param profileData The data to update the profile with.
 * @returns The updated profile object returned from the API.
 * @throws Will throw an error if the API request fails.
 */
async function updateProfile(name: string, profileData: ProfileData) {
  try {
    const response = await put<ProfileData, ApiResponse<Profile>>(
      `${PROFILES_ENDPOINT}/${name}`,
      profileData,
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating profile with name ${name}:`, error);
    throw error; // Let the caller handle the error
  }
}

/**
 * Fetch venues for a profile by its name from the API.
 * @param name The name of the profile whose venues to fetch.
 * @param includeBookings Whether to include bookings in the response.
 * @returns An array of venue objects returned from the API.
 * @throws Will throw an error if the API request fails.
 */
async function getVenuesByProfileName(name: string, includeBookings = false) {
  try {
    const query = includeBookings ? "?_bookings=true" : "";
    const response = await get<ApiResponse<Venue[]>>(
      `${PROFILES_ENDPOINT}/${name}/venues${query}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching venues for profile with name ${name}:`,
      error,
    );
    throw error; // Let the caller handle the error
  }
}

/**
 * Fetch bookings for a profile by its name from the API.
 * @param name The name of the profile whose bookings to fetch.
 * @returns An array of booking objects returned from the API.
 * @throws Will throw an error if the API request fails.
 */
async function getBookingsByProfileName(name: string) {
  try {
    const response = await get<ApiResponse<Booking[]>>(
      `${PROFILES_ENDPOINT}/${name}/bookings?_venue=true`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching bookings for profile with name ${name}:`,
      error,
    );
    throw error; // Let the caller handle the error
  }
}

/**
 * Search for profiles by a query string.
 * @param query The search query string.
 * @returns An array of profile objects matching the search query.
 * @throws Will throw an error if the API request fails.
 */
async function searchProfiles(query: string) {
  try {
    const response = await get<ApiResponse<Profile[]>>(
      `${PROFILES_ENDPOINT}?search=${encodeURIComponent(query)}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error searching profiles with query "${query}":`, error);
    throw error; // Let the caller handle the error
  }
}

export {
  getProfiles,
  getProfileByName,
  updateProfile,
  getVenuesByProfileName,
  getBookingsByProfileName,
  searchProfiles,
};
