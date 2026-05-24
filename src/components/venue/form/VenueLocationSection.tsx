import type { ChangeEvent } from "react";

import FormField from "../../input/FormField";

import type { VenueFormState } from "./VenueForm.types";

type VenueLocationSectionProps = {
  form: VenueFormState;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors?: Partial<Record<keyof VenueFormState, string>>;
};

const VenueLocationSection = ({
  form,
  onChange,
  errors = {},
}: VenueLocationSectionProps) => {
  return (
    <section className="grid grid-cols-2 gap-3">
      <FormField label="City" htmlFor="city" error={errors.city}>
        <input
          id="city"
          name="city"
          value={form.city}
          onChange={onChange}
          placeholder="City"
          className="form-input"
        />
      </FormField>
      <FormField label="Country" htmlFor="country" error={errors.country}>
        <input
          id="country"
          name="country"
          value={form.country}
          onChange={onChange}
          placeholder="Country"
          className="form-input"
        />
      </FormField>
    </section>
  );
};

export default VenueLocationSection;
