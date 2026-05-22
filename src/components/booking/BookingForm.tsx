import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import FormField from "../input/FormField";

import { createBooking } from "../../api/bookingService";
import { useAuth } from "../../hooks/useAuth";
import type { Venue } from "../../types/venue.types";
import { hasInclusiveBookingOverlap } from "../../utils/booking";
import { addDaysToDateKey, formatDate } from "../../utils/date";
import { formatPrice } from "../../utils/number";

type BookingFormProps = {
  venue: Venue;
  selectedDateFrom?: string;
  selectedDateTo?: string;
  onDatesChange?: (dateFrom: string, dateTo: string) => void;
  onBookingConfirmed?: (data: {
    dateFrom: string;
    dateTo: string;
    guests: number;
  }) => void;
};

type BookingFormData = {
  dateFrom: string;
  dateTo: string;
  guests: number;
};

type BookingFieldErrors = Partial<Record<keyof BookingFormData, string>>;

const BookingForm = ({
  venue,
  selectedDateFrom,
  selectedDateTo,
  onDatesChange,
  onBookingConfirmed,
}: BookingFormProps) => {
  const { isLoggedIn } = useAuth();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);
  const [errors, setErrors] = useState<BookingFieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const checkInDate = new Date(dateFrom);
  const checkOutDate = new Date(dateTo);
  const hasValidDateRange =
    !!checkInDate && !!checkOutDate && checkOutDate > checkInDate;
  const nights = hasValidDateRange
    ? Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;
  const guestCount = Number(guests);
  const isGuestCountValid =
    Number.isFinite(guestCount) &&
    guestCount >= 1 &&
    guestCount <= venue.maxGuests;
  const canPreviewTotal = hasValidDateRange && isGuestCountValid;
  const estimatedTotal = venue.price * nights;
  const selectedRangeLabel = canPreviewTotal
    ? `${formatDate(dateFrom, { fallback: "Unknown date" })} - ${formatDate(
        dateTo,
        {
          fallback: "Unknown date",
        },
      )}`
    : "";

  const checkOutMinDate = dateFrom ? addDaysToDateKey(dateFrom, 1) : today;

  useEffect(() => {
    if (!selectedDateFrom || !selectedDateTo) return;

    setDateFrom(selectedDateFrom);
    setDateTo(selectedDateTo);
    setErrors((prev) => ({ ...prev, dateFrom: undefined, dateTo: undefined }));
  }, [selectedDateFrom, selectedDateTo]);

  function hasOverlapWithExisting(from: string, to: string) {
    return hasInclusiveBookingOverlap(from, to, venue.bookings ?? []);
  }

  function validate() {
    const next: BookingFieldErrors = {};
    const guestCount = Number(guests);

    if (!dateFrom) next.dateFrom = "Check in date is required.";
    if (!dateTo) next.dateTo = "Check out date is required.";
    if (!Number.isFinite(guestCount) || guestCount < 1) {
      next.guests = "At least 1 guest is required.";
    } else if (guestCount > venue.maxGuests) {
      next.guests = `This venue allows up to ${venue.maxGuests} guests.`;
    }

    if (dateFrom && dateTo && new Date(dateTo) <= new Date(dateFrom)) {
      next.dateTo = "Check out date must be after check in date.";
    }

    if (
      dateFrom &&
      dateTo &&
      !next.dateFrom &&
      !next.dateTo &&
      hasOverlapWithExisting(dateFrom, dateTo)
    ) {
      next.dateFrom =
        "These dates overlap with an existing booking. Please choose different dates.";
    }

    return next;
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");

    if (!isLoggedIn) {
      setSubmitError("You need to log in to create a booking.");
      return;
    }

    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    try {
      setIsSubmitting(true);
      await createBooking({
        dateFrom,
        dateTo,
        guests: Number(guests),
        venueId: venue.id,
      });
      onBookingConfirmed?.({ dateFrom, dateTo, guests: Number(guests) });
      setDateFrom("");
      setDateTo("");
      setGuests(1);
      setErrors({});
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to book this venue. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <p className="mt-1 text-sm text-[var(--text)]/80">
        You are booking {venue.name}. Maximum guests: {venue.maxGuests}. Please
        fill in the form below to create your booking.
      </p>
      {!isLoggedIn && (
        <p className="mt-2 text-sm text-[var(--text)]/80">
          You need to be logged in to book this venue.{" "}
          <Link
            to="/login"
            state={{ from: `/venues/${venue.id}` }}
            className="underline"
          >
            Log in
          </Link>
          .
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
        <fieldset disabled={!isLoggedIn || isSubmitting} className="space-y-4">
          <FormField
            label="Check in date"
            htmlFor="dateFrom"
            error={errors.dateFrom}
          >
            <input
              id="dateFrom"
              name="dateFrom"
              type="date"
              min={today}
              value={dateFrom}
              onChange={(e) => {
                const nextDateFrom = e.target.value;
                setDateFrom(nextDateFrom);

                const nextDateTo =
                  dateTo && nextDateFrom && dateTo <= nextDateFrom
                    ? ""
                    : dateTo;
                if (dateTo && nextDateFrom && dateTo <= nextDateFrom) {
                  setDateTo("");
                }

                onDatesChange?.(nextDateFrom, nextDateTo);

                if (errors.dateFrom)
                  setErrors((prev) => ({ ...prev, dateFrom: undefined }));
              }}
              aria-invalid={!!errors.dateFrom}
              className="form-input"
            />
          </FormField>
          <FormField
            label="Check out date"
            htmlFor="dateTo"
            error={errors.dateTo}
          >
            <input
              id="dateTo"
              name="dateTo"
              type="date"
              min={checkOutMinDate}
              value={dateTo}
              onChange={(e) => {
                const nextDateTo = e.target.value;
                setDateTo(nextDateTo);
                onDatesChange?.(dateFrom, nextDateTo);
                if (errors.dateTo)
                  setErrors((prev) => ({ ...prev, dateTo: undefined }));
              }}
              aria-invalid={!!errors.dateTo}
              className="form-input"
            />
          </FormField>
          <FormField
            label="Number of guests"
            htmlFor="guests"
            error={errors.guests}
          >
            <input
              id="guests"
              name="guests"
              type="number"
              min="1"
              max={venue.maxGuests}
              value={guests}
              onChange={(e) => {
                setGuests(Number(e.target.value));
                if (errors.guests)
                  setErrors((prev) => ({ ...prev, guests: undefined }));
              }}
              aria-invalid={!!errors.guests}
              className="form-input"
            />
          </FormField>

          {canPreviewTotal && (
            <div className="rounded-md border border-[var(--color-honey)]/35 bg-[var(--color-honey)]/10 p-3 text-center text-sm text-[var(--text)] lg:text-left">
              <p className="font-semibold text-[var(--text-h)]">
                Review before confirming
              </p>
              <p className="pt-1 text-[var(--text)]/85">
                Stay: <span className="font-medium">{selectedRangeLabel}</span>
              </p>
              <p className="pt-1 text-[var(--text)]/85">
                Guests: <span className="font-medium">{guestCount}</span>
              </p>
              <p className="pt-1">
                {formatPrice(venue.price)} /night x {nights} night
                {nights === 1 ? "" : "s"} ={" "}
                <span className="font-semibold text-[var(--color-honey)]">
                  {formatPrice(estimatedTotal)}
                </span>
              </p>
              <p className="mt-1 text-xs text-[var(--text)]/75 pt-2">
                Review your selected dates and estimated total before confirming
                your booking.
              </p>
            </div>
          )}
        </fieldset>
        {submitError && (
          <p role="alert" className="mt-2 text-sm text-[var(--color-danger)]">
            {submitError}
          </p>
        )}
        <div className="mt-4 pt-2 pb-4 flex justify-center">
          <button
            type="submit"
            disabled={!isLoggedIn || isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-[var(--color-ink)] px-5 py-2 text-[var(--color-honey)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-honey)]"
          >
            {isSubmitting ? "Booking..." : "Create booking"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default BookingForm;
