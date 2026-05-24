import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import ButtonLink from "../ui/ButtonLink";

import type { Booking } from "../../types/venue.types";

import { formatDate } from "../../utils/date";
import { hasBookingStarted } from "../../utils/booking";

type BookingCardProps = {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  showViewVenueButton?: boolean;
};

/**
 * Card component displaying booking details, with optional cancel and view venue actions.
 * @param {BookingCardProps} props
 * @param {Booking} props.booking - The booking to display.
 * @param {(bookingId: string) => void} [props.onCancel] - Handler for cancel action.
 * @param {boolean} [props.showViewVenueButton] - Whether to show the view venue button.
 * @returns {JSX.Element}
 */
const BookingCard = ({
  booking,
  onCancel,
  showViewVenueButton = true,
}: BookingCardProps) => {
  const navigate = useNavigate();
  const bookingStarted = hasBookingStarted(booking);
  const previewImageUrl = booking.venue?.media?.[0]?.url;
  const venueId = booking.venue?.id;

  function openVenue() {
    if (!venueId) return;
    navigate(`/venues/${venueId}`);
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
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-30"
          style={{
            backgroundImage: `url(${previewImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
      )}

      <section className="relative z-10">
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
            <ButtonLink
              to={`/venues/${booking.venue.id}`}
              onClick={(event) => event.stopPropagation()}
              variant="outline"
              size="md"
              className="text-sm"
            >
              View venue
            </ButtonLink>
          )}

          {onCancel && !bookingStarted && (
            <Button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onCancel(booking.id);
              }}
              variant="danger"
              size="md"
              className="ml-auto text-sm"
            >
              Cancel
            </Button>
          )}

          {bookingStarted && (
            <p className="w-full text-center text-xl font-semibold text-[var(--color-honey)]">
              Ongoing
            </p>
          )}
        </div>
      </section>
    </article>
  );
};

export default BookingCard;
