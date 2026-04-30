import { useEffect, useMemo, useState } from "react";
import { getVenues, type PaginationMeta } from "../api/venueService";
import type { Venue } from "../types/venue.types";

type UseVenuesFilters = {
  query?: string;
  minRating?: number;
  pets?: boolean;
  parking?: boolean;
  wifi?: boolean;
  breakfast?: boolean;
};

type UseVenuesResult = {
  venues: Venue[];
  isLoading: boolean;
  errorMessage: string | null;
  currentPage: number;
  pageCount: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToPage: (page: number) => void;
};

export function useVenues(
  initialPage = 1,
  filters: UseVenuesFilters = {},
): UseVenuesResult {
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pageSize = 12;

  const {
    query = "",
    minRating = 0,
    pets = false,
    parking = false,
    wifi = false,
    breakfast = false,
  } = filters;

  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    async function loadAllVenues() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const limit = 100;
        let page = 1;
        let nextPage: number | null | undefined = 1;
        const collected: Venue[] = [];

        while (nextPage) {
          const response = await getVenues(page, limit);
          collected.push(...response.data);

          const meta = (response.meta ?? {}) as PaginationMeta;
          nextPage = meta.nextPage ?? null;
          page = nextPage ?? page;

          if (response.data.length === 0 || !nextPage) {
            break;
          }
        }

        setAllVenues(collected.sort((a, b) => a.name.localeCompare(b.name)));
      } catch {
        setErrorMessage("Could not load venues right now.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadAllVenues();
  }, []);

  const filteredVenues = useMemo(() => {
    return allVenues.filter((venue) => {
      const searchable = [
        venue.name,
        venue.location.city,
        venue.location.country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesRating = venue.rating >= minRating;
      const matchesPets = !pets || venue.meta.pets;
      const matchesParking = !parking || venue.meta.parking;
      const matchesWifi = !wifi || venue.meta.wifi;
      const matchesBreakfast = !breakfast || venue.meta.breakfast;

      return (
        matchesQuery &&
        matchesRating &&
        matchesPets &&
        matchesParking &&
        matchesWifi &&
        matchesBreakfast
      );
    });
  }, [allVenues, normalizedQuery, minRating, pets, parking, wifi, breakfast]);

  const pageCount = Math.max(1, Math.ceil(filteredVenues.length / pageSize));

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount]);

  const start = (currentPage - 1) * pageSize;
  const venues = filteredVenues.slice(start, start + pageSize);

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= pageCount;

  const goToPreviousPage = () => {
    if (isFirstPage) return;
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    if (isLastPage) return;
    setCurrentPage((prev) => Math.min(pageCount, prev + 1));
  };

  const goToPage = (page: number) => {
    if (!Number.isFinite(page)) return;
    const safePage = Math.min(pageCount, Math.max(1, Math.floor(page)));
    setCurrentPage(safePage);
  };

  return {
    venues,
    isLoading,
    errorMessage,
    currentPage,
    pageCount,
    isFirstPage,
    isLastPage,
    goToPreviousPage,
    goToNextPage,
    goToPage,
  };
}
