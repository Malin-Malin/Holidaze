import { useEffect, useState } from "react";
import { getVenueById } from "../api/venueService";
import type { Venue } from "../types/venue.types";

type UseVenueByIdResult = {
  venue: Venue | null;
  isLoading: boolean;
  errorMessage: string | null;
};

export function useVenueById(id: string | undefined): UseVenueByIdResult {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setErrorMessage("No venue ID provided.");
      setIsLoading(false);
      return;
    }

    async function loadVenue() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const data = await getVenueById(id!);
        setVenue(data);
      } catch {
        setErrorMessage("Could not load venue.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadVenue();
  }, [id]);

  return { venue, isLoading, errorMessage };
}
