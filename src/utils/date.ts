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
