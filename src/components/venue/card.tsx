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
    <div>
      {primaryMedia && (
        <img src={primaryMedia.url} alt={primaryMedia.alt || venue.name} />
      )}
      <p>
        {venue.location.city}, {venue.location.country}
      </p>
      <h2>{venue.name}</h2>
      <p>{venue.description}</p>
      <p aria-label={`Rating ${filledStarCount} out of 5`}>
        {"★".repeat(filledStarCount)}
      </p>
    </div>
  );
};
