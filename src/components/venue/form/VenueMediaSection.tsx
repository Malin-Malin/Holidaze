import Button from "../../ui/Button";

import type { Media } from "../../../types/common.types";

type VenueMediaSectionProps = {
  mediaList: Media[];
  onMediaChange: (index: number, field: keyof Media, value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  errors?: string[];
};

/**
 * Section component for managing venue media (images and alt text).
 * @param {VenueMediaSectionProps} props
 * @param {Media[]} props.mediaList - List of media items.
 * @param {(index: number, field: keyof Media, value: string) => void} props.onMediaChange - Handler for media changes.
 * @param {() => void} props.onAddRow - Handler to add a new media row.
 * @param {(index: number) => void} props.onRemoveRow - Handler to remove a media row.
 * @param {string[]} [props.errors] - Array of error messages for each media item.
 * @returns {JSX.Element}
 */
const VenueMediaSection = ({
  mediaList,
  onMediaChange,
  onAddRow,
  onRemoveRow,
  errors = [],
}: VenueMediaSectionProps) => {
  return (
    <section className="space-y-2">
      <label className="block text-sm font-medium">Images</label>
      {mediaList.map((item, index) => (
        <section
          key={index}
          className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_12rem_auto] sm:items-center"
        >
          <div>
            <input
              type="url"
              value={item.url}
              onChange={(e) => onMediaChange(index, "url", e.target.value)}
              placeholder="Image URL"
              className="form-input sm:flex-1"
            />
            {errors[index] && (
              <p className="text-sm text-[var(--color-danger)]">
                {errors[index]}
              </p>
            )}
          </div>
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
