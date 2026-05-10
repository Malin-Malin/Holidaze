import { Link, useNavigate } from "react-router-dom";
import type { Booking } from "../../types/venue.types";
import { formatDate } from "../../utils/date";

type BookingCardData = Pick<
  Booking,
  "id" | "dateFrom" | "dateTo" | "guests" | "venue" | "customer"
>;

type BookingCardProps = {
  booking: BookingCardData;
  onCancel?: (bookingId: string) => void;
  showViewVenueButton?: boolean;
};

function hasBookingStarted(booking: BookingCardData) {
  const now = new Date();
  const bookingStart = new Date(booking.dateFrom);
  return bookingStart <= now;
}

export function BookingCard({
  booking,
  onCancel,
  showViewVenueButton = true,
}: BookingCardProps) {
  const navigate = useNavigate();
  const bookingStarted = hasBookingStarted(booking);
  const previewImageUrl = booking.venue?.media?.[0]?.url;
  const venueId = booking.venue?.id;

  function openVenue() {
    if (!venueId) return;
    navigate(`/venue/${venueId}`);
  }

  return (
    <article
      className={`card-gradient-border group relative overflow-hidden p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${venueId ? "cursor-pointer" : ""}`}
      onClick={openVenue}
      onKeyDown={(event) => {
        if (!venueId) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openVenue();
        }
      }}
      role={venueId ? "button" : undefined}
      tabIndex={venueId ? 0 : undefined}
      aria-label={
        venueId ? `Open venue ${booking.venue?.name || "details"}` : undefined
      }
    >
      {previewImageUrl && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-10"
          style={{
            backgroundImage: `url(${previewImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10">
        <h3 className="text-xl font-semibold leading-tight text-[var(--text-h)]">
          {booking.venue?.name || "Venue"}
        </h3>

        <p className="mt-2 text-sm font-medium text-[var(--text-h)]">
          {formatDate(booking.dateFrom, { fallback: "Unknown date" })} -{" "}
          {formatDate(booking.dateTo, { fallback: "Unknown date" })}
        </p>
        <p className="mt-1 text-sm text-[var(--text)]">
          Guests: {booking.guests}
        </p>
        {booking.customer?.name && (
          <p className="mt-1 text-sm text-[var(--text)]">
            Guest: {booking.customer.name}
          </p>
        )}

        <div className="flex items-center pt-4">
          {showViewVenueButton && booking.venue?.id && !bookingStarted && (
            <Link
              to={`/venue/${booking.venue.id}`}
              onClick={(event) => event.stopPropagation()}
              className="rounded border border-[var(--color-ink)] px-3 py-1 text-sm text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-honey)]"
            >
              View venue
            </Link>
          )}

          {onCancel && !bookingStarted && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onCancel(booking.id);
              }}
              className="ml-auto rounded border border-red-700 px-3 py-1 text-sm text-red-700 hover:bg-red-700 hover:text-white"
            >
              Cancel
            </button>
          )}

          {bookingStarted && (
            <p className="w-full text-center text-xl font-semibold text-[var(--color-honey)]">
              Ongoing
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
