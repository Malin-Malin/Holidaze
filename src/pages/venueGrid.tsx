import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { VenueCard } from "../components/venue/card";
import { Pagination } from "../components/ui/pagination";
import { VenueSearchControls } from "../components/ui/search/venueSearchControls";
import { useVenues } from "../hooks/useVenues";

const skeletonCards = Array.from({ length: 12 }, (_, index) => index);

export default function VenuesGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parsedPage = Number(searchParams.get("page"));
  const initialPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const query = searchParams.get("q") ?? "";
  const minRating = Number(searchParams.get("rating") ?? "0") || 0;
  const pets = searchParams.get("pets") === "true";
  const parking = searchParams.get("parking") === "true";
  const wifi = searchParams.get("wifi") === "true";
  const breakfast = searchParams.get("breakfast") === "true";

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
  } = useVenues(initialPage, {
    query,
    minRating,
    pets,
    parking,
    wifi,
    breakfast,
  });

  function updateSearchParam(key: string, value: string | boolean | number) {
    const nextParams = new URLSearchParams(searchParams);

    if (value === "" || value === false || value === 0) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, String(value));
    }
    setSearchParams(nextParams, { replace: true });
  }

  useEffect(() => {
    const currentUrlPage = searchParams.get("page");
    if (currentUrlPage === String(currentPage)) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(currentPage));
    setSearchParams(nextParams, { replace: true });
  }, [currentPage, searchParams, setSearchParams]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <VenueSearchControls
        query={query}
        minRating={minRating}
        pets={pets}
        parking={parking}
        wifi={wifi}
        breakfast={breakfast}
        onQueryChange={(value) => updateSearchParam("q", value)}
        onMinRatingChange={(value) => updateSearchParam("rating", value)}
        onPetsChange={(value) => updateSearchParam("pets", value)}
        onParkingChange={(value) => updateSearchParam("parking", value)}
        onWifiChange={(value) => updateSearchParam("wifi", value)}
        onBreakfastChange={(value) => updateSearchParam("breakfast", value)}
      />

      {errorMessage && (
        <p className="px-2 pb-4 text-left text-red-700">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && venues.length === 0 && (
        <p className="p-6 text-left">No venues found.</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        {isLoading &&
          skeletonCards.map((skeletonIndex) => (
            <div
              key={`venue-skeleton-${skeletonIndex}`}
              className="card-gradient-border mx-auto my-1 flex h-full w-full max-w-sm flex-col overflow-hidden"
              aria-hidden="true"
            >
              <div className="h-52 w-full animate-pulse bg-[var(--border)] md:h-56" />
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--border)]" />
                <div className="h-6 w-3/4 animate-pulse rounded bg-[var(--border)]" />
                <div className="h-4 w-full animate-pulse rounded bg-[var(--border)]" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-[var(--border)]" />
                <div className="mt-auto h-5 w-1/3 animate-pulse rounded bg-[var(--border)]" />
              </div>
            </div>
          ))}

        {!isLoading &&
          !errorMessage &&
          venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
      </div>

      {!isLoading && !errorMessage && (
        <Pagination
          currentPage={currentPage}
          pageCount={pageCount}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          goToPage={goToPage}
        />
      )}
    </section>
  );
}
