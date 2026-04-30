import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Venue } from "../../types/venue.types";
import placeholderImage from "../../assets/placeholderImage.jpg";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { Rating } from "./rating";

type VenueCardData = Pick<
  Venue,
  "id" | "name" | "description" | "media" | "location" | "rating"
>;

type VenueCardProps = {
  venue: VenueCardData;
  onEdit?: (venueId: string) => void;
  onDelete?: (venueId: string) => void;
};

export const VenueCard = ({ venue, onEdit, onDelete }: VenueCardProps) => {
  const navigate = useNavigate();
  const primaryMedia = venue.media[0];
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const primaryUrl = primaryMedia?.url || "";
  const showPlaceholder = !primaryUrl || failedUrl === primaryUrl;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/venue/${venue.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/venue/${venue.id}`)}
      className="card-gradient-border group mx-auto my-1 flex h-full w-full max-w-sm cursor-pointer flex-col overflow-hidden text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-honey)]"
      aria-label={`Venue: ${venue.name}, located in ${[venue.location.city, venue.location.country].filter(Boolean).join(", ")}. Description: ${venue.description}.`}
    >
      <div className="relative">
        <img
          src={showPlaceholder ? placeholderImage : primaryUrl}
          alt={primaryMedia?.alt || venue.name}
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
          {[venue.location.city, venue.location.country]
            .filter(Boolean)
            .join(", ")}
        </p>
        <h3 className="line-clamp-1 text-xl text-[var(--text-h)]">
          {venue.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-[var(--text-h)]/90">
          {venue.description}
        </p>
        <div className="mt-auto pt-2">
          <Rating
            rating={venue.rating}
            className="text-end text-lg tracking-wide text-amber-500"
          />
          {(onEdit || onDelete) && (
            <div className="flex items-center justify-start gap-2 pt-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(venue.id);
                  }}
                  className="rounded border border-[var(--color-ink)] px-3 py-1 text-sm text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-honey)]"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(venue.id);
                  }}
                  className="rounded border border-red-700 px-3 py-1 text-sm text-red-700 hover:bg-red-700 hover:text-white"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
