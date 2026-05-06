import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Profile } from "../types/profile.types";
import {
  getProfileByName,
  getVenuesByProfileName,
} from "../api/profileService";
import { useAuth } from "../hooks/useAuth";
import { Banner } from "../components/layout/banner";
import OverviewVenue from "../components/profile/overviewVenue";
import OverviewBooking from "../components/profile/overviewBooking";
import placeholderProfileAvatar from "../assets/placeholderProfileAvatar.jpg";
import placeholderProfileBanner from "../assets/placeholderProfileBanner.jpg";
import type { Booking, Venue } from "../types/venue.types";
import OverviewManagedBookings from "../components/profile/overviewManagedBookings";

type ManagedBookingCardData = Pick<
  Booking,
  "id" | "dateFrom" | "dateTo" | "guests" | "venue" | "customer"
>;

function extractUpcomingManagedBookings(
  managedVenues: Venue[],
): ManagedBookingCardData[] {
  const now = new Date();

  return managedVenues
    .flatMap((venue) =>
      (venue.bookings ?? [])
        .filter((booking) => new Date(booking.dateTo) >= now)
        .map((booking, index) => ({
          id:
            booking.id ||
            `${venue.id}-${booking.dateFrom}-${booking.dateTo}-${index}`,
          dateFrom: booking.dateFrom,
          dateTo: booking.dateTo,
          guests: booking.guests,
          customer: booking.customer,
          venue,
        })),
    )
    .sort(
      (first, second) =>
        new Date(first.dateFrom).getTime() -
        new Date(second.dateFrom).getTime(),
    );
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [managedUpcomingBookings, setManagedUpcomingBookings] = useState<
    ManagedBookingCardData[]
  >([]);

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
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={profile.avatar?.url ?? placeholderProfileAvatar}
            alt={profile.avatar?.alt ?? "placeholder profile image"}
            className="w-16 h-16 rounded-full"
          />
          <h2 className="text-2xl font-[var(--font-display)] text-[var(--color-ink)] p-2">
            {profile.name}
          </h2>
        </div>
        <Link
          to="/profile/edit"
          className="rounded border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-h)] hover:border-[var(--color-honey)] hover:text-[var(--color-honey)] transition-colors"
        >
          Edit profile
        </Link>
      </div>
      <p>{profile.bio}</p>
      {profile.venueManager && (
        <OverviewVenue
          venues={profile.venues ?? []}
          canCreateVenue={Boolean(profile.venueManager)}
        />
      )}
      {profile.venueManager && (
        <OverviewManagedBookings bookings={managedUpcomingBookings} />
      )}
      <OverviewBooking bookings={profile.bookings ?? []} />
      <div className="flex justify-center py-6">
        <button
          type="button"
          onClick={logout}
          className="rounded border border-red-700 px-3 py-1 text-xl text-red-700 hover:bg-red-700 hover:text-white"
        >
          Logout
        </button>
      </div>
    </section>
  );
}
