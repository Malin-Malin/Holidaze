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

export function isUpcomingBooking(booking: Booking) {
  const now = new Date();
  const bookingEnd = new Date(booking.dateTo);
  return bookingEnd >= now;
}

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

export function isBeforeSelectedStart(
  dateKey: string,
  activeDateFrom: string,
  activeDateTo: string,
): boolean {
  if (!activeDateFrom || activeDateTo) return false;
  return dateKey < activeDateFrom;
}

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
