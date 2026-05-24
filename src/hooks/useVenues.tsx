import { useEffect, useState } from "react";
import { getVenues, searchVenues } from "../api/venueService";
import type { Venue } from "../types/venue.types";

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

type UseVenuesOptions = {
  query?: string;
  count?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  useRandomPage?: boolean;
};

/**
 * Custom hook to fetch and manage a paginated list of venues.
 * @param {number} [initialPage=1] - The initial page to load.
 * @param {Object} [options] - Options for filtering, sorting, and pagination.
 * @param {string} [options.query] - Search query for venues.
 * @param {number} [options.count] - Number of venues per page.
 * @param {string} [options.orderBy] - Field to order by.
 * @param {"asc"|"desc"} [options.orderDirection] - Order direction.
 * @param {boolean} [options.useRandomPage] - Whether to use a random page.
 * @returns {UseVenuesResult} Venue data, loading state, error message, and pagination controls.
 */
export function useVenues(
  initialPage = 1,
  options: UseVenuesOptions = {},
): UseVenuesResult {
  const {
    query = "",
    count = 12,
    orderBy = "name",
    orderDirection = "asc",
    useRandomPage = false,
  } = options;

  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageCount, setPageCount] = useState(1);
  const [hasResolvedPageCount, setHasResolvedPageCount] = useState(false);
  const pageSize = count;

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
          const firstPageResponse = await getVenues(
            currentPage,
            pageSize,
            false,
            orderBy,
            orderDirection,
          );
          const meta = firstPageResponse.meta ?? {};
          const resolvedPageCount =
            Number.isFinite(meta.pageCount) && (meta.pageCount ?? 0) > 0
              ? Math.floor(meta.pageCount as number)
              : 1;

          let response = firstPageResponse;

          if (useRandomPage && resolvedPageCount > 1) {
            const randomPage =
              Math.floor(Math.random() * resolvedPageCount) + 1;

            if (randomPage !== currentPage) {
              response = await getVenues(
                randomPage,
                pageSize,
                false,
                orderBy,
                orderDirection,
              );
            }
          }

          if (!isCancelled) {
            setPageCount(Math.max(1, resolvedPageCount));
            setVenues(response.data);
            setHasResolvedPageCount(true);
          }

          return;
        }

        const response = await searchVenues(
          searchQuery,
          currentPage,
          pageSize,
          orderBy,
          orderDirection,
        );
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
  }, [
    currentPage,
    hasSearchQuery,
    searchQuery,
    orderBy,
    orderDirection,
    pageSize,
    useRandomPage,
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
