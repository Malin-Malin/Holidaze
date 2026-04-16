import type {
  Booking,
  BookingCreateData,
  BookingUpdateData,
} from "../types/venue.types";
import type { ApiResponse } from "../types/api.types";
import { post, get, put, del } from "./api";

const BOOKINGS_ENDPOINT = "/holidaze/bookings";

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

async function getBookings() {
  try {
    const response = await get<ApiResponse<Booking[]>>(BOOKINGS_ENDPOINT);
    return response;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error; // Let the caller handle the error
  }
}

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

// Herfra
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
