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
    <section className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
    </section>
  );
};

export default Pagination;
