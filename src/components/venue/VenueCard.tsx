import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineImageNotSupported } from "react-icons/md";

import Rating from "../ui/Rating";
import LocationText from "../ui/LocationText";
import SafeImage from "../ui/SafeImage";

import placeholderImage from "../../assets/placeholderImage.jpg";
import Button from "../ui/Button";

import type { Venue } from "../../types/venue.types";

type VenueCardProps = {
  venue: Venue;
  onEdit?: (venueId: string) => void;
  onDelete?: (venueId: string) => void;
};

const VenueCard = ({ venue, onEdit, onDelete }: VenueCardProps) => {
  const navigate = useNavigate();
  const primaryMedia = venue.media[0];
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const primaryUrl = primaryMedia?.url || "";
  const showPlaceholder = !primaryUrl || failedUrl === primaryUrl;

  const venueName = venue.name?.trim() || "Unnamed venue";
  const descriptionText =
    venue.description?.trim() || "More details are coming.";

  const handleCardClick = () => {
    navigate(`/venues/${venue.id}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      className="card-gradient-border group mx-auto my-1 flex h-full w-full max-w-sm cursor-pointer flex-col overflow-hidden text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-honey)]"
      aria-label={`Venue: ${venueName}, located in ${venue.location?.city ?? "city not set"}, ${venue.location?.country ?? "country not set"}. Description: ${descriptionText}.`}
    >
      <div className="relative">
        <SafeImage
          src={primaryUrl}
          alt={primaryMedia?.alt || venueName}
          fallbackSrc={placeholderImage}
          fallbackAlt={venueName}
          onError={() => {
            if (!primaryUrl) return;
            setFailedUrl(primaryUrl);
          }}
          className="h-52 w-full object-cover md:h-56"
        />
        {showPlaceholder && (
          <div
            className="absolute right-3 top-3 p-2 text-white"
            title="Placeholder image"
            aria-label="Placeholder image"
          >
            <MdOutlineImageNotSupported size={20} aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-1 min-h-[1.25rem] text-sm text-[var(--text-h)]">
          <LocationText venue={venue} fallback="Location unavailable" />
        </p>
        <h3 className="line-clamp-1 text-xl pt-2 text-[var(--text-h)]">
          {venueName}
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-[var(--text-h)]/90">
          {descriptionText}
        </p>
        <div className="mt-auto pt-2">
          <Rating
            rating={venue.rating}
            className="text-end text-lg tracking-wide text-amber-500"
          />
          {(onEdit || onDelete) && (
            <div className="flex items-center justify-start gap-2 pt-2">
              {onEdit && (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(venue.id);
                  }}
                  variant="outline"
                  size="md"
                  className="text-sm"
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(venue.id);
                  }}
                  variant="danger"
                  size="md"
                  className="text-sm"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
