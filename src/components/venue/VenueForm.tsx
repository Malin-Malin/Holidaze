import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent, SyntheticEvent } from "react";

import VenueAmenitiesSection from "./form/VenueAmenitiesSection";
import VenueBasicsSection from "./form/VenueBasicsSection";
import VenueLocationSection from "./form/VenueLocationSection";
import VenueMediaSection from "./form/VenueMediaSection";

import type { Venue, VenueData } from "../../types/venue.types";
import type { Media } from "../../types/common.types";
import type { VenueFormState } from "./form/venueForm.types";
import { createVenue, updateVenue } from "../../api/venueService";
import { isValidHttpUrl } from "../../utils/url";

const initialFormState: VenueFormState = {
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

type VenueFormProps = {
  venueId?: string;
  initialVenue?: Venue;
};

const VenueForm = ({ venueId, initialVenue }: VenueFormProps) => {
  const navigate = useNavigate();
  const isEditMode = Boolean(venueId);

  const [form, setForm] = useState<VenueFormState>(initialFormState);
  const [mediaList, setMediaList] = useState<Media[]>([{ ...emptyMedia }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!initialVenue) return;
    setForm({
      name: initialVenue.name,
      description: initialVenue.description,
      price: initialVenue.price,
      maxGuests: initialVenue.maxGuests,
      rating: initialVenue.rating,
      city: initialVenue.location?.city || "",
      country: initialVenue.location?.country || "",
      wifi: initialVenue.meta?.wifi ?? false,
      parking: initialVenue.meta?.parking ?? false,
      breakfast: initialVenue.meta?.breakfast ?? false,
      pets: initialVenue.meta?.pets ?? false,
    });
    setMediaList(
      initialVenue.media && initialVenue.media.length > 0
        ? initialVenue.media
        : [{ ...emptyMedia }],
    );
  }, [initialVenue]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, type } = e.target;
    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "maxGuests" ? Number(value) : value,
    }));
  };

  const handleRatingChange = (rating: number) =>
    setForm((prev) => ({ ...prev, rating }));

  const handleMediaChange = (
    index: number,
    field: keyof Media,
    value: string,
  ) =>
    setMediaList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );

  const addMediaRow = () =>
    setMediaList((prev) => [...prev, { ...emptyMedia }]);

  const removeMediaRow = (index: number) =>
    setMediaList((prev) => prev.filter((_, i) => i !== index));

  const submitForm = async (e: SyntheticEvent<HTMLFormElement>) => {
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

    if (normalizedMedia.some((item) => item.url && !isValidHttpUrl(item.url))) {
      setErrorMessage(
        "Please enter valid image URLs (including http:// or https://).",
      );
      return;
    }

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

    try {
      setIsSubmitting(true);
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
      navigate(`/venues/${savedVenue.id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save venue.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 text-left pb-10">
      <h2>{isEditMode ? "Edit Venue" : "Create Venue"}</h2>

      <form onSubmit={submitForm} noValidate className="mt-4 space-y-4">
        <VenueBasicsSection
          form={form}
          onChange={handleChange}
          onRatingChange={handleRatingChange}
        />
        <VenueMediaSection
          mediaList={mediaList}
          onMediaChange={handleMediaChange}
          onAddRow={addMediaRow}
          onRemoveRow={removeMediaRow}
        />
        <VenueLocationSection form={form} onChange={handleChange} />
        <VenueAmenitiesSection amenities={form} onChange={handleChange} />

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

export default VenueForm;
