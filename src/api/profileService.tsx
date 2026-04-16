import type { Profile, ProfileData } from "../types/profile.types";
import type { ApiResponse } from "../types/api.types";
import { get, put } from "./api";

const PROFILES_ENDPOINT = "/holidaze/profiles";

async function getProfiles() {
  try {
    const response = await get<ApiResponse<Profile[]>>(PROFILES_ENDPOINT);
    return response;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error; // Let the caller handle the error
  }
}

async function getProfileByName(name: string) {
  try {
    const response = await get<ApiResponse<Profile>>(
      `${PROFILES_ENDPOINT}/${name}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching profile with name ${name}:`, error);
    throw error; // Let the caller handle the error
  }
}

async function updateProfile(
  name: string,
  profileData: Omit<Profile, "name" | "created" | "updated">,
) {
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

// holidaze/profiles/:name/venues
async function getVenuesByProfileName(name: string) {
  try {
    const response = await get<ApiResponse<Profile[]>>(
      `${PROFILES_ENDPOINT}/${name}/venues`,
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

// holidaze/profiles/:name/bookings
async function getBookingsByProfileName(name: string) {
  try {
    const response = await get<ApiResponse<Profile[]>>(
      `${PROFILES_ENDPOINT}/${name}/bookings`,
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
