import { useEffect, useState } from "react";
import { getVenues, searchVenues } from "../api/venueService";
import type { Venue } from "../types/venue.types";

type UseVenuesFilters = {
  query?: string;
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

  const { query = "" } = filters;

  const searchQuery = query.trim();
  const hasSearchQuery = searchQuery.length > 0;

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

        if (!hasSearchQuery) {
          const response = await getVenues(currentPage, pageSize);
          const meta = response.meta ?? {};
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

        const response = await searchVenues(searchQuery, currentPage, pageSize);
        const matchedVenues = response.data;

        const filteredPageCount = Math.max(
          1,
          Math.floor(response.meta?.pageCount ?? 1),
        );

        if (!isCancelled) {
          setPageCount(filteredPageCount);
          setVenues(matchedVenues);
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
  }, [currentPage, hasSearchQuery, searchQuery]);

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
