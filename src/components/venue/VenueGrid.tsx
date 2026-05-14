import { VenueCard } from "./card";
import { VenueGridSkeleton } from "../loading/pageSkeletons";
import type { Venue } from "../../types/venue.types";

type VenueGridProps = {
  title?: string;
  numberOfVenues?: number;
  venues: Venue[];
  isLoading: boolean;
  errorMessage?: string;
};

const VenueGrid = ({
  title,
  numberOfVenues = 12,
  venues,
  isLoading,
  errorMessage,
}: VenueGridProps) => {
  return (
    <>
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
          <p className="p-6 text-left">No venues found.</p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
          {isLoading && <VenueGridSkeleton count={numberOfVenues} />}

          {!isLoading &&
            !errorMessage &&
            venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
        </div>
      </section>
    </>
  );
};

export default VenueGrid;
