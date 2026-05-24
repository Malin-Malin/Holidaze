import { useEffect, useState, useMemo } from "react";
import { isFormDirty, isArrayDirty } from "../../utils/form";
import ConfirmModal from "../ui/ConfirmModal";
import { useDirtyFormBlocker } from "../../hooks/useDirtyFormBlocker";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent, SyntheticEvent } from "react";

import VenueAmenitiesSection from "./form/VenueAmenitiesSection";
import VenueBasicsSection from "./form/VenueBasicsSection";
import VenueLocationSection from "./form/VenueLocationSection";
import VenueMediaSection from "./form/VenueMediaSection";

import Button from "../ui/Button";

import type { Venue, VenueData } from "../../types/venue.types";
import type { Media } from "../../types/common.types";
import type { VenueFormState } from "./form/VenueForm.types";

import { createVenue, updateVenue } from "../../api/venueService";
import { isValidHttpUrl } from "../../utils/url";
import { useToast } from "../../hooks/useToast";

const initialFormState: VenueFormState = {
  name: "",
  description: "",
  price: "100",
  maxGuests: "1",
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

type VenueFieldErrors = Partial<Record<keyof VenueFormState, string>> & {
  media?: string[];
};

const VenueForm = ({ venueId, initialVenue }: VenueFormProps) => {
  const navigate = useNavigate();
  const isEditMode = Boolean(venueId);

  const [form, setForm] = useState<VenueFormState>(initialFormState);
  const [mediaList, setMediaList] = useState<Media[]>([{ ...emptyMedia }]);

  // Dirty check: compare form and mediaList to initial values
  const dirty = useMemo(() => {
    let initialForm = initialFormState;
    let initialMedia = [{ ...emptyMedia }];
    if (isEditMode && initialVenue) {
      initialForm = {
        name: initialVenue.name,
        description: initialVenue.description,
        price: initialVenue.price?.toString() ?? "",
        maxGuests: initialVenue.maxGuests?.toString() ?? "",
        rating: initialVenue.rating,
        city: initialVenue.location?.city || "",
        country: initialVenue.location?.country || "",
        wifi: initialVenue.meta?.wifi ?? false,
        parking: initialVenue.meta?.parking ?? false,
        breakfast: initialVenue.meta?.breakfast ?? false,
        pets: initialVenue.meta?.pets ?? false,
      };
      initialMedia =
        initialVenue.media && initialVenue.media.length > 0
          ? initialVenue.media
          : [{ ...emptyMedia }];
    }
    const formDirty = isFormDirty(form, initialForm);
    const mediaDirty = isArrayDirty(mediaList, initialMedia);
    return formDirty || mediaDirty;
  }, [form, mediaList, isEditMode, initialVenue]);

  const {
    showModal: showNavModal,
    handleConfirm: handleNavConfirm,
    handleCancel: handleNavCancel,
  } = useDirtyFormBlocker(dirty);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<VenueFieldErrors>({});
  const { showToast } = useToast();

  useEffect(() => {
    if (!initialVenue) return;
    setForm({
      name: initialVenue.name,
      description: initialVenue.description,
      price: initialVenue.price?.toString() ?? "",
      maxGuests: initialVenue.maxGuests?.toString() ?? "",
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
    const { name, type, value } = e.target;
    let newValue: string | number | boolean = value;
    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleRatingChange = (rating: number) => {
    setForm((prev) => ({ ...prev, rating }));
    setErrors((prev) => ({ ...prev, rating: undefined }));
  };

  const handleMediaChange = (
    index: number,
    field: keyof Media,
    value: string,
  ) => {
    setMediaList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
    setErrors((prev) => {
      if (!prev.media) return prev;
      const newMedia = [...prev.media];
      if (newMedia[index]) newMedia[index] = "";
      return { ...prev, media: newMedia };
    });
  };

  const addMediaRow = () =>
    setMediaList((prev) => [...prev, { ...emptyMedia }]);

  const removeMediaRow = (index: number) =>
    setMediaList((prev) => prev.filter((_, i) => i !== index));

  function validate(): VenueFieldErrors {
    const next: VenueFieldErrors = {};
    if (!form.name) next.name = "Venue name is required.";

    if (!form.description) next.description = "Description is required.";

    if (
      form.price === "" ||
      form.price === undefined ||
      form.price === null ||
      isNaN(Number(form.price)) ||
      Number(form.price) < 1
    ) {
      next.price = "Price per night should be at least 1.";
    }

    if (
      form.maxGuests === "" ||
      form.maxGuests === undefined ||
      form.maxGuests === null ||
      isNaN(Number(form.maxGuests)) ||
      Number(form.maxGuests) < 1
    ) {
      next.maxGuests = "Max guests  should be at least 1.";
    }

    if (!form.city) next.city = "City is required.";
    if (!form.country) next.country = "Country is required.";

    // Media validation
    const mediaErrors: string[] = [];
    mediaList.forEach((item, idx) => {
      if (item.url && !isValidHttpUrl(item.url)) {
        mediaErrors[idx] = "Invalid image URL.";
      }
    });
    if (mediaErrors.some(Boolean)) next.media = mediaErrors;

    return next;
  }

  const submitForm = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    const normalizedMedia = mediaList.map((item) => ({
      url: item.url.trim(),
      alt: item.alt.trim(),
    }));

    const payload: VenueData = {
      name: form.name,
      description: form.description,
      media: normalizedMedia.filter((m) => m.url !== ""),
      price: Number(form.price),
      maxGuests: Number(form.maxGuests),
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
      showToast(
        isEditMode
          ? "Venue updated successfully."
          : "Venue created successfully.",
        "success",
      );
      if (!isEditMode) {
        setForm(initialFormState);
        setMediaList([{ ...emptyMedia }]);
      }
      navigate(`/venues/${savedVenue.id}`);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to save venue.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="mx-auto w-full max-w-3xl px-4 py-8 text-left pb-10">
        <h1>{isEditMode ? "Edit Venue" : "Create Venue"}</h1>

        <form onSubmit={submitForm} noValidate className="mt-4 space-y-4">
          <VenueBasicsSection
            form={form}
            onChange={handleChange}
            onRatingChange={handleRatingChange}
            errors={errors}
          />
          <VenueMediaSection
            mediaList={mediaList}
            onMediaChange={handleMediaChange}
            onAddRow={addMediaRow}
            onRemoveRow={removeMediaRow}
            errors={errors.media}
          />
          <VenueLocationSection
            form={form}
            onChange={handleChange}
            errors={errors}
          />
          <VenueAmenitiesSection amenities={form} onChange={handleChange} />

          {errorMessage && (
            <p className="text-[var(--color-danger)]">{errorMessage}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !dirty}
            variant="secondary"
            size="lg"
            width="wide"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Save changes"
                : "Create venue"}
          </Button>
        </form>
      </section>
      <ConfirmModal
        open={showNavModal}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave this page?"
        confirmText="Leave Page"
        cancelText="Stay"
        onConfirm={handleNavConfirm}
        onCancel={handleNavCancel}
      />
    </>
  );
};

export default VenueForm;
