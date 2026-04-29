import type { Venue } from "../../types/venue.types";
import { Link } from "react-router-dom";
import { VenueCard } from "../venue/card";

type OverviewVenueProps = {
  venues?: Venue[];
};

export default function OverviewVenue({ venues = [] }: OverviewVenueProps) {
  return (
    <section className="px-4 py-6">
      <h2 className="text-2xl font-[var(--font-display)] text-[var(--color-ink)] text-center p-4">
        My venues
      </h2>

      {venues.length === 0 ? (
        <p className="mt-4 text-[var(--text-h)]">
          You have not created any venues yet.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}

      <p className="mt-1 p-6 text-sm text-[var(--text-h)] text-end">
        {venues.length} {venues.length === 1 ? "venue" : "venues"} created
      </p>
      <Link
        to="/create-venue"
        className="rounded-md border border-[var(--color-honey)] bg-[var(--color-honey)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:opacity-90"
      >
        Create venue
      </Link>
    </section>
  );
}
