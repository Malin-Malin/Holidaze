import type { Media } from "../../types/common.types";
import type { VenueLocation } from "../../types/venue.types";

type VenueCardData = {
  name: string;
  description: string;
  media: Media[];
  location: VenueLocation;
  rating: number;
};

type VenueCardProps = {
  venue: VenueCardData;
};

export const VenueCard = ({ venue }: VenueCardProps) => {
  const primaryMedia = venue.media[0];
  const filledStarCount = Math.floor(Math.max(0, Math.min(5, venue.rating)));

  return (
    <div
      className="mx-auto my-4 w-full max-w-sm border border-gray-200 bg-white p-1 text-left shadow-sm transition hover:shadow-md"
      aria-label={`Venue: ${venue.name}, located in ${venue.location.city}, ${venue.location.country}. Description: ${venue.description}. Rating: ${filledStarCount} out of 5 stars.`}
    >
      {primaryMedia && (
        <img
          src={primaryMedia.url}
          alt={primaryMedia.alt || venue.name}
          className="mb-3 h-50 w-full object-cover"
        />
      )}
      <p className="text-sm text-gray-500 px-1">
        {venue.location.city}, {venue.location.country}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-gray-900 px-1">
        {venue.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-gray-700 px-1 line-clamp-2">
        {venue.description}
      </p>
      <p
        className="mt-3 text-lg tracking-wide text-amber-500 text-end p-1"
        aria-label={`Rating ${filledStarCount} out of 5`}
      >
        {"★".repeat(filledStarCount)}
      </p>
    </div>
  );
};
