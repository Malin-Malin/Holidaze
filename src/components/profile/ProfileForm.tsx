import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type React from "react";

import FormField from "../input/FormField";

import { updateProfile } from "../../api/profileService";
import { useAuth } from "../../hooks/useAuth";
import type { Profile, ProfileData } from "../../types/profile.types";
import { isValidHttpUrl, toHttpUrl } from "../../utils/url";

type ProfileFormData = {
  avatarUrl: string;
  avatarAlt: string;
  bannerUrl: string;
  bannerAlt: string;
  bio: string;
  venueManager: boolean;
};

type ProfileFieldErrors = Partial<Record<keyof ProfileFormData, string>>;

type ProfileFormProps = {
  initialProfile: Partial<Profile>;
};

const ProfileForm = ({ initialProfile }: ProfileFormProps) => {
  const { user, setUserInfo } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProfileFormData>({
    avatarUrl: toHttpUrl(initialProfile.avatar?.url),
    avatarAlt: initialProfile.avatar?.alt ?? "",
    bannerUrl: toHttpUrl(initialProfile.banner?.url),
    bannerAlt: initialProfile.banner?.alt ?? "",
    bio: initialProfile.bio ?? "",
    venueManager: initialProfile.venueManager ?? false,
  });
  const [errors, setErrors] = useState<ProfileFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function validate(): ProfileFieldErrors {
    const next: ProfileFieldErrors = {};
    if (formData.avatarUrl && !isValidHttpUrl(formData.avatarUrl))
      next.avatarUrl = "Avatar URL must be a valid URL.";
    if (formData.bannerUrl && !isValidHttpUrl(formData.bannerUrl))
      next.bannerUrl = "Banner URL must be a valid URL.";
    return next;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    if (!user?.name) return;
    const payload: ProfileData = {
      avatar: { url: formData.avatarUrl, alt: formData.avatarAlt },
      banner: { url: formData.bannerUrl, alt: formData.bannerAlt },
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
  };

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
};

export default ProfileForm;
