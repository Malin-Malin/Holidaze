import VenueCard from "./VenueCard";
import { VenueGridSkeleton } from "../loading/pageSkeletons";

import type { Venue } from "../../types/venue.types";

type VenueGridProps = {
  title?: string;
  numberOfVenues?: number;
  venues: Venue[];
  isLoading: boolean;
  fallbackMessage?: string;
  errorMessage?: string;
  handleEdit?: (venueId: string) => void;
  handleDelete?: (venueId: string) => void;
};

const VenueGrid = ({
  title,
  numberOfVenues = 12,
  venues,
  isLoading,
  fallbackMessage = "No venues found.",
  handleEdit,
  handleDelete,
  errorMessage,
}: VenueGridProps) => {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
      {title && (
        <h2 className="m-0 text-center text-2xl text-[var(--text-h)] md:col-start-2">
          {title}
        </h2>
      )}

      {errorMessage && (
        <p className="px-2 pb-4 text-left text-red-700">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && venues.length === 0 && (
        <p className="p-6 text-left">{fallbackMessage}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        {isLoading && <VenueGridSkeleton count={numberOfVenues} />}

        {!isLoading &&
          !errorMessage &&
          venues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onEdit={handleEdit ? () => handleEdit(venue.id) : undefined}
              onDelete={handleDelete ? () => handleDelete(venue.id) : undefined}
            />
          ))}
      </div>
    </section>
  );
};

export default VenueGrid;
