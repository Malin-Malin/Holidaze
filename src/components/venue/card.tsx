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
      className="mx-auto my-4 w-full max-w-sm cursor-pointer border border-black bg-white p-1 text-left shadow-sm transition hover:shadow-md"
      aria-label={`Venue: ${venue.name}, located in ${venue.location.city}, ${venue.location.country}. Description: ${venue.description}.`}
    >
      <img
        src={primaryMedia?.url || placeholderVenue}
        alt={primaryMedia?.alt || venue.name}
        className="mb-3 h-50 w-full object-cover"
      />
      <p className="text-sm text-gray-500 px-1">
        {venue.location.city}, {venue.location.country}
      </p>
      <h3 className="mt-1 text-lg font-semibold text-gray-900 px-1">
        {venue.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-gray-700 px-1 line-clamp-2">
        {venue.description}
      </p>
      <Rating
        rating={venue.rating}
        className="mt-3 p-1 text-end text-lg tracking-wide text-amber-500"
      />
    </div>
  );
};
