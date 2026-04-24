import { useEffect, useState } from "react";
import { getVenues } from "../api/venueService";
import type { Venue } from "../types/venue.types";

type UseVenuesResult = {
  venues: Venue[];
  isLoading: boolean;
  errorMessage: string | null;
};

export function useVenues(): UseVenuesResult {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadVenues() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const data = await getVenues();
        setVenues([...data].sort((a, b) => a.name.localeCompare(b.name)));
      } catch {
        setErrorMessage("Could not load venues right now.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadVenues();
  }, []);

  return { venues, isLoading, errorMessage };
}
