import type { ChangeEvent } from "react";

import FormField from "../../input/FormField";
import RatingInput from "../../input/RatingInput";

import type { VenueFormState } from "./VenueForm.types";

type VenueBasicsSectionProps = {
  form: VenueFormState;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRatingChange: (rating: number) => void;
  errors?: Partial<Record<keyof VenueFormState, string>>;
};

/**
 * Section component for venue basic fields (name, description, price, rating).
 * @param {VenueBasicsSectionProps} props
 * @param {VenueFormState} props.form - The form state object.
 * @param {(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} props.onChange - Handler for input changes.
 * @param {(rating: number) => void} props.onRatingChange - Handler for rating changes.
 * @param {Partial<Record<keyof VenueFormState, string>>} [props.errors] - Validation errors.
 * @returns {JSX.Element}
 */
const VenueBasicsSection = ({
  form,
  onChange,
  onRatingChange,
  errors = {},
}: VenueBasicsSectionProps) => {
  return (
    <>
      <FormField label="Venue name" htmlFor="name" error={errors.name}>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Venue name"
          className="form-input"
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor="description"
        error={errors.description}
      >
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Description"
          rows={5}
          className="form-input min-h-36 resize-y"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Price per night" htmlFor="price" error={errors.price}>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            value={form.price}
            onChange={onChange}
            placeholder="Price"
            className="form-input"
          />
        </FormField>
        <FormField
          label="Max guests"
          htmlFor="maxGuests"
          error={errors.maxGuests}
        >
          <input
            id="maxGuests"
            name="maxGuests"
            type="number"
            min={1}
            value={form.maxGuests}
            onChange={onChange}
            placeholder="Max guests"
            className="form-input"
          />
        </FormField>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Venue rating</label>
        <RatingInput rating={form.rating} onChange={onRatingChange} />
      </div>
    </>
  );
};

export default VenueBasicsSection;
