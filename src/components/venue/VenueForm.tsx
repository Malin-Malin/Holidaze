import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ChangeEvent, SyntheticEvent } from "react";

import { CreateVenueSkeleton } from "../loading/pageSkeletons";
import VenueAmenitiesSection from "./form/venueAmenitiesSection";
import VenueBasicsSection from "./form/venueBasicsSection";
import VenueLocationSection from "./form/venueLocationSection";
import VenueMediaSection from "./form/venueMediaSection";
import type { VenueFormState } from "./form/venueForm.types";

import { createVenue, getVenueById, updateVenue } from "../../api/venueService";
import type { VenueData } from "../../types/venue.types";
import type { Media } from "../../types/common.types";
import { syncVenueNameState } from "../../utils/routeState";
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
};

const VenueForm = ({ venueId }: VenueFormProps) => {
  // useRequireAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(venueId);
  const [form, setForm] = useState<VenueFormState>(initialFormState);
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

        syncVenueNameState({
          navigate,
          to: `/venues/${venue.id}/edit`,
          locationState: location.state,
          venueName: venue.name,
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load venue.",
        );
      } finally {
        setIsLoadingVenue(false);
      }
    }

    void loadVenueForEdit();
  }, [location.state, navigate, venueId]);

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
      (item) => item.url && !isValidHttpUrl(item.url),
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
        <VenueBasicsSection
          form={form}
          onChange={handleChange}
          onRatingChange={(newRating) =>
            setForm((prevForm) => ({ ...prevForm, rating: newRating }))
          }
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
