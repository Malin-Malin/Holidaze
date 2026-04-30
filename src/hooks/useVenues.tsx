import { useEffect, useState } from "react";
import { getVenues, type PaginationMeta } from "../api/venueService";
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

export function useVenues(): UseVenuesResult {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({});
  const pageSize = 12;

  useEffect(() => {
    async function loadVenues() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const response = await getVenues(currentPage, pageSize);
        setVenues(
          [...response.data].sort((a, b) => a.name.localeCompare(b.name)),
        );
        setMeta(response.meta ?? {});
      } catch {
        setErrorMessage("Could not load venues right now.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadVenues();
  }, [currentPage]);

  const pageCount = meta.pageCount ?? 1;
  const isFirstPage = meta.isFirstPage ?? currentPage <= 1;
  const isLastPage = meta.isLastPage ?? currentPage >= pageCount;

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
