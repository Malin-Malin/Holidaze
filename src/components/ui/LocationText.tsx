import { FaMapMarkerAlt } from "react-icons/fa";

import type { Venue } from "../../types/venue.types";

type LocationTextProps = {
  venue: Venue;
  fallback?: string;
};

/**
 * Component for displaying a venue's location (city and country) with an icon.
 * @param {LocationTextProps} props
 * @param {Venue} props.venue - The venue object.
 * @param {string} [props.fallback] - Fallback text if location is missing.
 * @returns {JSX.Element}
 */
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
