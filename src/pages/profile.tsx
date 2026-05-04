import { useEffect, useState } from "react";
import type { Profile } from "../types/profile.types";
import { getProfileByName } from "../api/profileService";
import { useAuth } from "../hooks/useAuth";
import { Banner } from "../components/layout/banner";
import OverviewVenue from "../components/profile/overviewVenue";
import OverviewBooking from "../components/profile/overviewBooking";
import placeholderProfileAvatar from "../assets/placeholderProfileAvatar.jpg";
import placeholderProfileBanner from "../assets/placeholderProfileBanner.jpg";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user?.name) {
        setErrorMessage("Please log in to view your profile.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");
        const profileData = await getProfileByName(user.name);
        setProfile(profileData);
      } catch (error) {
        setProfile(null);
        setErrorMessage(
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

  if (isLoading) {
    return <p className="px-4 py-6 text-[var(--text)]">Loading profile...</p>;
  }

  if (errorMessage) {
    return <p className="px-4 py-6 text-red-700">{errorMessage}</p>;
  }

  if (!profile) {
    return <p className="px-4 py-6 text-[var(--text)]">Profile not found.</p>;
  }

  const bannerSrc =
    profile.banner?.url && profile.banner.url.trim() !== ""
      ? profile.banner.url
      : placeholderProfileBanner;
  const bannerAlt = profile.banner?.alt || "placeholder profile banner";

  return (
    <section>
      <Banner
        imageUrl={bannerSrc}
        imageAlt={bannerAlt}
        ariaLabel="Profile banner"
      >
        <div className="text-right text-[var(--color-honey)]">
          <h1 className="text-3xl font-[var(--font-display)]">My Profile</h1>
        </div>
      </Banner>
      <div className="flex items-center p-4">
        <img
          src={profile.avatar?.url ?? placeholderProfileAvatar}
          alt={profile.avatar?.alt ?? "placeholder profile image"}
          className="w-16 h-16 rounded-full"
        />
        <h2 className="ml-4 text-2xl font-[var(--font-display)] text-[var(--color-ink)] p-2">
          {profile.name}
        </h2>
      </div>
      <p>{profile.bio}</p>
      <OverviewVenue venues={profile.venues ?? []} />
      <OverviewBooking bookings={profile.bookings ?? []} />
    </section>
  );
}
