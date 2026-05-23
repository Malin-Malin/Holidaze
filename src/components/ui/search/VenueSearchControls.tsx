type VenueSearchControlsProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

const VenueSearchControls = ({
  query,
  onQueryChange,
}: VenueSearchControlsProps) => {
  return (
    <section className="mb-6 p-4">
      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="shrink-0 text-sm text-[var(--text-h)]/80">
            Find your perfect place to stay
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label="Search venues"
            placeholder="Search by name, city or country"
            className="w-full rounded border border-[var(--border)] px-3 py-2 text-sm sm:flex-1"
          />
        </div>
      </div>
    </section>
  );
};

export default VenueSearchControls;
