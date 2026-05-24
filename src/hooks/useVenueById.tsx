import { useEffect, useState } from "react";
import { getVenueById } from "../api/venueService";
import type { Venue } from "../types/venue.types";

type UseVenueByIdResult = {
  venue: Venue | null;
  isLoading: boolean;
  errorMessage: string | null;
  refresh: () => Promise<void>;
};

/**
 * Custom hook to fetch and manage a single venue by its ID.
 * @param {string | undefined} id - The ID of the venue to fetch.
 * @returns {UseVenueByIdResult} Venue data, loading state, error message, and refresh function.
 */
export function useVenueById(id: string | undefined): UseVenueByIdResult {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadVenue = async (venueId: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await getVenueById(venueId);
      setVenue(data);
    } catch {
      setErrorMessage("Could not load venue.");
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    if (id) {
      await loadVenue(id);
    }
  };

  useEffect(() => {
    if (!id) {
      setErrorMessage("No venue ID provided.");
      setIsLoading(false);
      return;
    }

    void loadVenue(id);
  }, [id]);

  return { venue, isLoading, errorMessage, refresh };
}
