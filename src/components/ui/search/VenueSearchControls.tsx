import FormField from "../../input/FormField";

type VenueSearchControlsProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

/**
 * Search controls component for filtering venues by query.
 * @param {VenueSearchControlsProps} props
 * @param {string} props.query - The search query value.
 * @param {(value: string) => void} props.onQueryChange - Handler for query changes.
 * @returns {JSX.Element}
 */
const VenueSearchControls = ({
  query,
  onQueryChange,
}: VenueSearchControlsProps) => {
  return (
    <section className="p-4">
      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <FormField
            htmlFor="venue-search-input"
            className="w-full sm:flex-1 m-0"
          >
            <input
              id="venue-search-input"
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by name, city or country"
              className="w-full rounded border border-[var(--color-honey)] px-3 py-2 text-sm"
            />
          </FormField>
          <span className="shrink-0 text-sm text-[var(--text-h)]/80">
            Find your perfect place to stay
          </span>
        </div>
      </div>
    </section>
  );
};

export default VenueSearchControls;
