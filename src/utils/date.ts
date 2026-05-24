type FormatDateOptions = {
  locale?: string;
  fallback?: string;
  options?: Intl.DateTimeFormatOptions;
};

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

/**
 * Formats a date value as a localized date string.
 * @param {string | Date | null | undefined} value - The date value to format.
 * @param {FormatDateOptions} [options] - Formatting options.
 * @returns {string} The formatted date string or fallback.
 */
export function formatDate(
  value?: string | Date | null,
  {
    locale = "en-GB",
    fallback = "Date unavailable",
    options = DEFAULT_DATE_OPTIONS,
  }: FormatDateOptions = {},
): string {
  if (!value) return fallback;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleDateString(locale, options);
}

/**
 * Returns a new Date set to the start of the given day.
 * @param {Date} value - The date to normalize.
 * @returns {Date} The start of the day.
 */
export function startOfDay(value: Date): Date {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
}

/**
 * Returns a new Date set to the start of the given month.
 * @param {Date} value - The date to normalize.
 * @returns {Date} The start of the month.
 */
export function startOfMonth(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

/**
 * Converts a Date to a YYYY-MM-DD string.
 * @param {Date} value - The date to convert.
 * @returns {string} The date key string.
 */
export function toDateKey(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Adds days to a date string and returns the new date key.
 * @param {string} dateString - The date string (YYYY-MM-DD).
 * @param {number} days - The number of days to add.
 * @returns {string} The new date key string.
 */
export function addDaysToDateKey(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}
