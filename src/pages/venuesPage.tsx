import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Pagination from "../components/ui/Pagination";
import VenueSearchControls from "../components/ui/search/VenueSearchControls";
import Banner from "../components/layout/Banner";
import VenueGrid from "../components/venue/VenueGrid";
import SortControls from "../components/ui/search/SortControls";
import type {
  SortField,
  SortOrder,
} from "../components/ui/search/SortControls";

import { useVenues } from "../hooks/useVenues";

const VenuesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const parsedPage = Number(searchParams.get("page"));
  const initialPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const query = searchParams.get("q") ?? "";
  const sortField = (searchParams.get("sort") as SortField) || "name";
  const sortOrder = (searchParams.get("order") as SortOrder) || "asc";

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
    orderBy: sortField,
    orderDirection: sortOrder,
  });

  function updateSearchParam(key: string, value: string | boolean | number) {
    const nextParams = new URLSearchParams(searchParams);

    if (value === "" || value === false || value === 0) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, String(value));
    }
    // Reset to page 1 when changing filters/sort
    if (key !== "page") {
      nextParams.set("page", "1");
    }
    setSearchParams(nextParams, { replace: true });
  }

  useEffect(() => {
    const currentUrlPage = searchParams.get("page");
    if (currentUrlPage !== String(currentPage)) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("page", String(currentPage));
      setSearchParams(nextParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const metaDescription =
    "Browse all venues available on Holidaze. Find your perfect stay and book instantly.";

  return (
    <>
      <title>Holidaze | Venues</title>
      <meta name="description" content={metaDescription} />
      <Banner />
      <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <h1 className="mb-6 text-3xl font-display text-[var(--text-h)] dark:text-white md:text-4xl">
          Venues
        </h1>

        <div className="flex flex-col gap-2 mb-4 md:flex-row md:items-center md:gap-6">
          <div className="w-full md:flex-1 min-w-0">
            <VenueSearchControls
              query={query}
              onQueryChange={(value) => updateSearchParam("q", value)}
            />
          </div>
          <div className="w-full md:w-auto">
            <SortControls
              sortField={sortField}
              sortOrder={sortOrder}
              onSortFieldChange={(field) => updateSearchParam("sort", field)}
              onSortOrderChange={(order) => updateSearchParam("order", order)}
            />
          </div>
        </div>

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
