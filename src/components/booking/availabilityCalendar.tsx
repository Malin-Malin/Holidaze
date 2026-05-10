import { useMemo, useState } from "react";
import type { VenueBooking } from "../../types/venue.types";

type AvailabilityCalendarProps = {
  bookings?: VenueBooking[];
  title?: string;
  onRangeSelect?: (dateFrom: string, dateTo: string) => void;
  selectedDateFrom?: string;
  selectedDateTo?: string;
  canViewBookedByName?: boolean;
  currentUserName?: string;
  currentUserEmail?: string;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(value: Date): Date {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfMonth(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

function buildBookedDateSet(bookings: VenueBooking[]): Set<string> {
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

    // Mark occupied nights as unavailable. Check-out day remains available.
    const cursor = new Date(bookingStart);
    while (cursor < bookingEnd) {
      result.add(toDateKey(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  return result;
}

export function AvailabilityCalendar({
  bookings = [],
  title = "Availability calendar",
  onRangeSelect,
  selectedDateFrom,
  selectedDateTo,
  canViewBookedByName = false,
  currentUserName,
  currentUserEmail,
}: AvailabilityCalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const todayKey = useMemo(() => toDateKey(today), [today]);
  const [visibleMonth, setVisibleMonth] = useState<Date>(startOfMonth(today));
  const [localSelectedDateFrom, setLocalSelectedDateFrom] = useState("");
  const [localSelectedDateTo, setLocalSelectedDateTo] = useState("");

  const activeDateFrom = selectedDateFrom ?? localSelectedDateFrom;
  const activeDateTo = selectedDateTo ?? localSelectedDateTo;

  const bookedDateSet = useMemo(() => buildBookedDateSet(bookings), [bookings]);
  const bookedDateTooltipMap = useMemo(() => {
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
      while (cursor < bookingEnd) {
        result.set(toDateKey(cursor), tooltipText);
        cursor.setDate(cursor.getDate() + 1);
      }
    });

    return result;
  }, [bookings, canViewBookedByName, currentUserEmail, currentUserName]);

  const monthLabel = visibleMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDayOfMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1,
  );
  const gridStart = new Date(firstDayOfMonth);
  gridStart.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  function isBookableRange(startKey: string, endKey: string) {
    const cursor = new Date(startKey);
    const end = new Date(endKey);

    while (cursor < end) {
      const key = toDateKey(cursor);
      if (bookedDateSet.has(key)) return false;
      cursor.setDate(cursor.getDate() + 1);
    }

    return true;
  }

  function handleDateSelect(dateKey: string, isAvailable: boolean) {
    if (!isAvailable) return;

    if (!activeDateFrom || activeDateTo) {
      setLocalSelectedDateFrom(dateKey);
      setLocalSelectedDateTo("");
      onRangeSelect?.(dateKey, "");
      return;
    }

    if (dateKey <= activeDateFrom) {
      setLocalSelectedDateFrom(dateKey);
      setLocalSelectedDateTo("");
      onRangeSelect?.(dateKey, "");
      return;
    }

    if (!isBookableRange(activeDateFrom, dateKey)) {
      setLocalSelectedDateFrom(dateKey);
      setLocalSelectedDateTo("");
      onRangeSelect?.(dateKey, "");
      return;
    }

    setLocalSelectedDateTo(dateKey);
    onRangeSelect?.(activeDateFrom, dateKey);
  }

  function isInsideSelectedRange(dateKey: string) {
    if (!activeDateFrom || !activeDateTo) return false;

    const value = new Date(dateKey).getTime();
    const from = new Date(activeDateFrom).getTime();
    const to = new Date(activeDateTo).getTime();

    return value > from && value < to;
  }

  function isBeforeSelectedStart(dateKey: string) {
    if (!activeDateFrom || activeDateTo) return false;
    return dateKey < activeDateFrom;
  }

  function getCellClass(cell: {
    dateKey: string;
    isCurrentMonth: boolean;
    isPast: boolean;
    isBooked: boolean;
    isAvailable: boolean;
  }) {
    const base =
      "group relative overflow-visible px-1 py-1 text-center text-xs border transition-colors duration-100";
    const dim = !cell.isCurrentMonth ? " opacity-30" : "";
    const isStart = activeDateFrom === cell.dateKey;
    const isEnd = activeDateTo === cell.dateKey;
    const inRange = isInsideSelectedRange(cell.dateKey);
    const beforeStart = cell.isAvailable && isBeforeSelectedStart(cell.dateKey);

    if (isStart || isEnd) {
      return `${base} rounded-md bg-[var(--color-ink)] border-[var(--color-honey)] text-[var(--color-honey)] font-semibold ring-2 ring-[var(--color-honey)] cursor-pointer${dim}`;
    }
    if (inRange) {
      return `${base} rounded-none border-y-2 border-x-0 border-[var(--color-honey)] bg-[var(--color-honey)] text-[var(--color-ink)] font-semibold${dim}`;
    }
    if (beforeStart) {
      return `${base} rounded-md border-[var(--border)] bg-[var(--border)] text-[var(--text)] opacity-50 cursor-pointer${dim}`;
    }
    if (cell.isPast) {
      return `${base} rounded-md border-[var(--border)] bg-transparent text-[var(--text)] opacity-40${dim}`;
    }
    if (cell.isBooked) {
      return `${base} rounded-md border-red-500/40 bg-red-500/15 text-red-400${dim}`;
    }
    if (cell.isAvailable) {
      return `${base} rounded-md border-[var(--color-honey)]/30 bg-[var(--color-honey)]/10 text-[var(--text-h)] hover:bg-[var(--color-honey)]/20 cursor-pointer${dim}`;
    }
    return `${base} rounded-md border-[var(--border)] bg-transparent text-[var(--text)] opacity-40${dim}`;
  }

  const calendarCells = Array.from({ length: 42 }, (_, index) => {
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

  return (
    <section
      className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3"
      aria-label={`${title}: ${monthLabel}`}
    >
      <p className="mb-1 text-sm font-medium text-[var(--text-h)]">
        {monthLabel}
      </p>

      <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-wide text-[var(--text)]/70">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="py-1">
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0 text-sm">
        {calendarCells.map((cell) => (
          <button
            type="button"
            key={cell.dateKey}
            onClick={() => handleDateSelect(cell.dateKey, cell.isAvailable)}
            className={getCellClass(cell)}
            aria-disabled={!cell.isAvailable}
            aria-label={
              cell.isBooked
                ? `${cell.dayNumber}, ${bookedDateTooltipMap.get(cell.dateKey) ?? "Booked"}`
                : `${cell.dayNumber}, ${cell.isPast ? "past" : "available"}`
            }
          >
            {cell.dayNumber}
            {cell.isBooked && (
              <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-[var(--color-honey)]/40 bg-[var(--color-ink)] px-2 py-1 text-[11px] font-medium text-[var(--color-honey)] shadow-lg group-hover:block group-focus-visible:block">
                {bookedDateTooltipMap.get(cell.dateKey) ?? "Booked"}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mb-3 mt-1 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() =>
            setVisibleMonth(
              (previous) =>
                new Date(previous.getFullYear(), previous.getMonth() - 1, 1),
            )
          }
          className="rounded border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-h)] hover:border-[var(--color-honey)] hover:text-[var(--color-honey)] transition-colors"
          aria-label="Previous month"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() =>
            setVisibleMonth(
              (previous) =>
                new Date(previous.getFullYear(), previous.getMonth() + 1, 1),
            )
          }
          className="rounded border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-h)] hover:border-[var(--color-honey)] hover:text-[var(--color-honey)] transition-colors"
          aria-label="Next month"
        >
          Next
        </button>
      </div>
      <p className="mb-3 text-xs text-[var(--text)]/70">
        Mark a check-in day and a check-out day.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--text)]/80">
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm border border-[var(--color-honey)]/30 bg-[var(--color-honey)]/10" />
          Available
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm border border-red-500/40 bg-red-500/15" />
          Booked
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm border border-[var(--border)] bg-transparent opacity-40" />
          Past
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[var(--color-honey)]" />
          Selected
        </span>

        <button
          type="button"
          onClick={() => {
            setLocalSelectedDateFrom("");
            setLocalSelectedDateTo("");
            onRangeSelect?.("", "");
          }}
          className="ml-auto rounded border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--text-h)] hover:border-[var(--color-honey)] hover:text-[var(--color-honey)] transition-colors"
        >
          Clear
        </button>
      </div>
    </section>
  );
}
