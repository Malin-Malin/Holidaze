import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Banner from "../components/layout/banner";
import Breadcrumb from "../components/layout/breadcrumb";
import OverviewVenue from "../components/profile/overviewVenue";
import OverviewBooking from "../components/profile/overviewBooking";
import OverviewManagedBookings from "../components/profile/overviewManagedBookings";
import { ProfilePageSkeleton } from "../components/loading/pageSkeletons";

import type { Profile } from "../types/profile.types";
import type { Booking, Venue } from "../types/venue.types";
import { useAuth } from "../hooks/useAuth";
import {
  getProfileByName,
  getVenuesByProfileName,
} from "../api/profileService";

import placeholderProfileAvatar from "../assets/placeholderProfileAvatar.jpg";
import placeholderProfileBanner from "../assets/placeholderProfileBanner.jpg";
import ButtonLink from "../components/ui/ButtonLink";

function extractUpcomingManagedBookings(managedVenues: Venue[]): Booking[] {
  const now = new Date();

  return managedVenues
    .flatMap((venue) =>
      (venue.bookings ?? [])
        .filter((booking) => new Date(booking.dateTo) >= now)
        .map((booking) => ({
          id: booking.id,
          dateFrom: booking.dateFrom,
          dateTo: booking.dateTo,
          guests: booking.guests,
          venue: venue,
          customer: booking.customer,
          created: booking.created,
          updated: booking.updated,
        })),
    )
    .sort(
      (first, second) =>
        new Date(first.dateFrom).getTime() -
        new Date(second.dateFrom).getTime(),
    );
}

const ProfilePage = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [resolvedBannerSrc, setResolvedBannerSrc] = useState(
    placeholderProfileBanner,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [managedUpcomingBookings, setManagedUpcomingBookings] = useState<
    Booking[]
  >([]);

  useEffect(() => {
    const bannerUrl = profile?.banner?.url?.trim();

    if (!bannerUrl) {
      setResolvedBannerSrc(placeholderProfileBanner);
      return;
    }

    let isCancelled = false;
    const image = new Image();

    image.onload = () => {
      if (!isCancelled) {
        setResolvedBannerSrc(bannerUrl);
      }
    };

    image.onerror = () => {
      if (!isCancelled) {
        setResolvedBannerSrc(placeholderProfileBanner);
      }
    };

    image.src = bannerUrl;

    return () => {
      isCancelled = true;
    };
  }, [profile?.banner?.url]);

  useEffect(() => {
    const state = location.state as { toastMessage?: string } | null;
    const message = state?.toastMessage?.trim();
    if (message) {
      setToastMessage(message);
    }
  }, [location.state]);

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

        if (profileData.venueManager) {
          const managedVenues = await getVenuesByProfileName(user.name, true);
          setManagedUpcomingBookings(
            extractUpcomingManagedBookings(managedVenues),
          );
        } else {
          setManagedUpcomingBookings([]);
        }
      } catch (error) {
        setProfile(null);
        setManagedUpcomingBookings([]);
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
    return <ProfilePageSkeleton />;
  }

  if (errorMessage) {
    return <p className="px-4 py-6 text-red-700">{errorMessage}</p>;
  }

  if (!profile) {
    return <p className="px-4 py-6 text-[var(--text)]">Profile not found.</p>;
  }

  const bannerSrc = resolvedBannerSrc;
  const bannerAlt = profile.banner?.alt || "placeholder profile banner";

  return (
    <>
      <Banner
        imageUrl={bannerSrc}
        imageAlt={bannerAlt}
        ariaLabel="Profile banner"
      >
        <div className="text-right">
          <h1 className="banner-title-contrast text-3xl font-[var(--font-display)]">
            My Profile
          </h1>
        </div>
      </Banner>
      <Breadcrumb />
      {toastMessage && (
        <div className="mx-auto mt-2 flex w-full max-w-6xl items-center justify-between gap-3 rounded-md border border-[var(--color-honey)]/50 bg-[var(--color-honey)]/15 px-4 py-2 text-sm text-[var(--color-ink)] dark:text-[var(--color-honey)]">
          <p>{toastMessage}</p>
          <button
            type="button"
            onClick={() => setToastMessage("")}
            className="rounded border border-[var(--color-honey)]/40 px-2 py-0.5 text-xs hover:bg-[var(--color-honey)]/20"
          >
            Dismiss
          </button>
        </div>
      )}
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={profile.avatar?.url ?? placeholderProfileAvatar}
            alt={profile.avatar?.alt ?? "placeholder profile image"}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = placeholderProfileAvatar;
            }}
            className="w-16 h-16 rounded-full"
          />
          <div className="flex min-w-0 flex-col items-start gap-1 p-2">
            <h2 className="break-words text-2xl font-[var(--font-display)] text-[var(--color-ink)]">
              {profile.name}
            </h2>
            {profile.venueManager && (
              <span className="rounded-md border border-[var(--color-honey)]/60 bg-[var(--color-honey)]/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)] dark:text-[var(--color-honey)]">
                Venue Manager
              </span>
            )}
          </div>
        </div>
        <Link
          to="/profile/edit"
          className="self-end rounded border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-h)] transition-colors hover:border-[var(--color-honey)] hover:text-[var(--color-honey)] sm:self-auto"
        >
          Edit profile
        </Link>
      </div>
      <p>{profile.bio}</p>
      {profile.venueManager && (
        <>
          <OverviewVenue venues={profile.venues ?? []} isLoading={isLoading} />
          <div className="mt-6 flex justify-center px-4">
            <ButtonLink
              to="/venues/new"
              variant="primary"
              size="lg"
              className="w-full max-w-md"
            >
              Create venue
            </ButtonLink>
          </div>
        </>
      )}
      {profile.venueManager && (
        <OverviewManagedBookings
          bookings={managedUpcomingBookings}
          isLoading={isLoading}
        />
      )}
      <OverviewBooking
        bookings={profile.bookings ?? []}
        isLoading={isLoading}
      />
      <div className="flex justify-center py-6">
        <button
          type="button"
          onClick={logout}
          className="rounded border border-red-700 px-3 py-1 text-xl text-red-700 hover:bg-red-700 hover:text-white"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default ProfilePage;
