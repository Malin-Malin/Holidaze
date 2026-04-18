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
    <section className="mx-auto w-full max-w-6xl px-4 py-6">
      {venues.length === 0 && <p>No venues found.</p>}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </section>
  );
}
