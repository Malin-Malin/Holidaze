import type {
  Booking,
  BookingCreateData,
  BookingUpdateData,
} from "../types/venue.types";
import type { ApiResponse } from "../types/api.types";
import { post, get, put, del } from "./api";

const BOOKINGS_ENDPOINT = "/holidaze/bookings";

/**
 * Create a new booking with the provided booking data.
 * @param bookingData The data for the booking to be created.
 * @returns The created booking object returned from the API.
 * @throws Will throw an error if the API request fails.
 */
async function createBooking(bookingData: BookingCreateData) {
  try {
    const response = await post<BookingCreateData, ApiResponse<Booking>>(
      BOOKINGS_ENDPOINT,
      bookingData,
    );
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error; // Let the caller handle the error
  }
}

/**
 * Fetch all bookings from the API.
 * @returns An array of booking objects returned from the API.
 * @throws Will throw an error if the API request fails.
 */
async function getBookings() {
  try {
    const response = await get<ApiResponse<Booking[]>>(BOOKINGS_ENDPOINT);
    return response;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error; // Let the caller handle the error
  }
}

/**
 * Fetch a booking by its ID from the API.
 * @param id The ID of the booking to fetch.
 * @returns The booking object returned from the API.
 * @throws Will throw an error if the API request fails.
 */
async function getBookingById(id: string) {
  try {
    const response = await get<ApiResponse<Booking>>(
      `${BOOKINGS_ENDPOINT}/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking with id ${id}:`, error);
    throw error; // Let the caller handle the error
  }
}

/**
 * Update a booking by its ID with the provided booking data.
 * @param id The ID of the booking to update.
 * @param bookingData The data to update the booking with.
 * @returns {Promise<Booking>} A promise that resolves to the updated booking object returned from the API.
 * @throws Will throw an error if the API request fails.
 */
async function updateBooking(id: string, bookingData: BookingUpdateData) {
  try {
    const response = await put<BookingUpdateData, ApiResponse<Booking>>(
      `${BOOKINGS_ENDPOINT}/${id}`,
      bookingData,
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating booking with id ${id}:`, error);
    throw error; // Let the caller handle the error
  }
}

/**
 * Delete a booking by its ID from the API.
 * @param id The ID of the booking to delete.
 * @returns {Promise<void>} A promise that resolves when the booking is successfully deleted.
 * @throws Will throw an error if the API request fails.
 */
async function deleteBooking(id: string) {
  try {
    await del(`${BOOKINGS_ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error deleting booking with id ${id}:`, error);
    throw error; // Let the caller handle the error
  }
}

export {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
