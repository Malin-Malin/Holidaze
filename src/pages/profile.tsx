import Banner from "../components/layout/Banner";
import Breadcrumb from "../components/layout/Breadcrumb";
import ButtonLink from "../components/ui/ButtonLink";
import Button from "../components/ui/Button";
import SafeImage from "../components/ui/SafeImage";
import OverviewVenue from "../components/profile/OverviewVenue";
import OverviewBooking from "../components/profile/OverviewBooking";
import OverviewManagedBookings from "../components/profile/OverviewManagedBookings";
import { ProfilePageSkeleton } from "../components/loading/PageSkeletons";

import { useAuth } from "../hooks/useAuth";
import { useProfileData } from "../hooks/useProfileData";
import { useResolvedImageSrc } from "../hooks/useResolvedImageSrc";

import placeholderProfileAvatar from "../assets/placeholderProfileAvatar.jpg";
import placeholderProfileBanner from "../assets/placeholderProfileBanner.jpg";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { profile, managedUpcomingBookings, isLoading, errorMessage } =
    useProfileData(user?.name);
  const bannerUrl = profile?.banner?.url?.trim();
  const bannerSrc = useResolvedImageSrc({
    src: bannerUrl,
    fallbackSrc: placeholderProfileBanner,
  });

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (errorMessage) {
    return <p className="px-4 py-6 text-red-700">{errorMessage}</p>;
  }

  if (!profile) {
    return <p className="px-4 py-6 text-[var(--text)]">Profile not found.</p>;
  }

  const bannerAlt = profile.banner?.alt || "placeholder profile banner";

  return (
    <>
      <Banner
        imageUrl={bannerSrc}
        imageAlt={bannerAlt}
        ariaLabel="Profile banner"
        title="My Profile"
      />
      <Breadcrumb />
      <section className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <section className="flex min-w-0 items-center gap-3">
          <SafeImage
            src={profile.avatar?.url}
            alt={profile.avatar?.alt}
            fallbackSrc={placeholderProfileAvatar}
            fallbackAlt="placeholder profile image"
            className="w-16 h-16 rounded-full"
          />
          <div className="flex min-w-0 flex-col items-start gap-1 p-2">
            <h1 className="break-words text-2xl font-[var(--font-display)] text-[var(--color-ink)]">
              {profile.name}
            </h1>
            {profile.venueManager && (
              <span className="rounded-md border border-[var(--color-honey)]/60 bg-[var(--color-honey)]/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink)] dark:text-[var(--color-honey)]">
                Venue Manager
              </span>
            )}
          </div>
        </section>
        <ButtonLink
          to="/profile/edit"
          variant="outline"
          size="md"
          className="self-end sm:self-auto"
        >
          Edit profile
        </ButtonLink>
      </section>
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
        <Button
          type="button"
          onClick={logout}
          variant="danger"
          size="lg"
          className="text-xl"
        >
          Logout
        </Button>
      </div>
    </>
  );
};

export default ProfilePage;
