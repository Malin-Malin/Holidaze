import { useEffect, useState } from "react";
import type { Profile } from "../types/profile.types";
import { getProfileByName } from "../api/profileService";
import { useAuth } from "../hooks/useAuth";
import { Banner } from "../components/layout/banner";
import OverviewVenue from "../components/profile/overviewVenue";
import placeholderProfileAvatar from "../assets/placeholderProfileAvatar.jpg";
import placeholderProfileBanner from "../assets/placeholderProfileBanner.jpg";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user?.name) return;
    getProfileByName(user.name).then(setProfile).catch(console.error);
  }, [user?.name]);

  if (!profile) return <p>Loading...</p>;

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
    </section>
  );
}
