import { useParams } from "react-router-dom";
import { useVenueById } from "../hooks/useVenueById";
import { Amenities } from "../components/venue/amenities";
import { Rating } from "../components/venue/rating";

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

  return (
    <section>
      <div>
        <img src={venue.media[0]?.url} alt={venue.media[0]?.alt || ""} />
        <img src={venue.media[1]?.url} alt={venue.media[1]?.alt || ""} />
        <img src={venue.media[2]?.url} alt={venue.media[2]?.alt || ""} />
      </div>
      <h1>{venue.name}</h1>
      <Rating
        rating={venue.rating}
        className="mt-3 p-1 text-end text-lg tracking-wide text-amber-500"
      />
      <p>
        {venue.location.city}, {venue.location.country}
      </p>
      <p>Price per night: {venue.price}</p>

      <Amenities meta={venue.meta} />
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
