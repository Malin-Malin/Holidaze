import { VenueCard } from "../components/venue/card";
import { useVenues } from "../hooks/useVenues";

export default function VenuesGrid() {
  const { venues, isLoading, errorMessage } = useVenues();

  if (isLoading) {
    return (
      <p className="mx-auto w-full max-w-6xl px-4 py-10 text-left">
        Loading venues...
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

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
      {venues.length === 0 && <p className="p-6 text-left">No venues found.</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </section>
  );
}
