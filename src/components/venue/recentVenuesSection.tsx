import { useEffect, useState } from "react";
import { getVenues } from "../../api/venueService";
import type { Venue } from "../../types/venue.types";
import { ButtonLink } from "../ui/button";
import { VenueCard } from "./card";

export function RecentVenuesSection() {
  const [recentVenues, setRecentVenues] = useState<Venue[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);

  useEffect(() => {
    async function loadRecentVenues() {
      try {
        setIsLoadingRecent(true);
        const response = await getVenues(1, 50);
        const latest = [...response.data]
          .sort(
            (first, second) =>
              new Date(second.created).getTime() -
              new Date(first.created).getTime(),
          )
          .slice(0, 3);

        setRecentVenues(latest);
      } catch {
        setRecentVenues([]);
      } finally {
        setIsLoadingRecent(false);
      }
    }

    void loadRecentVenues();
  }, []);

  return (
    <section className="py-10 md:py-14">
      <div className="mb-4 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
        <h2 className="m-0 text-center text-2xl text-[var(--text-h)] md:col-start-2">
          Recently added venues
        </h2>
        <div className="md:col-start-3 md:justify-self-end">
          <ButtonLink to="/venues" variant="outline" size="md">
            View all
          </ButtonLink>
        </div>
      </div>

      {isLoadingRecent && (
        <p className="py-4 text-left text-[var(--text)]">Loading venues...</p>
      )}

      {!isLoadingRecent && recentVenues.length === 0 && (
        <p className="py-4 text-left text-[var(--text)]">
          No recent venues available right now.
        </p>
      )}

      {!isLoadingRecent && recentVenues.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {recentVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </section>
  );
}
