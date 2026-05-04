import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createBooking } from "../../api/bookingService";
import { useAuth } from "../../hooks/useAuth";
import type { Venue } from "../../types/venue.types";
import { FormField } from "../input/formField";

type BookingFormProps = {
  venue: Venue;
  selectedDateFrom?: string;
  selectedDateTo?: string;
  onDatesChange?: (dateFrom: string, dateTo: string) => void;
};

type BookingFormData = {
  dateFrom: string;
  dateTo: string;
  guests: number;
};

type BookingFieldErrors = Partial<Record<keyof BookingFormData, string>>;

export function BookingForm({
  venue,
  selectedDateFrom,
  selectedDateTo,
  onDatesChange,
}: BookingFormProps) {
  const { isLoggedIn } = useAuth();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);
  const [errors, setErrors] = useState<BookingFieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  function addDays(dateString: string, days: number) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  }

  const checkOutMinDate = dateFrom ? addDays(dateFrom, 1) : today;

  useEffect(() => {
    if (!selectedDateFrom || !selectedDateTo) return;

    setDateFrom(selectedDateFrom);
    setDateTo(selectedDateTo);
    setErrors((prev) => ({ ...prev, dateFrom: undefined, dateTo: undefined }));
  }, [selectedDateFrom, selectedDateTo]);

  function hasOverlapWithExisting(from: string, to: string) {
    const a = new Date(from);
    const b = new Date(to);
    return (venue.bookings ?? []).some((booking) => {
      const bFrom = new Date(booking.dateFrom);
      const bTo = new Date(booking.dateTo);
      return a < bTo && b > bFrom;
    });
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

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
      setSuccessMessage(
        "Booking created. You can view upcoming bookings on your profile.",
      );
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
          <Link to="/login" className="underline">
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
        </fieldset>
        {submitError && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {submitError}
          </p>
        )}
        {successMessage && (
          <p className="mt-2 text-sm text-green-700">{successMessage}</p>
        )}
        <button
          type="submit"
          disabled={!isLoggedIn || isSubmitting}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-[var(--color-ink)] px-5 py-2 text-[var(--color-honey)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-honey)]"
        >
          {isSubmitting ? "Booking..." : "Create booking"}
        </button>
      </form>
    </section>
  );
}
