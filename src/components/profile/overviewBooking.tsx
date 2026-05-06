import type { Booking } from "../../types/venue.types";
import { useEffect, useMemo, useState } from "react";
import { deleteBooking } from "../../api/bookingService";
import { BookingCard } from "../booking/card";

type OverviewBookingProps = {
  bookings?: Booking[];
};

function isUpcomingBooking(booking: Booking) {
  const now = new Date();
  const bookingEnd = new Date(booking.dateTo);
  return bookingEnd >= now;
}

export default function OverviewBooking({
  bookings = [],
}: OverviewBookingProps) {
  const [myBookings, setMyBookings] = useState<Booking[]>(bookings);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setMyBookings(bookings);
  }, [bookings]);

  async function handleCancel(bookingId: string) {
    const confirmed = window.confirm("Cancel this booking?");
    if (!confirmed) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");
      await deleteBooking(bookingId);
      setMyBookings((prev) =>
        prev.filter((booking) => booking.id !== bookingId),
      );
      setSuccessMessage("Booking successfully canceled.");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to cancel booking.",
      );
    }
  }

  const upcomingBookings = useMemo(
    () =>
      myBookings
        .filter(isUpcomingBooking)
        .sort(
          (first, second) =>
            new Date(first.dateFrom).getTime() -
            new Date(second.dateFrom).getTime(),
        ),
    [myBookings],
  );

  return (
    <section className="px-4 py-6">
      <h2 className="text-2xl font-[var(--font-display)] text-[var(--color-ink)] text-center p-4">
        My upcoming stays
      </h2>

      {upcomingBookings.length === 0 ? (
        <p className="mt-4 text-[var(--text-h)]">
          You have no upcoming bookings.
        </p>
      ) : (
        <div className="mb-8 mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {upcomingBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {errorMessage && (
        <p className="mt-3 text-sm text-red-700">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="mt-3 text-sm text-green-700">{successMessage}</p>
      )}
    </section>
  );
}
