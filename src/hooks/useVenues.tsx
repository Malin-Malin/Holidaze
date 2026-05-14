import { useEffect, useState } from "react";
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
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageCount, setPageCount] = useState(1);
  const [hasResolvedPageCount, setHasResolvedPageCount] = useState(false);
  const pageSize = 12;
  const apiPageSize = 100;

  const {
    query = "",
    minRating = 0,
    pets = false,
    parking = false,
    wifi = false,
    breakfast = false,
  } = filters;

  const normalizedQuery = query.trim().toLowerCase();
  const hasActiveFilters =
    normalizedQuery.length > 0 ||
    minRating > 0 ||
    pets ||
    parking ||
    wifi ||
    breakfast;

  useEffect(() => {
    if (!Number.isFinite(initialPage) || initialPage < 1) return;
    setCurrentPage(Math.floor(initialPage));
  }, [initialPage]);

  useEffect(() => {
    let isCancelled = false;

    async function loadVenuesPage() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        setHasResolvedPageCount(false);

        if (!hasActiveFilters) {
          const response = await getVenues(currentPage, pageSize);
          const meta = (response.meta ?? {}) as PaginationMeta;
          const resolvedPageCount =
            Number.isFinite(meta.pageCount) && (meta.pageCount ?? 0) > 0
              ? Math.floor(meta.pageCount as number)
              : 1;

          if (!isCancelled) {
            setPageCount(Math.max(1, resolvedPageCount));
            setVenues(response.data);
            setHasResolvedPageCount(true);
          }

          return;
        }

        const matchedVenues: Venue[] = [];
        let page = 1;
        let nextPage: number | null | undefined = 1;

        while (nextPage) {
          const response = await getVenues(page, apiPageSize);
          matchedVenues.push(
            ...response.data.filter((venue) => {
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
            }),
          );

          const meta = (response.meta ?? {}) as PaginationMeta;
          nextPage = meta.nextPage ?? null;
          page = nextPage ?? page + 1;
        }

        const filteredPageCount = Math.max(
          1,
          Math.ceil(matchedVenues.length / pageSize),
        );
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;

        if (!isCancelled) {
          setPageCount(filteredPageCount);
          setVenues(matchedVenues.slice(start, end));
          setHasResolvedPageCount(true);
        }
      } catch {
        if (!isCancelled) {
          setVenues([]);
          setPageCount(1);
          setErrorMessage("Could not load venues right now.");
          setHasResolvedPageCount(true);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadVenuesPage();

    return () => {
      isCancelled = true;
    };
  }, [
    breakfast,
    currentPage,
    hasActiveFilters,
    minRating,
    normalizedQuery,
    parking,
    pets,
    wifi,
  ]);

  useEffect(() => {
    if (hasResolvedPageCount && currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, hasResolvedPageCount, pageCount]);

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
