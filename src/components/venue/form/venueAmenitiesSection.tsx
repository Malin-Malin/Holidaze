import type { ChangeEvent } from "react";

import type { VenueFormState } from "./venueForm.types";

type VenueAmenitiesSectionProps = {
  form: VenueFormState;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const VenueAmenitiesSection = ({
  form,
  onChange,
}: VenueAmenitiesSectionProps) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      <label className="flex flex-col items-center gap-1 rounded px-2 py-1 hover:bg-black/5 sm:flex-row sm:gap-2">
        <input
          type="checkbox"
          name="wifi"
          checked={form.wifi}
          onChange={onChange}
          className="amenity-checkbox"
        />{" "}
        Wifi
      </label>
      <label className="flex flex-col items-center gap-1 rounded px-2 py-1 hover:bg-black/5 sm:flex-row sm:gap-2">
        <input
          type="checkbox"
          name="parking"
          checked={form.parking}
          onChange={onChange}
          className="amenity-checkbox"
        />{" "}
        Parking
      </label>
      <label className="flex flex-col items-center gap-1 rounded px-2 py-1 hover:bg-black/5 sm:flex-row sm:gap-2">
        <input
          type="checkbox"
          name="breakfast"
          checked={form.breakfast}
          onChange={onChange}
          className="amenity-checkbox"
        />{" "}
        Breakfast
      </label>
      <label className="flex flex-col items-center gap-1 rounded px-2 py-1 hover:bg-black/5 sm:flex-row sm:gap-2">
        <input
          type="checkbox"
          name="pets"
          checked={form.pets}
          onChange={onChange}
          className="amenity-checkbox"
        />{" "}
        Pets
      </label>
    </div>
  );
};

export default VenueAmenitiesSection;
