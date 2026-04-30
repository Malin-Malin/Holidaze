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

export function VenueSearchControls({
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
}: VenueSearchControlsProps) {
  return (
    <section className="mb-6 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-col gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by name, city or country"
            className="w-full rounded border border-[var(--border)] px-3 py-2 text-sm"
          />
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-h)]">
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

        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 pt-1 text-sm text-[var(--text-h)] lg:max-w-[40%]">
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
      </div>
    </section>
  );
}
