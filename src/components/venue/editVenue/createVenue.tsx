import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent, SyntheticEvent } from "react";
import { RatingInput } from "../../input/ratingInput";
import { FormField } from "../../input/formField";
import {
  createVenue,
  getVenueById,
  updateVenue,
} from "../../../api/venueService";
import { CreateVenueSkeleton } from "../../loading/pageSkeletons";
import type { VenueData } from "../../../types/venue.types";
import type { Media } from "../../../types/common.types";

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
  rating: 0,
  city: "",
  country: "",
  wifi: false,
  parking: false,
  breakfast: false,
  pets: false,
};

const emptyMedia: Media = { url: "", alt: "" };

type CreateVenueProps = {
  venueId?: string;
};

function isValidImageUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const CreateVenue = ({ venueId }: CreateVenueProps) => {
  // useRequireAuth();
  const navigate = useNavigate();
  const isEditMode = Boolean(venueId);
  const [form, setForm] = useState<CreateVenueForm>(initialFormState);
  const [mediaList, setMediaList] = useState<Media[]>([{ ...emptyMedia }]);
  const [isLoadingVenue, setIsLoadingVenue] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadVenueForEdit() {
      if (!venueId) return;

      try {
        setIsLoadingVenue(true);
        setErrorMessage("");
        const venue = await getVenueById(venueId);

        setForm({
          name: venue.name,
          description: venue.description,
          price: venue.price,
          maxGuests: venue.maxGuests,
          rating: venue.rating,
          city: venue.location?.city || "",
          country: venue.location?.country || "",
          wifi: venue.meta?.wifi ?? false,
          parking: venue.meta?.parking ?? false,
          breakfast: venue.meta?.breakfast ?? false,
          pets: venue.meta?.pets ?? false,
        });

        setMediaList(
          venue.media && venue.media.length > 0
            ? venue.media
            : [{ ...emptyMedia }],
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load venue.",
        );
      } finally {
        setIsLoadingVenue(false);
      }
    }

    void loadVenueForEdit();
  }, [venueId]);

  const handleMediaChange = (
    index: number,
    field: keyof Media,
    value: string,
  ) => {
    setMediaList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const addMediaRow = () =>
    setMediaList((prev) => [...prev, { ...emptyMedia }]);

  const removeMediaRow = (index: number) =>
    setMediaList((prev) => prev.filter((_, i) => i !== index));

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

    const normalizedMedia = mediaList.map((item) => ({
      url: item.url.trim(),
      alt: item.alt.trim(),
    }));

    const hasInvalidMediaUrl = normalizedMedia.some(
      (item) => item.url && !isValidImageUrl(item.url),
    );

    if (hasInvalidMediaUrl) {
      setErrorMessage(
        "Please enter valid image URLs (including http:// or https://).",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: VenueData = {
        name: form.name,
        description: form.description,
        media: normalizedMedia.filter((m) => m.url !== ""),
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

      const savedVenue = isEditMode
        ? await updateVenue(venueId as string, payload)
        : await createVenue(payload);

      setSuccessMessage(
        isEditMode
          ? "Venue updated successfully."
          : "Venue created successfully.",
      );

      if (!isEditMode) {
        setForm(initialFormState);
        setMediaList([{ ...emptyMedia }]);
      }

      navigate(`/venue/${savedVenue.id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create venue.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingVenue) {
    return <CreateVenueSkeleton />;
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 text-left pb-10">
      <h2>{isEditMode ? "Edit Venue" : "Create Venue"}</h2>

      <form onSubmit={submitForm} noValidate className="mt-4 space-y-4">
        <FormField label="Venue name" htmlFor="name">
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Venue name"
            className="form-input"
          />
        </FormField>

        <FormField label="Description" htmlFor="description">
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={5}
            className="form-input min-h-36 resize-y"
          />
        </FormField>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Images</label>
          {mediaList.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_12rem_auto] sm:items-center"
            >
              <input
                type="url"
                value={item.url}
                onChange={(e) =>
                  handleMediaChange(index, "url", e.target.value)
                }
                placeholder="Image URL"
                className="form-input sm:flex-1"
              />
              <input
                type="text"
                value={item.alt}
                onChange={(e) =>
                  handleMediaChange(index, "alt", e.target.value)
                }
                placeholder="Alt text"
                className="form-input"
              />
              {mediaList.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMediaRow(index)}
                  className="self-end rounded border border-[var(--color-danger)] px-3 py-2 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 sm:self-auto"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMediaRow}
            className="text-sm underline"
          >
            + Add another image
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Price per night" htmlFor="price">
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="form-input"
            />
          </FormField>
          <FormField label="Max guests" htmlFor="maxGuests">
            <input
              id="maxGuests"
              name="maxGuests"
              type="number"
              min={1}
              value={form.maxGuests}
              onChange={handleChange}
              placeholder="Max guests"
              className="form-input"
            />
          </FormField>
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
          <FormField label="City" htmlFor="city">
            <input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="form-input"
            />
          </FormField>
          <FormField label="Country" htmlFor="country">
            <input
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Country"
              className="form-input"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <label className="flex flex-col items-center gap-1 rounded px-2 py-1 hover:bg-black/5 sm:flex-row sm:gap-2">
            <input
              type="checkbox"
              name="wifi"
              checked={form.wifi}
              onChange={handleChange}
              className="amenity-checkbox"
            />{" "}
            Wifi
          </label>
          <label className="flex flex-col items-center gap-1 rounded px-2 py-1 hover:bg-black/5 sm:flex-row sm:gap-2">
            <input
              type="checkbox"
              name="parking"
              checked={form.parking}
              onChange={handleChange}
              className="amenity-checkbox"
            />{" "}
            Parking
          </label>
          <label className="flex flex-col items-center gap-1 rounded px-2 py-1 hover:bg-black/5 sm:flex-row sm:gap-2">
            <input
              type="checkbox"
              name="breakfast"
              checked={form.breakfast}
              onChange={handleChange}
              className="amenity-checkbox"
            />{" "}
            Breakfast
          </label>
          <label className="flex flex-col items-center gap-1 rounded px-2 py-1 hover:bg-black/5 sm:flex-row sm:gap-2">
            <input
              type="checkbox"
              name="pets"
              checked={form.pets}
              onChange={handleChange}
              className="amenity-checkbox"
            />{" "}
            Pets
          </label>
        </div>

        {errorMessage && (
          <p className="text-[var(--color-danger)]">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-[var(--color-success)]">{successMessage}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-[var(--color-ink)] px-4 py-2 text-[var(--color-honey)]"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Save changes"
              : "Create venue"}
        </button>
      </form>
    </section>
  );
};
