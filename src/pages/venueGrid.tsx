import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { VenueCard } from "../components/venue/card";
import { useVenues } from "../hooks/useVenues";

export default function VenuesGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parsedPage = Number(searchParams.get("page"));
  const initialPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const {
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
  } = useVenues(initialPage);
  const [pageInput, setPageInput] = useState(String(currentPage));

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  useEffect(() => {
    const currentUrlPage = searchParams.get("page");
    if (currentUrlPage === String(currentPage)) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(currentPage));
    setSearchParams(nextParams, { replace: true });
  }, [currentPage, searchParams, setSearchParams]);

  function handleGoToPage() {
    const parsedPage = Number(pageInput);
    if (!Number.isFinite(parsedPage)) {
      setPageInput(String(currentPage));
      return;
    }
    goToPage(parsedPage);
  }

  if (isLoading) {
    return (
      <p className="mx-auto w-full max-w-6xl px-4 py-10 text-left">
        Loading venues...
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p className="mx-auto w-full max-w-6xl px-4 py-10 text-left text-red-700">
        {errorMessage}
      </p>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
      {venues.length === 0 && <p className="p-6 text-left">No venues found.</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={goToPreviousPage}
          disabled={isFirstPage}
          className="rounded border border-[var(--color-ink)] px-4 py-2 text-sm text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <p className="flex items-center gap-2 text-sm text-[var(--text-h)]">
          <span>Page</span>
          <input
            aria-label="Current page"
            type="number"
            min={1}
            max={pageCount}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onBlur={handleGoToPage}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGoToPage();
              }
            }}
            className="w-16 rounded border border-[var(--border)] px-2 py-1 text-center text-sm"
          />
          <span>of {pageCount}</span>
        </p>
        <button
          type="button"
          onClick={goToNextPage}
          disabled={isLastPage}
          className="rounded border border-[var(--color-ink)] px-4 py-2 text-sm text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  );
}
