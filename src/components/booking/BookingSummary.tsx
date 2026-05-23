import LocationText from "../ui/LocationText";

import type { Venue } from "../../types/venue.types";
import { formatDate } from "../../utils/date";
import { formatPrice } from "../../utils/number";

type BookingSummaryProps = {
  venue: Venue;
  dateFrom: string;
  dateTo: string;
  guests: number;
  onDismiss?: () => void;
  showActions?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
};

const BookingSummary = ({
  venue,
  dateFrom,
  dateTo,
  guests,
  onDismiss,
  showActions,
  onConfirm,
  onCancel,
  children,
}: BookingSummaryProps) => {
  const checkInDate = new Date(dateFrom);
  const checkOutDate = new Date(dateTo);
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const totalPrice = formatPrice(venue.price * nights);

  return (
    <div className="relative rounded-xl border border-[var(--color-honey)]/40 bg-[var(--color-honey)]/5 p-6 md:p-8">
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-4 top-4 text-base text-[var(--text)]/60 transition hover:text-[var(--text)]"
          aria-label="Close summary"
        >
          ✕
        </button>
      )}

      <h3 className="mb-8 pb-8 text-center text-xl font-semibold tracking-wide text-[var(--color-honey)] md:text-2xl">
        Booking confirmation
      </h3>

      <div className="grid grid-cols-1 gap-7 text-base text-[var(--text)] md:grid-cols-3 md:gap-x-8 md:gap-y-6">
        <div>
          <p className="text-sm text-[var(--text)]/60 uppercase tracking-wide">
            Venue
          </p>
          <p className="text-lg font-medium">{venue.name}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--text)]/60 uppercase tracking-wide">
            Check in
          </p>
          <p className="text-lg font-medium">
            {formatDate(dateFrom, { fallback: "Unknown date" })}
          </p>
        </div>

        <div>
          <p className="text-sm text-[var(--text)]/60 uppercase tracking-wide">
            Check out
          </p>
          <p className="text-lg font-medium">
            {formatDate(dateTo, { fallback: "Unknown date" })}
          </p>
        </div>

        <div>
          <p className="text-sm text-[var(--text)]/60 uppercase tracking-wide">
            Location
          </p>
          <p className="text-lg font-medium">
            <LocationText venue={venue} fallback="Location unavailable" />
          </p>
        </div>

        <div>
          <p className="text-sm text-[var(--text)]/60 uppercase tracking-wide">
            Guests
          </p>
          <p className="text-lg font-medium">{guests}</p>
        </div>

        <div>
          <p className="text-sm text-[var(--text)]/60 uppercase tracking-wide">
            Nights
          </p>
          <p className="text-lg font-medium">{nights}</p>
        </div>
      </div>

      <div className="mt-8 border-t border-[var(--text)]/20 pt-6 pb-1">
        <div className="flex items-center justify-center text-center">
          <span className="text-base font-medium text-[var(--text)]/90 md:text-lg">
            {formatPrice(venue.price)} /night × {nights} nights =
            <span className="ml-2 text-xl font-semibold text-[var(--color-honey)] md:text-2xl">
              {totalPrice}
            </span>
          </span>
        </div>
      </div>

      <p className="mt-6 text-sm text-[var(--text)]/70 italic">
        Stay information: Check in from 15:00 and check out before 11:00.
        <br /> Please reach out if you have any questions.
      </p>
      <p className="mt-2 text-sm text-[var(--text)]/70 italic pt-2">
        You can manage your bookings on your profile.
      </p>
    </div>
  );
};

export default BookingSummary;
