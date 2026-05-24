import type { Venue, VenueData } from "../types/venue.types";
import type { ApiResponse } from "../types/api.types";
import { post, get, put, del } from "./api";

const VENUES_ENDPOINT = "/holidaze/venues";

export type VenuesPageResponse = ApiResponse<Venue[]>;

/**
 * Create a new venue with the provided venue data.
 * @param venueData The data for the new venue.
 * @returns {Promise<Venue>} A promise that resolves to the created venue object returned from the API.
 * @throws Will throw an error if the API request fails.
 */
async function createVenue(venueData: VenueData): Promise<Venue> {
  try {
    const response = await post<VenueData, ApiResponse<Venue>>(
      VENUES_ENDPOINT,
      venueData,
    );
    return response.data;
  } catch (error) {
    console.error("Error creating venue:", error);
    throw error; // Let the caller handle the error
  }
}

/**
 * Fetch a list of venues from the API with optional pagination and sorting.
 * @param page The page number to fetch.
 * @param limit The number of venues per page.
 * @param includeBookings Whether to include bookings in the response.
 * @param orderBy The field to sort by.
 * @param orderDirection The direction to sort (asc or desc).
 * @returns {Promise<VenuesPageResponse>} A promise that resolves to an object containing the array of venues and metadata.
 * @throws Will throw an error if the API request fails.
 */
async function getVenues(
  page = 1,
  limit = 12,
  includeBookings = false,
  orderBy = "name",
  orderDirection: "asc" | "desc" = "asc",
): Promise<VenuesPageResponse> {
  try {
    const bookingsQuery = includeBookings ? "&_bookings=true" : "";
    const response = await get<ApiResponse<Venue[]>>(
      `${VENUES_ENDPOINT}?page=${page}&limit=${limit}&sort=${orderBy}&sortOrder=${orderDirection}${bookingsQuery}`,
    );
    return {
      data: response.data,
      meta: response.meta,
    };
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error; // Let the caller handle the error
  }
}

/**
 * Fetch a venue by its ID from the API.
 * @param id The ID of the venue to fetch.
 * @returns {Promise<Venue>} A promise that resolves to the venue object returned from the API.
 * @throws Will throw an error if the API request fails.
 */
async function getVenueById(id: string): Promise<Venue> {
  try {
    const response = await get<ApiResponse<Venue>>(
      `${VENUES_ENDPOINT}/${id}?_owner=true&_bookings=true`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching venue with id ${id}:`, error);
    throw error; // Let the caller handle the error
  }
}

/**
 * Update a venue by its ID with the provided venue data.
 * @param id The ID of the venue to update.
 * @param venueData The data to update the venue with.
 * @returns {Promise<Venue>} A promise that resolves to the updated venue object returned from the API.
 * @throws Will throw an error if the API request fails.
 */
async function updateVenue(id: string, venueData: VenueData): Promise<Venue> {
  try {
    const response = await put<VenueData, ApiResponse<Venue>>(
      `${VENUES_ENDPOINT}/${id}`,
      venueData,
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating venue with id ${id}:`, error);
    throw error; // Let the caller handle the error
  }
}

/**
 * Delete a venue by its ID from the API.
 * @param id The ID of the venue to delete.
 * @returns {Promise<void>} A promise that resolves when the venue is successfully deleted.
 * @throws Will throw an error if the API request fails.
 */
async function deleteVenue(id: string): Promise<void> {
  try {
    await del(`${VENUES_ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error deleting venue with id ${id}:`, error);
    throw error; // Let the caller handle the error
  }
}

/**
 * Search for venues by a query string.
 * @param query The search query string.
 * @param page The page number to fetch.
 * @param limit The number of venues per page.
 * @param orderBy The field to sort by.
 * @param orderDirection The direction to sort (asc or desc).
 * @returns {Promise<VenuesPageResponse>} A promise that resolves to an object containing the array of venues and metadata.
 * @throws Will throw an error if the API request fails.
 */
async function searchVenues(
  query: string,
  page = 1,
  limit = 12,
  orderBy = "name",
  orderDirection: "asc" | "desc" = "asc",
): Promise<VenuesPageResponse> {
  try {
    const response = await get<ApiResponse<Venue[]>>(
      `${VENUES_ENDPOINT}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sort=${orderBy}&sortOrder=${orderDirection}`,
    );
    return {
      data: response.data,
      meta: response.meta,
    };
  } catch (error) {
    console.error(`Error searching venues with query "${query}":`, error);
    throw error; // Let the caller handle the error
  }
}

export {
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  searchVenues,
};
