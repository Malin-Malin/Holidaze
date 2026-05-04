import { useEffect, useState } from "react";

type PaginationProps = {
  currentPage: number;
  pageCount: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToPage: (page: number) => void;
};

export function Pagination({
  currentPage,
  pageCount,
  isFirstPage,
  isLastPage,
  goToPreviousPage,
  goToNextPage,
  goToPage,
}: PaginationProps) {
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
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={goToPreviousPage}
        disabled={isFirstPage}
        className="rounded border border-[var(--color-ink)] px-4 py-2 text-sm text-[var(--color-ink)] transition-colors duration-200 enabled:hover:bg-[var(--color-ink)] enabled:hover:text-[var(--color-honey)] disabled:cursor-not-allowed disabled:opacity-40"
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
      {!isLastPage && (
        <button
          type="button"
          onClick={handleNextPage}
          className="rounded border border-[var(--color-ink)] px-4 py-2 text-sm text-[var(--color-ink)] transition-colors duration-200 hover:bg-[var(--color-ink)] hover:text-[var(--color-honey)]"
        >
          Next
        </button>
      )}
    </div>
  );
}
