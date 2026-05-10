import { BookingCard } from "../booking/card";
import type { VenueBooking, Venue } from "../../types/venue.types";

type UpcomingBooking = Pick<
  VenueBooking,
  "id" | "dateFrom" | "dateTo" | "guests" | "customer"
> & { venue: Venue };

type UpcomingBookingsProps = {
  bookings: UpcomingBooking[];
};

export function UpcomingBookings({ bookings }: UpcomingBookingsProps) {
  return (
    <div className="mx-auto mt-6 w-full max-w-6xl px-8 md:px-10">
      <h3 className="text-lg font-semibold text-[var(--text-h)]">
        Upcoming bookings for this venue
      </h3>
      {bookings.length === 0 ? (
        <p className="mt-2 text-sm text-[var(--text)]/80">
          No upcoming bookings yet.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              showViewVenueButton={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
