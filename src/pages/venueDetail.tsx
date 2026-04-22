import { useParams } from "react-router-dom";
import { useVenueById } from "../hooks/useVenueById";
import { Amenities } from "../components/venue/amenities";
import { Rating } from "../components/venue/rating";
import Gallery from "../components/venue/gallery";
import { FaMapMarkerAlt } from "react-icons/fa";

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
      <Gallery media={venue.media} />
      <section className="p-4 text-start m-4">
        <h1 className="uppercase">{venue.name}</h1>
        <Rating
          rating={venue.rating}
          className="mt-3 p-1 text-end text-lg tracking-wide text-amber-500"
        />
        <p className="inline-flex items-center gap-2">
          <FaMapMarkerAlt aria-hidden="true" />
          <span>
            {venue.location.city}, {venue.location.country}
          </span>
        </p>
        <p>Price per night: {venue.price}</p>

        <Amenities meta={venue.meta} />
        <p>Max guests: {venue.maxGuests}</p>
        <h2>Details</h2>
        <p>{venue.description}</p>

        <p>Created: {venue.created}</p>
        <p>Updated: {venue.updated}</p>
      </section>
      <section>
        <h2>Booking</h2>
        <p>Booking form with date picker and number of guests</p>
        <button>Book now</button>
      </section>
    </section>
  );
}
