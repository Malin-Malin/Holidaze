import { useMemo, useState } from "react";

import CalendarCell from "./CalendarCell";

import {
  buildAvailabilityCalendarCells,
  buildBookedDateSet,
  buildBookedDateTooltipMap,
  isBeforeSelectedStart,
  isBookableRange,
  isInsideSelectedRange,
} from "../../utils/booking";
import { startOfDay, startOfMonth, toDateKey } from "../../utils/date";
import Button from "../ui/Button";

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

const AvailabilityCalendar = ({
  bookings = [],
  title = "Availability calendar",
  onRangeSelect,
  selectedDateFrom,
  selectedDateTo,
  canViewBookedByName = false,
  currentUserName,
  currentUserEmail,
}: AvailabilityCalendarProps) => {
  const today = useMemo(() => startOfDay(new Date()), []);
  const todayKey = useMemo(() => toDateKey(today), [today]);
  const [visibleMonth, setVisibleMonth] = useState<Date>(startOfMonth(today));
  const [localSelectedDateFrom, setLocalSelectedDateFrom] = useState("");
  const [localSelectedDateTo, setLocalSelectedDateTo] = useState("");

  const activeDateFrom = selectedDateFrom ?? localSelectedDateFrom;
  const activeDateTo = selectedDateTo ?? localSelectedDateTo;

  const bookedDateSet = useMemo(() => buildBookedDateSet(bookings), [bookings]);
  const bookedDateTooltipMap = useMemo(
    () =>
      buildBookedDateTooltipMap({
        bookings,
        canViewBookedByName,
        currentUserEmail,
        currentUserName,
      }),
    [bookings, canViewBookedByName, currentUserEmail, currentUserName],
  );

  const monthLabel = visibleMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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

    if (!isBookableRange(activeDateFrom, dateKey, bookedDateSet)) {
      setLocalSelectedDateFrom(dateKey);
      setLocalSelectedDateTo("");
      onRangeSelect?.(dateKey, "");
      return;
    }

    setLocalSelectedDateTo(dateKey);
    onRangeSelect?.(activeDateFrom, dateKey);
  }

  function getCellClass(cell: {
    dateKey: string;
    isCurrentMonth: boolean;
    isPast: boolean;
    isBooked: boolean;
    isAvailable: boolean;
  }) {
    const baseClass =
      "group relative overflow-visible px-1 py-1 text-center text-xs border transition-colors duration-100";
    const dim = !cell.isCurrentMonth ? " opacity-30" : "";
    const isStart = activeDateFrom === cell.dateKey;
    const isEnd = activeDateTo === cell.dateKey;
    const inRange = isInsideSelectedRange(
      cell.dateKey,
      activeDateFrom,
      activeDateTo,
    );
    const beforeStart =
      cell.isAvailable &&
      isBeforeSelectedStart(cell.dateKey, activeDateFrom, activeDateTo);

    if (isStart || isEnd || inRange) {
      return `${baseClass} ${isStart || isEnd ? "rounded-md ring-2 ring-[var(--color-honey)]" : "rounded-none border-y-2 border-x-0"} border-[var(--color-honey)] bg-[var(--color-honey)] text-[var(--color-ink)] hover:text-[var(--color-ink)] hover:brightness-105 font-semibold cursor-pointer${dim}`;
    }
    if (beforeStart) {
      return `${baseClass} rounded-md border-[var(--border)] bg-[var(--border)] text-[var(--text)] opacity-50 cursor-pointer${dim}`;
    }
    if (cell.isPast) {
      return `${baseClass} rounded-md border-[var(--border)] bg-transparent text-[var(--text)] opacity-40${dim}`;
    }
    if (cell.isBooked) {
      return `${baseClass} rounded-md border-[var(--color-danger)]/40 bg-[var(--color-danger)]/15 text-[var(--color-danger)]${dim}`;
    }
    if (cell.isAvailable) {
      return `${baseClass} rounded-md border-[var(--color-honey)]/30 bg-[var(--color-honey)]/10 text-[var(--text-h)] transition-colors cursor-pointer hover:bg-[var(--color-honey)]/80 hover:border-[var(--color-honey)] hover:text-[var(--color-ink)] dark:hover:bg-[var(--color-honey)] dark:hover:border-[var(--color-honey)] dark:hover:text-[var(--color-ink)]${dim}`;
    }
    return `${baseClass} rounded-md border-[var(--border)] bg-transparent text-[var(--text)] opacity-40${dim}`;
  }

  const calendarCells = useMemo(
    () => buildAvailabilityCalendarCells(visibleMonth, todayKey, bookedDateSet),
    [bookedDateSet, todayKey, visibleMonth],
  );

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
          <CalendarCell
            key={cell.dateKey}
            cell={cell}
            onSelect={handleDateSelect}
            className={getCellClass(cell)}
            ariaLabel={
              cell.isBooked
                ? `${cell.dayNumber}, ${bookedDateTooltipMap.get(cell.dateKey) ?? "Booked"}`
                : `${cell.dayNumber}, ${cell.isPast ? "past" : "available"}`
            }
            tooltipText={bookedDateTooltipMap.get(cell.dateKey) ?? "Booked"}
          />
        ))}
      </div>

      <div className="mb-3 mt-1 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="calendar"
          onClick={() =>
            setVisibleMonth(
              (previous) =>
                new Date(previous.getFullYear(), previous.getMonth() - 1, 1),
            )
          }
          aria-label={`Go to ${visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })} - 1 month`}
        >
          Prev
        </Button>
        <Button
          type="button"
          variant="calendar"
          onClick={() =>
            setVisibleMonth(
              (previous) =>
                new Date(previous.getFullYear(), previous.getMonth() + 1, 1),
            )
          }
          aria-label={`Go to ${visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })} + 1 month`}
        >
          Next
        </Button>
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
          <span className="h-3 w-3 rounded-sm border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/15" />
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

        <Button
          type="button"
          variant="calendar"
          className="ml-auto"
          aria-label="Clear selected dates"
          onClick={() => {
            setLocalSelectedDateFrom("");
            setLocalSelectedDateTo("");
            onRangeSelect?.("", "");
          }}
        >
          Clear
        </Button>
      </div>
    </section>
  );
};

export default AvailabilityCalendar;
