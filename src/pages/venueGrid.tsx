import { VenueCard } from "../components/venue/card";
import { useVenues } from "../hooks/useVenues";

export default function VenuesGrid() {
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
  } = useVenues();

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
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={goToPreviousPage}
          disabled={isFirstPage}
          className="rounded border border-[var(--color-ink)] px-4 py-2 text-sm text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <p className="text-sm text-[var(--text-h)]">
          Page {currentPage} of {pageCount}
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
