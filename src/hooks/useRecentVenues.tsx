import { useEffect, useState } from "react";
import { getVenues } from "../api/venueService";
import type { Venue } from "../types/venue.types";

type UseRecentVenuesResult = {
  venues: Venue[];
  isLoading: boolean;
};

export function useRecentVenues(
  count = 3,
  sortBy: string = "created",
  sortOrder: "asc" | "desc" = "desc",
): UseRecentVenuesResult {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        const response = await getVenues(1, count, false, sortBy, sortOrder);
        if (!isCancelled) {
          setVenues(response.data);
        }
      } catch {
        if (!isCancelled) {
          setVenues([]);
        }
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
  }, [count, sortBy, sortOrder]);

  return { venues, isLoading };
}
