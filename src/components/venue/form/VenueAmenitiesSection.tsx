import type { ChangeEvent } from "react";

import type { VenueFormAmenities } from "./VenueForm.types";

type VenueAmenitiesSectionProps = {
  amenities: VenueFormAmenities;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

/**
 * Section component for venue amenities checkboxes (wifi, parking, breakfast, pets).
 * @param {VenueAmenitiesSectionProps} props
 * @param {VenueFormAmenities} props.amenities - Amenities state object.
 * @param {(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} props.onChange - Handler for input changes.
 * @returns {JSX.Element}
 */
const VenueAmenitiesSection = ({
  amenities,
  onChange,
}: VenueAmenitiesSectionProps) => {
  return (
    <section className="grid grid-cols-4 gap-2">
      <label className="flex flex-col items-center gap-1 rounded px-2 py-1 hover:bg-black/5 sm:flex-row sm:gap-2">
        <input
          type="checkbox"
          name="wifi"
          checked={amenities.wifi}
          onChange={onChange}
          className="amenity-checkbox"
          aria-label="Wifi"
        />{" "}
        Wifi
      </label>
      <label className="flex flex-col items-center gap-1 rounded px-2 py-1 hover:bg-black/5 sm:flex-row sm:gap-2">
        <input
          type="checkbox"
          name="parking"
          checked={amenities.parking}
          onChange={onChange}
          className="amenity-checkbox"
          aria-label="Parking"
        />{" "}
        Parking
      </label>
      <label className="flex flex-col items-center gap-1 rounded px-2 py-1 hover:bg-black/5 sm:flex-row sm:gap-2">
        <input
          type="checkbox"
          name="breakfast"
          checked={amenities.breakfast}
          onChange={onChange}
          className="amenity-checkbox"
          aria-label="Breakfast"
        />{" "}
        Breakfast
      </label>
      <label className="flex flex-col items-center gap-1 rounded px-2 py-1 hover:bg-black/5 sm:flex-row sm:gap-2">
        <input
          type="checkbox"
          name="pets"
          checked={amenities.pets}
          onChange={onChange}
          className="amenity-checkbox"
          aria-label="Pets"
        />{" "}
        Pets
      </label>
    </section>
  );
};

export default VenueAmenitiesSection;
