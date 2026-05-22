import type { ChangeEvent } from "react";

import FormField from "../../input/FormField";

import type { VenueFormState } from "./VenueForm.types";

type VenueLocationSectionProps = {
  form: VenueFormState;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const VenueLocationSection = ({
  form,
  onChange,
}: VenueLocationSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FormField label="City" htmlFor="city">
        <input
          id="city"
          name="city"
          value={form.city}
          onChange={onChange}
          placeholder="City"
          className="form-input"
        />
      </FormField>
      <FormField label="Country" htmlFor="country">
        <input
          id="country"
          name="country"
          value={form.country}
          onChange={onChange}
          placeholder="Country"
          className="form-input"
        />
      </FormField>
    </div>
  );
};

export default VenueLocationSection;
