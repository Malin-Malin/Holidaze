import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { VenueCard } from "../components/venue/card";
import { Pagination } from "../components/ui/pagination";
import { VenueSearchControls } from "../components/ui/search/venueSearchControls";
import { useVenues } from "../hooks/useVenues";

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
      {venues.length === 0 && <p className="p-6 text-left">No venues found.</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        goToPage={goToPage}
      />
    </section>
  );
}
