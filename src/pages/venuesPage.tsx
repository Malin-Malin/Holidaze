import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "../components/ui/pagination";
import { VenueSearchControls } from "../components/ui/search/venueSearchControls";
import { useVenues } from "../hooks/useVenues";
import Banner from "../components/layout/banner";
import VenueGrid from "../components/venue/VenueGrid";

const VenuesPage = () => {
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
    <>
      <Banner />
      <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <h1 className="mb-6 text-3xl font-[var(--font-display)] text-[var(--text-h)] dark:text-white md:text-4xl">
          Venues
        </h1>
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

        <VenueGrid
          venues={venues}
          isLoading={isLoading}
          errorMessage={errorMessage ?? ""}
        />

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
    </>
  );
};

export default VenuesPage;
