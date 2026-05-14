import type { Booking } from "../types/venue.types";

export function isUpcomingBooking(booking: Booking) {
  const now = new Date();
  const bookingEnd = new Date(booking.dateTo);
  return bookingEnd >= now;
}
