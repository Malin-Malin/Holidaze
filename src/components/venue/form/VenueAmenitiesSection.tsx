import type { ChangeEvent } from "react";

import type { VenueFormAmenities } from "./venueForm.types";

type VenueAmenitiesSectionProps = {
  amenities: VenueFormAmenities;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const VenueAmenitiesSection = ({
  amenities,
  onChange,
}: VenueAmenitiesSectionProps) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      <label className="flex flex-col items-center gap-1 rounded px-2 py-1 hover:bg-black/5 sm:flex-row sm:gap-2">
        <input
          type="checkbox"
          name="wifi"
          checked={amenities.wifi}
          onChange={onChange}
          className="amenity-checkbox"
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
        />{" "}
        Pets
      </label>
    </div>
  );
};

export default VenueAmenitiesSection;
