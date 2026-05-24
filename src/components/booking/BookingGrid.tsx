import BookingCard from "./BookingCard";
import { BookingGridSkeleton } from "../loading/PageSkeletons";

import type { Booking } from "../../types/venue.types";

type BookingGridProps = {
  title?: string;
  numberOfBookings?: number;
  bookings: Booking[];
  isLoading: boolean;
  showViewVenueButton?: boolean;
  handleCancel?: (bookingId: string) => void;
  fallbackMessage?: string;
  errorMessage?: string;
};

const BookingGrid = ({
  title,
  numberOfBookings = 12,
  bookings,
  isLoading,
  showViewVenueButton = true,
  handleCancel = undefined,
  fallbackMessage = "No bookings found.",
  errorMessage,
}: BookingGridProps) => {
  return (
    <section className="px-4 py-8">
      {title && (
        <h2 className="m-0 p-4 text-center text-2xl text-[var(--text-h)] md:col-start-2">
          {title}
        </h2>
      )}

      {errorMessage && (
        <p className="px-2 pb-4 text-left text-[var(--color-danger)]">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && bookings.length === 0 && (
        <p className="mt-4 text-[var(--text-h)]">{fallbackMessage}</p>
      )}

      <div className="mb-8 mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading && <BookingGridSkeleton count={numberOfBookings} />}

        {!isLoading &&
          !errorMessage &&
          bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
              showViewVenueButton={showViewVenueButton}
            />
          ))}
      </div>
    </section>
  );
};

export default BookingGrid;
