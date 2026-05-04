import { useParams } from "react-router-dom";
import { useVenueById } from "../hooks/useVenueById";
import { useAuth } from "../hooks/useAuth";
import { Amenities } from "../components/ui/amenities";
import { LocationText } from "../components/ui/locationText";
import { Rating } from "../components/ui/rating";
import Gallery from "../components/venue/gallery";
import { FaMapMarkerAlt } from "react-icons/fa";
import placeholderProfileAvatar from "../assets/placeholderProfileAvatar.jpg";
import { BookingForm } from "../components/booking/bookingForm";
import { formatDate } from "../utils/date";

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
  const detailsText = venue.description?.trim() || "More details are coming.";

  return (
    <section className="pb-10">
      <Gallery media={venue.media} />
      <section className="mx-auto w-full max-w-6xl space-y-5 px-4 pt-6 text-start md:px-6">
        <h1 className="mb-4 mt-0 break-words px-1 uppercase leading-tight">
          {venue.name}
        </h1>
        <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2 text-[var(--text)]">
            <FaMapMarkerAlt aria-hidden="true" />
            <LocationText
              city={venue.location.city}
              country={venue.location.country}
            />
          </p>
          <Rating
            rating={venue.rating}
            className="text-end text-lg tracking-wide text-amber-500"
          />
        </div>
        <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl text-[var(--text-h)]">
            Price: {formatPrice(venue.price)} / night
          </p>
          <p className="text-lg text-[var(--text)]">
            Max guests: {venue.maxGuests}
          </p>
        </div>
        <div className="-mx-4 md:-mx-6">
          <Amenities meta={venue.meta} />
        </div>
      </section>
      <section className="mx-auto mt-4 flex w-full max-w-6xl items-stretch gap-6 px-4 py-3 text-sm text-[var(--text)] md:px-6">
        <section className="flex flex-1 flex-col px-4 text-start md:px-6">
          <h2>Details</h2>
          <p className="pt-2 text-[var(--text)]">{detailsText}</p>
          <div className="mt-auto flex flex-col gap-3 pt-6 text-sm text-[var(--text)] sm:flex-row sm:items-center sm:justify-between">
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
                {formatDate(venue.created, { fallback: "Unknown date" })}
              </p>
              <p>
                Updated:{" "}
                {formatDate(venue.updated, { fallback: "Unknown date" })}
              </p>
            </div>
          </div>
        </section>
        <section className="flex-1 px-4 text-start md:px-6">
          <h2>Book {venue.name}</h2>
          <BookingForm venue={venue} />
        </section>
      </section>
    </section>
  );
}
