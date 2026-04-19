import { useParams } from "react-router-dom";
import { useVenueById } from "../hooks/useVenueById";

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const { venue, isLoading, errorMessage } = useVenueById(id);

  if (isLoading) {
    return <p>Loading venue...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  if (!venue) {
    return <p>Venue not found.</p>;
  }

  const filledStarCount = Math.floor(Math.max(0, Math.min(5, venue.rating)));

  return (
    <section>
      <div>
        <img src={venue.media[0]?.url} alt={venue.media[0]?.alt || ""} />
        <img src={venue.media[1]?.url} alt={venue.media[1]?.alt || ""} />
        <img src={venue.media[2]?.url} alt={venue.media[2]?.alt || ""} />
      </div>
      <h1>{venue.name}</h1>
      <p
        className="mt-3 text-lg tracking-wide text-amber-500 text-end p-1"
        aria-label={`Rating ${filledStarCount} out of 5`}
      >
        {"★".repeat(filledStarCount)}
      </p>
      <p>
        {venue.location.city}, {venue.location.country}
      </p>
      <p>Price per night: {venue.price}</p>

      <div>
        {/* TODO:icons for amenities, e.g. wifi, parking, breakfast included, etc. */}
        <h2>Amenities</h2>
      </div>
      <p>Max guests: {venue.maxGuests}</p>
      <h2>Details</h2>
      <p>{venue.description}</p>

      <p>Created: {venue.created}</p>
      <p>Updated: {venue.updated}</p>
      <section>
        <h2>Booking</h2>
        <p>Booking form with date picker and number of guests</p>
        <button>Book now</button>
      </section>
    </section>
  );
}
