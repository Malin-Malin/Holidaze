import { useParams } from "react-router-dom";
import { useVenueById } from "../hooks/useVenueById";
import { useAuth } from "../hooks/useAuth";
import { Amenities } from "../components/venue/amenities";
import { Rating } from "../components/venue/rating";
import Gallery from "../components/venue/gallery";
import { FaMapMarkerAlt } from "react-icons/fa";
import placeholderProfileAvatar from "../assets/placeholderProfileAvatar.jpg";

function upperFirst(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const { venue, isLoading, errorMessage } = useVenueById(id);
  const { user } = useAuth();

  if (isLoading) {
    return (
      <p className="mx-auto w-full max-w-6xl px-4 py-10 text-left">
        Loading venue...
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p className="mx-auto w-full max-w-6xl px-4 py-10 text-left text-red-700">
        {errorMessage}
      </p>
    );
  }

  if (!venue) {
    return (
      <p className="mx-auto w-full max-w-6xl px-4 py-10 text-left">
        Venue not found.
      </p>
    );
  }

  const manager = venue.owner ?? user;

  return (
    <section className="pb-10">
      <Gallery media={venue.media} />
      <section className="mx-auto w-full max-w-6xl space-y-5 px-4 pt-6 text-start md:px-6">
        <h1 className="px-1 uppercase">{venue.name}</h1>
        <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2 text-[var(--text)]">
            <FaMapMarkerAlt aria-hidden="true" />
            <span>
              {[venue.location.city, venue.location.country]
                .filter(Boolean)
                .join(", ")}{" "}
            </span>
          </p>
          <Rating
            rating={venue.rating}
            className="text-end text-lg tracking-wide text-amber-500"
          />
        </div>
        <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl text-[var(--text-h)]">
            Price per night: {formatPrice(venue.price)}
          </p>
          <p className="text-lg text-[var(--text)]">
            Max guests: {venue.maxGuests}
          </p>
        </div>
        <div className="-mx-4 md:-mx-6">
          <Amenities meta={venue.meta} />
        </div>
        <div className="space-y-2 pt-4">
          <h2>Details</h2>
          <p className="text-[var(--text)]">{venue.description}</p>
        </div>
        <div className="flex flex-col gap-3 p-4 text-sm text-[var(--text)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src={manager?.avatar?.url || placeholderProfileAvatar}
              alt={manager?.avatar?.alt || manager?.name || "Venue manager"}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-xs text-[var(--text)]/60">Managed by</p>
              <span className="font-medium">
                {manager?.name || "Unknown manager"}
              </span>
            </div>
          </div>
          <div className="text-left text-[var(--text)]/60 sm:text-right">
            <p>
              Created:{" "}
              {new Date(venue.created).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p>
              Updated:{" "}
              {new Date(venue.updated).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto mt-4 w-full max-w-6xl space-y-3 px-4 text-start md:px-6">
        <h2>Booking</h2>
        <p className="text-[var(--text)]">
          Booking form with date picker and number of guests
        </p>
        <button className="inline-flex items-center justify-center rounded-md bg-[var(--color-ink)] px-5 py-2 text-[var(--color-honey)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-honey)]">
          Book now
        </button>
      </section>
    </section>
  );
}
