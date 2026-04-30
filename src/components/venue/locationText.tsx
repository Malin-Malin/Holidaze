type LocationTextProps = {
  city?: string | null;
  country?: string | null;
  fallback?: string;
};

export function LocationText({
  city,
  country,
  fallback = "No location registered",
}: LocationTextProps) {
  const text = [city, country].filter(Boolean).join(", ") || fallback;

  return <span>{text}</span>;
}
