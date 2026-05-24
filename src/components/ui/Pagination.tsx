import { useEffect, useState } from "react";

import Button from "./Button";

type PaginationProps = {
  currentPage: number;
  pageCount: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToPage: (page: number) => void;
};

/**
 * Pagination component for navigating paginated data sets.
 * @param {PaginationProps} props
 * @param {number} props.currentPage - The current page number.
 * @param {number} props.pageCount - Total number of pages.
 * @param {boolean} props.isFirstPage - If the current page is the first.
 * @param {boolean} props.isLastPage - If the current page is the last.
 * @param {() => void} props.goToPreviousPage - Handler for previous page.
 * @param {() => void} props.goToNextPage - Handler for next page.
 * @param {(page: number) => void} props.goToPage - Handler for direct page navigation.
 * @returns {JSX.Element}
 */
const Pagination = ({
  currentPage,
  pageCount,
  isFirstPage,
  isLastPage,
  goToPreviousPage,
  goToNextPage,
  goToPage,
}: PaginationProps) => {
  const [pageInput, setPageInput] = useState(String(currentPage));

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  function handleGoToPage() {
    const parsedPage = Number(pageInput);
    if (!Number.isFinite(parsedPage)) {
      setPageInput(String(currentPage));
      return;
    }
    goToPage(parsedPage);
  }

  function handleNextPage() {
    goToNextPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="mt-8 flex flex-col md:flex-row items-center w-full gap-2 md:gap-0">
      {/* Left spacer for centering on md+ */}
      <div className="hidden md:block flex-1" />
      {/* Centered Previous/Next/Page Info */}
      <div className="flex items-center justify-center gap-3 w-full md:w-auto">
        <Button
          type="button"
          onClick={goToPreviousPage}
          disabled={isFirstPage}
          variant="outline"
          size="md"
          className="px-4"
        >
          Previous
        </Button>
        <p className="flex items-center gap-2 text-sm text-[var(--text-h)]">
          <span>
            Page {currentPage} of {pageCount}
          </span>
        </p>
        {!isLastPage && (
          <Button
            type="button"
            onClick={handleNextPage}
            variant="outline"
            size="md"
            className="px-4"
          >
            Next
          </Button>
        )}
      </div>
      {/* Right-aligned Go To Page Controls */}
      <div className="flex items-center gap-2 justify-center md:justify-end w-full md:w-auto flex-1 mt-2 md:mt-0">
        <span>Go to page</span>
        <input
          aria-label="Go to page"
          type="number"
          min={1}
          max={pageCount}
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleGoToPage();
            }
          }}
          className="w-16 rounded border border-[var(--border)] px-2 py-1 text-center text-sm"
        />
        <Button
          type="button"
          onClick={handleGoToPage}
          variant="outline"
          size="md"
          className="px-4"
        >
          Go
        </Button>
      </div>
    </section>
  );
};

export default Pagination;
