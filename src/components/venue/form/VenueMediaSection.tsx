import Button from "../../ui/Button";

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
    <section className="space-y-2">
      <label className="block text-sm font-medium">Images</label>
      {mediaList.map((item, index) => (
        <section
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
            <Button
              type="button"
              onClick={() => onRemoveRow(index)}
              variant="danger"
              size="md"
              className="self-end sm:self-auto"
              aria-label="Remove image"
            >
              X
            </Button>
          )}
        </section>
      ))}
      <Button
        type="button"
        onClick={onAddRow}
        variant="outline"
        size="md"
        className="text-sm underline"
      >
        + Add another image
      </Button>
    </section>
  );
};

export default VenueMediaSection;
