import React from "react";

export type SortField = "created" | "rating" | "name";
export type SortOrder = "asc" | "desc";

interface SortControlsProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortFieldChange: (field: SortField) => void;
  onSortOrderChange: (order: SortOrder) => void;
}

/**
 * Sort controls component for selecting sort field and order.
 * @param {SortControlsProps} props
 * @param {SortField} props.sortField - The current sort field.
 * @param {SortOrder} props.sortOrder - The current sort order.
 * @param {(field: SortField) => void} props.onSortFieldChange - Handler for sort field changes.
 * @param {(order: SortOrder) => void} props.onSortOrderChange - Handler for sort order changes.
 * @returns {JSX.Element}
 */
const SortControls: React.FC<SortControlsProps> = ({
  sortField,
  sortOrder,
  onSortFieldChange,
  onSortOrderChange,
}) => {
  return (
    <section className="p-4">
      <div className="flex flex-row items-end gap-2 w-full">
        <div className="flex flex-row items-center gap-1 w-full sm:w-auto">
          <label
            htmlFor="sort-field"
            className="text-sm text-[var(--text-h)]/80"
          >
            Sort by:
          </label>
          <select
            id="sort-field"
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            className="rounded border border-[var(--color-honey)] px-3 py-2 text-sm bg-white dark:bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-white appearance-none [&::-ms-expand]:hidden"
          >
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="created">Created</option>
          </select>
          <button
            type="button"
            aria-label={
              sortOrder === "asc" ? "Ascending order" : "Descending order"
            }
            onClick={() =>
              onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
            }
            className="ml-1 rounded px-3 py-2 text-sm bg-white dark:bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-bark flex items-center justify-center"
          >
            {sortOrder === "asc" ? (
              <span title="Ascending">▲</span>
            ) : (
              <span title="Descending">▼</span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SortControls;
