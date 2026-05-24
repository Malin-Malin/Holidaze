import Button from "../ui/Button";

import type { AvailabilityCalendarCell } from "../../utils/booking";

type CalendarCellProps = {
  cell: AvailabilityCalendarCell;
  className: string;
  tooltipText: string;
  ariaLabel: string;
  onSelect: (dateKey: string, isAvailable: boolean) => void;
};

/**
 * Calendar cell component for displaying a single day in the availability calendar.
 * @param {CalendarCellProps} props
 * @param {AvailabilityCalendarCell} props.cell - Cell data for the day.
 * @param {string} props.className - CSS class for styling.
 * @param {string} props.tooltipText - Tooltip text for the cell.
 * @param {string} props.ariaLabel - Accessible label for the cell.
 * @param {(dateKey: string, isAvailable: boolean) => void} props.onSelect - Handler for cell selection.
 * @returns {JSX.Element}
 */
const CalendarCell = ({
  cell,
  className,
  tooltipText,
  ariaLabel,
  onSelect,
}: CalendarCellProps) => {
  return (
    <Button
      type="button"
      onClick={() => onSelect(cell.dateKey, cell.isAvailable)}
      className={className}
      aria-disabled={!cell.isAvailable}
      aria-label={ariaLabel}
      variant="calendar"
      size="sm"
    >
      {cell.dayNumber}
      {cell.isBooked && (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-[var(--color-honey)]/40 bg-[var(--color-ink)] px-2 py-1 text-[11px] font-medium text-[var(--color-honey)] shadow-lg group-hover:block group-focus-visible:block">
          {tooltipText}
        </span>
      )}
      {cell.isAvailable && (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-[var(--color-honey)]/40 bg-[var(--color-ink)] px-2 py-1 text-[11px] font-medium text-[var(--color-honey)] shadow-lg group-hover:block group-focus-visible:block">
          Available
        </span>
      )}
    </Button>
  );
};

export default CalendarCell;
