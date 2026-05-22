import { useEffect, useState } from "react";

import type { Profile } from "../types/profile.types";
import type { Booking, Venue } from "../types/venue.types";
import {
  getProfileByName,
  getVenuesByProfileName,
} from "../api/profileService";

type UseProfileDataResult = {
  profile: Profile | null;
  managedUpcomingBookings: Booking[];
  isLoading: boolean;
  errorMessage: string;
  refresh: () => Promise<void>;
};

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

export function useProfileData(
  userName: string | undefined,
): UseProfileDataResult {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [managedUpcomingBookings, setManagedUpcomingBookings] = useState<
    Booking[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadProfile = async (name: string) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const profileData = await getProfileByName(name);
      setProfile(profileData);

      if (profileData.venueManager) {
        const managedVenues = await getVenuesByProfileName(name, true);
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
        error instanceof Error ? error.message : "Failed to load your profile.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    if (!userName) return;
    await loadProfile(userName);
  };

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      if (!userName) {
        if (!isCancelled) {
          setErrorMessage("Please log in to view your profile.");
          setProfile(null);
          setManagedUpcomingBookings([]);
          setIsLoading(false);
        }
        return;
      }

      if (!isCancelled) {
        setIsLoading(true);
        setErrorMessage("");
      }

      try {
        const profileData = await getProfileByName(userName);
        if (isCancelled) return;
        setProfile(profileData);

        if (profileData.venueManager) {
          const managedVenues = await getVenuesByProfileName(userName, true);
          if (isCancelled) return;
          setManagedUpcomingBookings(
            extractUpcomingManagedBookings(managedVenues),
          );
        } else {
          setManagedUpcomingBookings([]);
        }
      } catch (error) {
        if (isCancelled) return;
        setProfile(null);
        setManagedUpcomingBookings([]);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load your profile.",
        );
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isCancelled = true;
    };
  }, [userName]);

  return {
    profile,
    managedUpcomingBookings,
    isLoading,
    errorMessage,
    refresh,
  };
}
