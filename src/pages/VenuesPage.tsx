import { VenueCard } from "../components/venue/card";
import { useVenues } from "../hooks/useVenues";

export default function VenuesPage() {
  const { venues, isLoading, errorMessage } = useVenues();

  if (isLoading) {
    return <p>Loading venues...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <>
      {venues.length === 0 && <p>No venues found.</p>}
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </>
  );
}
