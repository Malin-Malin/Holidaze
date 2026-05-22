import type { Media } from "../../../types/common.types";

type VenueMediaSectionProps = {
  mediaList: Media[];
  onMediaChange: (index: number, field: keyof Media, value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
};

const VenueMediaSection = ({
  mediaList,
  onMediaChange,
  onAddRow,
  onRemoveRow,
}: VenueMediaSectionProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Images</label>
      {mediaList.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_12rem_auto] sm:items-center"
        >
          <input
            type="url"
            value={item.url}
            onChange={(e) => onMediaChange(index, "url", e.target.value)}
            placeholder="Image URL"
            className="form-input sm:flex-1"
          />
          <input
            type="text"
            value={item.alt}
            onChange={(e) => onMediaChange(index, "alt", e.target.value)}
            placeholder="Alt text"
            className="form-input"
          />
          {mediaList.length > 1 && (
            <button
              type="button"
              onClick={() => onRemoveRow(index)}
              className="self-end rounded border border-[var(--color-danger)] px-3 py-2 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 sm:self-auto"
              aria-label="Remove image"
            >
              X
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={onAddRow} className="text-sm underline">
        + Add another image
      </button>
    </div>
  );
};

export default VenueMediaSection;
