import type { Booking } from "../../types/venue.types";
import { BookingCard } from "../booking/card";

type ManagedBookingCardData = Pick<
  Booking,
  "id" | "dateFrom" | "dateTo" | "guests" | "venue" | "customer"
>;

type OverviewManagedBookingsProps = {
  bookings?: ManagedBookingCardData[];
};

export default function OverviewManagedBookings({
  bookings = [],
}: OverviewManagedBookingsProps) {
  return (
    <section className="px-4 py-6">
      <h2 className="p-4 text-center text-2xl font-[var(--font-display)] text-[var(--color-ink)]">
        Upcoming bookings for my venues
      </h2>

      {bookings.length === 0 ? (
        <p className="mt-4 text-[var(--text-h)]">
          You have no upcoming bookings across your venues.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </section>
  );
}
