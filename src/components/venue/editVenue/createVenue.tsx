import { useState } from "react";
import type { ChangeEvent, SyntheticEvent } from "react";
import { RatingInput } from "../../input/rating";
import { createVenue } from "../../../api/venueService";
import type { VenueData } from "../../../types/venue.types";

type CreateVenueForm = {
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  rating: number;
  city: string;
  country: string;
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
};

const initialFormState: CreateVenueForm = {
  name: "",
  description: "",
  price: 0,
  maxGuests: 1,
  rating: 1,
  city: "",
  country: "",
  wifi: false,
  parking: false,
  breakfast: false,
  pets: false,
};

export const CreateVenue = () => {
  const [form, setForm] = useState<CreateVenueForm>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, type } = e.target;
    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "price" || name === "maxGuests" ? Number(value) : value,
    }));
  };

  async function submitForm(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!form.name || !form.description || !form.city || !form.country) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: VenueData = {
        name: form.name,
        description: form.description,
        media: [],
        price: form.price,
        maxGuests: form.maxGuests,
        rating: form.rating,
        meta: {
          wifi: form.wifi,
          parking: form.parking,
          breakfast: form.breakfast,
          pets: form.pets,
        },
        location: {
          address: "",
          city: form.city,
          zip: "",
          country: form.country,
          continent: "",
          lat: 0,
          lng: 0,
        },
      };

      await createVenue(payload);
      setSuccessMessage("Venue created successfully.");
      setForm(initialFormState);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create venue.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 text-left">
      <h2>Create Venue</h2>

      <form onSubmit={submitForm} className="mt-4 space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Venue name"
          className="w-full rounded border px-3 py-2"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full rounded border px-3 py-2"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            name="price"
            type="number"
            min={0}
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full rounded border px-3 py-2"
          />
          <input
            name="maxGuests"
            type="number"
            min={1}
            value={form.maxGuests}
            onChange={handleChange}
            placeholder="Max guests"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Venue rating</label>
          <RatingInput
            rating={form.rating}
            onChange={(newRating) =>
              setForm((prevForm) => ({ ...prevForm, rating: newRating }))
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full rounded border px-3 py-2"
          />
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Country"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label>
            <input
              type="checkbox"
              name="wifi"
              checked={form.wifi}
              onChange={handleChange}
            />{" "}
            Wifi
          </label>
          <label>
            <input
              type="checkbox"
              name="parking"
              checked={form.parking}
              onChange={handleChange}
            />{" "}
            Parking
          </label>
          <label>
            <input
              type="checkbox"
              name="breakfast"
              checked={form.breakfast}
              onChange={handleChange}
            />{" "}
            Breakfast
          </label>
          <label>
            <input
              type="checkbox"
              name="pets"
              checked={form.pets}
              onChange={handleChange}
            />{" "}
            Pets
          </label>
        </div>

        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        {successMessage && <p className="text-green-700">{successMessage}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-[var(--color-ink)] px-4 py-2 text-[var(--color-honey)]"
        >
          {isSubmitting ? "Saving..." : "Create venue"}
        </button>
      </form>
    </section>
  );
};
