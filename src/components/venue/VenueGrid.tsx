import VenueCard from "./VenueCard";
import ButtonLink from "../ui/ButtonLink";
import { VenueGridSkeleton } from "../loading/PageSkeletons";

import type { Venue } from "../../types/venue.types";

type VenueGridProps = {
  title?: string;
  numberOfVenues?: number;
  venues: Venue[];
  isLoading: boolean;
  showViewAllButton?: boolean;
  fallbackMessage?: string;
  errorMessage?: string;
  handleEdit?: (venueId: string) => void;
  handleDelete?: (venueId: string) => void;
};

/**
 * Grid component for displaying a list of venues with optional loading and error states.
 * @param {VenueGridProps} props
 * @param {string} [props.title] - Title for the grid.
 * @param {number} [props.numberOfVenues] - Number of venues to display.
 * @param {Venue[]} props.venues - List of venues to display.
 * @param {boolean} props.isLoading - Loading state.
 * @param {boolean} [props.showViewAllButton] - Show view all button.
 * @param {string} [props.fallbackMessage] - Message to show if no venues found.
 * @param {string} [props.errorMessage] - Error message to display.
 * @param {(venueId: string) => void} [props.handleEdit] - Handler for edit action.
 * @param {(venueId: string) => void} [props.handleDelete] - Handler for delete action.
 * @returns {JSX.Element}
 */
const VenueGrid = ({
  title,
  numberOfVenues = 12,
  venues,
  isLoading,
  showViewAllButton = false,
  fallbackMessage = "No venues found.",
  handleEdit,
  handleDelete,
  errorMessage,
}: VenueGridProps) => {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
      {showViewAllButton && (
        <div className="mb-4 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
          {title && (
            <h2 className="m-0 text-center text-2xl text-[var(--text-h)] md:col-start-2">
              {title}
            </h2>
          )}
          <div className="md:col-start-3 md:justify-self-end">
            <ButtonLink
              to="/venues"
              variant="outline"
              size="md"
              aria-label="View all venues"
            >
              View all
            </ButtonLink>
          </div>
        </div>
      )}
      {!showViewAllButton && title && (
        <h2 className="m-0 text-center text-2xl text-[var(--text-h)] md:col-start-2">
          {title}
        </h2>
      )}

      {errorMessage && (
        <p className="px-2 pb-4 text-left text-[var(--color-danger)]">
          {errorMessage}
        </p>
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
