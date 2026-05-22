import type { Venue, VenueData } from "../types/venue.types";
import type { ApiResponse } from "../types/api.types";
import { post, get, put, del } from "./api";

const VENUES_ENDPOINT = "/holidaze/venues";

export type VenuesPageResponse = ApiResponse<Venue[]>;

async function createVenue(venueData: VenueData) {
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

async function getVenueById(id: string) {
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

async function updateVenue(id: string, venueData: VenueData) {
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

async function deleteVenue(id: string) {
  try {
    await del(`${VENUES_ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error deleting venue with id ${id}:`, error);
    throw error; // Let the caller handle the error
  }
}

async function searchVenues(query: string, page = 1, limit = 12) {
  try {
    const response = await get<ApiResponse<Venue[]>>(
      `${VENUES_ENDPOINT}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
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
