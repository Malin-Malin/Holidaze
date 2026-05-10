import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getProfileByName, updateProfile } from "../api/profileService";
import { FormField } from "../components/input/formField";
import type { ProfileData } from "../types/profile.types";

type EditProfileFormData = {
  avatarUrl: string;
  avatarAlt: string;
  bannerUrl: string;
  bannerAlt: string;
  bio: string;
  venueManager: boolean;
};

type EditProfileFieldErrors = Partial<
  Record<keyof EditProfileFormData, string>
>;

export default function EditProfilePage() {
  const { user, setUserInfo } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EditProfileFormData>({
    avatarUrl: "",
    avatarAlt: "",
    bannerUrl: "",
    bannerAlt: "",
    bio: "",
    venueManager: false,
  });
  const [errors, setErrors] = useState<EditProfileFieldErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user?.name) {
        setLoadError("You must be logged in to edit your profile.");
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getProfileByName(user.name);
        setFormData({
          avatarUrl: toHttpUrl(profile.avatar?.url),
          avatarAlt: profile.avatar?.alt ?? "",
          bannerUrl: toHttpUrl(profile.banner?.url),
          bannerAlt: profile.banner?.alt ?? "",
          bio: profile.bio ?? "",
          venueManager: profile.venueManager ?? false,
        });
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Failed to load your profile.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [user?.name]);

  function validate(): EditProfileFieldErrors {
    const next: EditProfileFieldErrors = {};

    if (formData.avatarUrl && !isValidUrl(formData.avatarUrl)) {
      next.avatarUrl = "Avatar URL must be a valid URL.";
    }

    if (formData.bannerUrl && !isValidUrl(formData.bannerUrl)) {
      next.bannerUrl = "Banner URL must be a valid URL.";
    }

    return next;
  }

  function isValidUrl(value: string) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  function toHttpUrl(value: string | undefined | null): string {
    if (!value) return "";
    return value.startsWith("http://") || value.startsWith("https://")
      ? value
      : "";
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");

    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    if (!user?.name) return;

    const payload: ProfileData = {
      avatar: {
        url: formData.avatarUrl,
        alt: formData.avatarAlt,
      },
      banner: {
        url: formData.bannerUrl,
        alt: formData.bannerAlt,
      },
      bio: formData.bio,
      venueManager: formData.venueManager,
    };

    try {
      setIsSubmitting(true);
      const updatedProfile = await updateProfile(user.name, payload);
      setUserInfo(updatedProfile);
      navigate("/profile");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to update your profile. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p className="px-4 py-6 text-[var(--text)]">Loading profile...</p>;
  }

  if (loadError) {
    return <p className="px-4 py-6 text-red-700">{loadError}</p>;
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <h1>Edit Profile</h1>

      <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-6">
        <fieldset disabled={isSubmitting} className="space-y-6">
          <section>
            <h2>Avatar</h2>
            <div className="space-y-4">
              <FormField
                label="Avatar URL"
                htmlFor="avatarUrl"
                error={errors.avatarUrl}
              >
                <input
                  id="avatarUrl"
                  name="avatarUrl"
                  type="url"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  aria-invalid={!!errors.avatarUrl}
                  className="form-input"
                />
              </FormField>
              <FormField
                label="Avatar alt text"
                htmlFor="avatarAlt"
                error={errors.avatarAlt}
              >
                <input
                  id="avatarAlt"
                  name="avatarAlt"
                  type="text"
                  value={formData.avatarAlt}
                  onChange={handleChange}
                  placeholder="A short description of the image"
                  className="form-input"
                />
              </FormField>
            </div>
          </section>

          <section>
            <h2>Banner</h2>
            <div className="space-y-4">
              <FormField
                label="Banner URL"
                htmlFor="bannerUrl"
                error={errors.bannerUrl}
              >
                <input
                  id="bannerUrl"
                  name="bannerUrl"
                  type="url"
                  value={formData.bannerUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/banner.jpg"
                  aria-invalid={!!errors.bannerUrl}
                  className="form-input"
                />
              </FormField>
              <FormField
                label="Banner alt text"
                htmlFor="bannerAlt"
                error={errors.bannerAlt}
              >
                <input
                  id="bannerAlt"
                  name="bannerAlt"
                  type="text"
                  value={formData.bannerAlt}
                  onChange={handleChange}
                  placeholder="A short description of the banner"
                  className="form-input"
                />
              </FormField>
            </div>
          </section>

          <FormField label="Bio" htmlFor="bio" error={errors.bio}>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell others a bit about yourself"
              className="form-input resize-none"
            />
          </FormField>

          <div className="flex items-center gap-3">
            <input
              id="venueManager"
              name="venueManager"
              type="checkbox"
              checked={formData.venueManager}
              onChange={handleChange}
              className="amenity-checkbox"
            />
            <label
              htmlFor="venueManager"
              className="text-sm text-[var(--text-h)]"
            >
              Register as venue manager
            </label>
          </div>
        </fieldset>

        {submitError && (
          <p role="alert" className="text-sm text-[var(--color-danger)]">
            {submitError}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-[var(--color-honey)] px-6 py-2 font-medium text-[var(--color-ink)] transition hover:brightness-95 dark:bg-[var(--color-honey)] dark:text-[var(--color-ink)] dark:hover:brightness-95 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="rounded border border-red-700 px-6 py-2 text-red-700 transition hover:bg-red-700 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
