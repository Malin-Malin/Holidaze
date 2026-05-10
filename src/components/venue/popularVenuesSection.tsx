import { useEffect, useState } from "react";
import { getVenues, type PaginationMeta } from "../../api/venueService";
import type { Venue } from "../../types/venue.types";
import { VenueCardsSkeleton } from "../loading/pageSkeletons";
import { ButtonLink } from "../ui/button";
import { VenueCard } from "./card";

const TARGET_COUNT = 3;
const TOP_POOL_SIZE = 40;

function hasAllAmenities(venue: Venue) {
  return (
    venue.meta.wifi &&
    venue.meta.parking &&
    venue.meta.breakfast &&
    venue.meta.pets
  );
}

function hasLocation(venue: Venue) {
  return Boolean(
    venue.location.city || venue.location.country || venue.location.address,
  );
}

function hasMedia(venue: Venue) {
  return venue.media.some((item) => Boolean(item.url?.trim()));
}

function isOngoingOrUpcomingBooking(dateTo?: string) {
  if (!dateTo) return false;
  return new Date(dateTo).getTime() >= Date.now();
}

function getBookingCount(venue: Venue) {
  return (
    venue.bookings?.filter((booking) =>
      isOngoingOrUpcomingBooking(booking.dateTo),
    ).length ?? 0
  );
}

function hasBookings(venue: Venue) {
  return getBookingCount(venue) > 0;
}

function getQualityScore(venue: Venue) {
  let score = 0;

  if (hasAllAmenities(venue)) score += 4;
  if (hasMedia(venue)) score += 2;
  if (hasLocation(venue)) score += 2;
  if (venue.maxGuests > 0) score += 1;

  // Rating is secondary to booking count and acts as a tie-break signal.
  score += venue.rating;

  return score;
}

function pickWeightedRandom<T>(items: T[], getWeight: (item: T) => number) {
  const pool = [...items];
  const selected: T[] = [];

  while (pool.length > 0 && selected.length < TARGET_COUNT) {
    const weights = pool.map((item) => Math.max(1, getWeight(item)));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let roll = Math.random() * total;
    let pickedIndex = 0;

    for (let i = 0; i < pool.length; i += 1) {
      roll -= weights[i];
      if (roll <= 0) {
        pickedIndex = i;
        break;
      }
    }

    selected.push(pool[pickedIndex]);
    pool.splice(pickedIndex, 1);
  }

  return selected;
}

function pickPopularVenues(venues: Venue[]) {
  const uniqueVenues = Array.from(
    new Map(venues.map((venue) => [venue.id, venue])).values(),
  );
  const bookedCandidates = uniqueVenues.filter(hasBookings);

  const ranked = [...bookedCandidates].sort((a, b) => {
    const bookingDiff = getBookingCount(b) - getBookingCount(a);
    if (bookingDiff !== 0) return bookingDiff;

    const qualityDiff = getQualityScore(b) - getQualityScore(a);
    if (qualityDiff !== 0) return qualityDiff;

    const ratingDiff = b.rating - a.rating;
    if (ratingDiff !== 0) return ratingDiff;

    return a.id.localeCompare(b.id);
  });

  const topPool = ranked.slice(0, TOP_POOL_SIZE);

  return pickWeightedRandom(topPool, (venue) => {
    const bookingsWeight = getBookingCount(venue) * 100;
    const qualityWeight = getQualityScore(venue) * 5;
    return bookingsWeight + qualityWeight;
  });
}

export function PopularVenuesSection() {
  const [popularVenues, setPopularVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPopularVenues() {
      try {
        setIsLoading(true);
        const collected: Venue[] = [];
        let page = 1;
        let nextPage: number | null | undefined = 1;

        while (nextPage) {
          const response = await getVenues(page, 50, true);
          collected.push(...response.data);

          const meta = (response.meta ?? {}) as PaginationMeta;
          nextPage = meta.nextPage ?? null;
          page = nextPage ?? page + 1;
        }

        setPopularVenues(pickPopularVenues(collected));
      } catch {
        setPopularVenues([]);
      } finally {
        setIsLoading(false);
      }
    }

    void loadPopularVenues();
  }, []);

  return (
    <section className="py-10 md:py-14">
      <div className="mb-4 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
        <h2 className="m-0 text-center text-2xl text-[var(--text-h)] md:col-start-2">
          Popular venues
        </h2>
        <div className="md:col-start-3 md:justify-self-end">
          <ButtonLink to="/venues" variant="outline" size="md">
            View all
          </ButtonLink>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <VenueCardsSkeleton count={3} />
        </div>
      )}

      {!isLoading && popularVenues.length === 0 && (
        <p className="py-4 text-left text-[var(--text)]">
          No popular venues match the criteria right now.
        </p>
      )}

      {!isLoading && popularVenues.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {popularVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </section>
  );
}
