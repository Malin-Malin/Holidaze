import type { Venue, VenueData } from "../types/venue.types";
import type { ApiResponse } from "../types/api.types";
import { post, get, put, del } from "./api";

const VENUES_ENDPOINT = "/holidaze/venues";

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

async function getVenues() {
  try {
    const response = await get<ApiResponse<Venue[]>>(VENUES_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error; // Let the caller handle the error
  }
}

async function getVenueById(id: string) {
  try {
    const response = await get<ApiResponse<Venue>>(
      `${VENUES_ENDPOINT}/${id}?_owner=true`,
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

async function searchVenues(query: string) {
  try {
    const response = await get<ApiResponse<Venue[]>>(
      `${VENUES_ENDPOINT}?search=${encodeURIComponent(query)}`,
    );
    return response.data;
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
