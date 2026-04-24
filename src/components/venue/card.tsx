import { useNavigate } from "react-router-dom";
import type { Venue } from "../../types/venue.types";
import placeholderVenue from "../../assets/venue.jpg";
import { Rating } from "./rating";

type VenueCardData = Pick<
  Venue,
  "id" | "name" | "description" | "media" | "location" | "rating"
>;

type VenueCardProps = {
  venue: VenueCardData;
};

export const VenueCard = ({ venue }: VenueCardProps) => {
  const navigate = useNavigate();
  const primaryMedia = venue.media[0];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/venue/${venue.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/venue/${venue.id}`)}
      className="group mx-auto my-1 w-full max-w-sm cursor-pointer overflow-hidden border border-[var(--border)] bg-[var(--bg)] text-left shadow-sm ring-0 transition duration-200 transition-colors hover:-translate-y-0.5 hover:border-[var(--color-honey)] hover:ring-2 hover:ring-[var(--accent-border)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-honey)]"
      aria-label={`Venue: ${venue.name}, located in ${venue.location.city}, ${venue.location.country}. Description: ${venue.description}.`}
    >
      <img
        src={primaryMedia?.url || placeholderVenue}
        alt={primaryMedia?.alt || venue.name}
        className="h-52 w-full object-cover md:h-56"
      />
      <div className="space-y-2 p-4">
        <p className="text-sm text-[var(--text-h)]">
          {venue.location.city}, {venue.location.country}
        </p>
        <h3 className="line-clamp-1 text-xl text-[var(--text-h)]">
          {venue.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-[var(--text-h)]/90">
          {venue.description}
        </p>
        <Rating
          rating={venue.rating}
          className="pt-1 text-end text-lg tracking-wide text-amber-500"
        />
      </div>
    </div>
  );
};
