import { FaMapMarkerAlt } from "react-icons/fa";
import type { Venue } from "../../types/venue.types";

type LocationTextProps = {
  venue: Venue;
  fallback?: string;
};

const LocationText = ({
  venue,
  fallback = "No location registered",
}: LocationTextProps) => {
  const text =
    [venue.location?.city, venue.location?.country]
      .filter(Boolean)
      .join(", ") || fallback;

  return (
    <>
      <span className="inline-flex items-center gap-1">
        <FaMapMarkerAlt aria-hidden="true" />
        {text}
      </span>
    </>
  );
};

export default LocationText;
