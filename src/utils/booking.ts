import type { Booking } from "../types/venue.types";
import type { VenueBooking } from "../types/venue.types";
import { startOfDay, toDateKey } from "./date";

export type AvailabilityCalendarCell = {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isBooked: boolean;
  isAvailable: boolean;
};

/**
 * Checks if a booking is upcoming (its end date is in the future).
 * @param {Booking} booking - The booking to check.
 * @returns {boolean} True if upcoming, false otherwise.
 */
export function isUpcomingBooking(booking: Booking) {
  const now = new Date();
  const bookingEnd = new Date(booking.dateTo);
  return bookingEnd >= now;
}

/**
 * Builds a set of booked date keys from an array of bookings.
 * @param {VenueBooking[]} bookings - The bookings to process.
 * @returns {Set<string>} Set of booked date keys.
 */
export function buildBookedDateSet(bookings: VenueBooking[]): Set<string> {
  const result = new Set<string>();

  bookings.forEach((booking) => {
    const bookingStart = startOfDay(new Date(booking.dateFrom));
    const bookingEnd = startOfDay(new Date(booking.dateTo));

    if (
      Number.isNaN(bookingStart.getTime()) ||
      Number.isNaN(bookingEnd.getTime())
    ) {
      return;
    }

    // Treat both booking start and end dates as unavailable.
    const cursor = new Date(bookingStart);
    while (cursor <= bookingEnd) {
      result.add(toDateKey(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  return result;
}

type BuildBookedDateTooltipMapOptions = {
  bookings: VenueBooking[];
  canViewBookedByName?: boolean;
  currentUserName?: string;
  currentUserEmail?: string;
};

/**
 * Builds a map of booked date keys to tooltip strings for calendar display.
 * @param {BuildBookedDateTooltipMapOptions} options - Options for building the tooltip map.
 * @returns {Map<string, string>} Map of date keys to tooltip strings.
 */
export function buildBookedDateTooltipMap({
  bookings,
  canViewBookedByName = false,
  currentUserName,
  currentUserEmail,
}: BuildBookedDateTooltipMapOptions): Map<string, string> {
  const result = new Map<string, string>();

  bookings.forEach((booking) => {
    const bookingStart = startOfDay(new Date(booking.dateFrom));
    const bookingEnd = startOfDay(new Date(booking.dateTo));

    if (
      Number.isNaN(bookingStart.getTime()) ||
      Number.isNaN(bookingEnd.getTime())
    ) {
      return;
    }

    const guestName = booking.customer?.name?.trim() || "Unknown guest";
    const isOwnBooking =
      (!!currentUserName && booking.customer?.name === currentUserName) ||
      (!!currentUserEmail && booking.customer?.email === currentUserEmail);
    const tooltipText = canViewBookedByName
      ? `Booked by ${guestName}`
      : isOwnBooking
        ? "Booked by you"
        : "Booked";

    const cursor = new Date(bookingStart);
    while (cursor <= bookingEnd) {
      result.set(toDateKey(cursor), tooltipText);
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  return result;
}

/**
 * Checks if a date range is bookable (no overlap with booked dates).
 * @param {string} startKey - The start date key (YYYY-MM-DD).
 * @param {string} endKey - The end date key (YYYY-MM-DD).
 * @param {Set<string>} bookedDateSet - Set of booked date keys.
 * @returns {boolean} True if the range is bookable, false otherwise.
 */
export function isBookableRange(
  startKey: string,
  endKey: string,
  bookedDateSet: Set<string>,
): boolean {
  const cursor = new Date(startKey);
  const end = new Date(endKey);

  while (cursor <= end) {
    const key = toDateKey(cursor);
    if (bookedDateSet.has(key)) return false;
    cursor.setDate(cursor.getDate() + 1);
  }

  return true;
}

/**
 * Checks if a date is inside the selected range (exclusive).
 * @param {string} dateKey - The date key to check.
 * @param {string} activeDateFrom - The start of the selected range.
 * @param {string} activeDateTo - The end of the selected range.
 * @returns {boolean} True if inside the range, false otherwise.
 */
export function isInsideSelectedRange(
  dateKey: string,
  activeDateFrom: string,
  activeDateTo: string,
): boolean {
  if (!activeDateFrom || !activeDateTo) return false;

  const value = new Date(dateKey).getTime();
  const from = new Date(activeDateFrom).getTime();
  const to = new Date(activeDateTo).getTime();

  return value > from && value < to;
}

/**
 * Checks if a date is before the selected start date (and no end date is selected).
 * @param {string} dateKey - The date key to check.
 * @param {string} activeDateFrom - The start of the selected range.
 * @param {string} activeDateTo - The end of the selected range.
 * @returns {boolean} True if before the selected start, false otherwise.
 */
export function isBeforeSelectedStart(
  dateKey: string,
  activeDateFrom: string,
  activeDateTo: string,
): boolean {
  if (!activeDateFrom || activeDateTo) return false;
  return dateKey < activeDateFrom;
}

/**
 * Builds the calendar cell data for the availability calendar grid.
 * @param {Date} visibleMonth - The month to display.
 * @param {string} todayKey - The date key for today.
 * @param {Set<string>} bookedDateSet - Set of booked date keys.
 * @returns {AvailabilityCalendarCell[]} Array of calendar cell data.
 */
export function buildAvailabilityCalendarCells(
  visibleMonth: Date,
  todayKey: string,
  bookedDateSet: Set<string>,
): AvailabilityCalendarCell[] {
  const firstDayOfMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1,
  );
  const gridStart = new Date(firstDayOfMonth);
  gridStart.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    const dateKey = toDateKey(date);
    const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
    const isPast = dateKey < todayKey;
    const isBooked = bookedDateSet.has(dateKey);
    const isAvailable = !isPast && !isBooked;

    return {
      date,
      dateKey,
      dayNumber: date.getDate(),
      isCurrentMonth,
      isPast,
      isBooked,
      isAvailable,
    };
  });
}

/**
 * Checks if a given date range overlaps (inclusive) with any existing bookings.
 * @param {string} from - Start date of the range (YYYY-MM-DD).
 * @param {string} to - End date of the range (YYYY-MM-DD).
 * @param {Array<Pick<Booking, "dateFrom" | "dateTo">>} bookings - Array of bookings to check against.
 * @returns {boolean} True if there is any overlap, false otherwise.
 */
export function hasInclusiveBookingOverlap(
  from: string,
  to: string,
  bookings: Array<Pick<Booking, "dateFrom" | "dateTo">>,
): boolean {
  const start = new Date(from);
  const end = new Date(to);

  return bookings.some((booking) => {
    const bookingStart = new Date(booking.dateFrom);
    const bookingEnd = new Date(booking.dateTo);
    return start <= bookingEnd && end >= bookingStart;
  });
}

/**
 * Checks if a booking has started.
 * @param {Booking} booking - The booking to check.
 * @returns {boolean} True if the booking has started, false otherwise.
 */
export function hasBookingStarted(booking: Booking) {
  const now = new Date();
  const bookingStart = new Date(booking.dateFrom);
  return bookingStart <= now;
}
