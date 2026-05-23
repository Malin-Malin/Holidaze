import type { AvailabilityCalendarCell } from "../../utils/booking";
import Button from "../ui/Button";

type CalendarCellProps = {
  cell: AvailabilityCalendarCell;
  className: string;
  tooltipText: string;
  ariaLabel: string;
  onSelect: (dateKey: string, isAvailable: boolean) => void;
};

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
      variant="outline"
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
