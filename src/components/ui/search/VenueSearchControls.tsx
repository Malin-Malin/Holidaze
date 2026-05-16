type VenueSearchControlsProps = {
  query: string;
  minRating: number;
  pets: boolean;
  parking: boolean;
  wifi: boolean;
  breakfast: boolean;
  onQueryChange: (value: string) => void;
  onMinRatingChange: (value: number) => void;
  onPetsChange: (value: boolean) => void;
  onParkingChange: (value: boolean) => void;
  onWifiChange: (value: boolean) => void;
  onBreakfastChange: (value: boolean) => void;
};

const ratingOptions = [0, 1, 2, 3, 4, 5] as const;

const VenueSearchControls = ({
  query,
  minRating,
  pets,
  parking,
  wifi,
  breakfast,
  onQueryChange,
  onMinRatingChange,
  onPetsChange,
  onParkingChange,
  onWifiChange,
  onBreakfastChange,
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
            placeholder="Search by name, city or country"
            className="w-full rounded border border-[var(--border)] px-3 py-2 text-sm sm:flex-1"
          />
        </div>

        <div className="flex flex-wrap justify-around items-center gap-2 text-sm text-[var(--text-h)] lg:flex-nowrap">
          <div className="grid grid-cols-2 items-center gap-2 sm:flex sm:flex-wrap">
            <label className="flex items-center gap-2 rounded px-2 py-1 hover:bg-black/5 whitespace-nowrap">
              <input
                type="checkbox"
                checked={wifi}
                onChange={(e) => onWifiChange(e.target.checked)}
                className="amenity-checkbox shrink-0"
              />
              Wifi
            </label>
            <label className="flex items-center gap-2 rounded px-2 py-1 hover:bg-black/5 whitespace-nowrap">
              <input
                type="checkbox"
                checked={parking}
                onChange={(e) => onParkingChange(e.target.checked)}
                className="amenity-checkbox shrink-0"
              />
              Parking
            </label>
            <label className="flex items-center gap-2 rounded px-2 py-1 hover:bg-black/5 whitespace-nowrap">
              <input
                type="checkbox"
                checked={breakfast}
                onChange={(e) => onBreakfastChange(e.target.checked)}
                className="amenity-checkbox shrink-0"
              />
              Breakfast
            </label>
            <label className="flex items-center gap-2 rounded px-2 py-1 hover:bg-black/5 whitespace-nowrap">
              <input
                type="checkbox"
                checked={pets}
                onChange={(e) => onPetsChange(e.target.checked)}
                className="amenity-checkbox shrink-0"
              />
              Pets
            </label>
          </div>

          <div className="ml-3 flex flex-wrap items-center gap-4">
            {ratingOptions.map((rating) => {
              const isActive = minRating === rating;

              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() => onMinRatingChange(rating)}
                  className={`rounded border px-2 py-1 text-xs transition ${
                    isActive
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-honey)]"
                      : "border-[var(--border)] text-[var(--text-h)] hover:border-[var(--color-ink)]"
                  }`}
                  aria-pressed={isActive}
                >
                  {rating === 0 ? "All" : `${rating}+`}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueSearchControls;
