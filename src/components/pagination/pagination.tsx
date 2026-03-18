import { forwardRef, useCallback, useMemo, type ComponentPropsWithoutRef } from "react";
import { cx } from "@styled-system/css";
import {
  paginationNavStyles,
  paginationButtonRecipe,
  paginationEllipsisStyles,
} from "./pagination.recipe";

// ── Page Range Calculation ────────────────────────────────────────────

function getPageRange(page: number, totalPages: number): (number | "ellipsis")[] {
  // Show all pages if total is small
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];

  // Always show first page
  pages.push(1);

  if (page > 3) {
    pages.push("ellipsis");
  }

  // Pages around current
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (page < totalPages - 2) {
    pages.push("ellipsis");
  }

  // Always show last page
  pages.push(totalPages);

  return pages;
}

// ── Pagination ────────────────────────────────────────────────────────

export type PaginationProps = {
  /** Current active page (1-indexed) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Additional class names */
  className?: string;
} & Omit<ComponentPropsWithoutRef<"nav">, "aria-label">;

/**
 * Pagination -- page navigation with prev/next buttons and page numbers.
 *
 * Automatically renders ellipsis for large page ranges. Uses aria-current
 * on the active page and aria-disabled on unavailable prev/next buttons.
 *
 * @example
 * ```tsx
 * <Pagination page={3} totalPages={10} onPageChange={setPage} />
 * ```
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  function Pagination({ page, totalPages, onPageChange, className, ...rest }, ref) {
    const pages = useMemo(() => getPageRange(page, totalPages), [page, totalPages]);

    const handlePrev = useCallback(() => {
      if (page > 1) onPageChange(page - 1);
    }, [page, onPageChange]);

    const handleNext = useCallback(() => {
      if (page < totalPages) onPageChange(page + 1);
    }, [page, totalPages, onPageChange]);

    const handlePage = useCallback(
      (p: number) => () => {
        onPageChange(p);
      },
      [onPageChange],
    );

    const isPrevDisabled = page <= 1;
    const isNextDisabled = page >= totalPages;

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cx(paginationNavStyles, className)}
        {...rest}
      >
        {/* Previous button */}
        <button
          type="button"
          className={paginationButtonRecipe()}
          aria-label="Previous page"
          aria-disabled={isPrevDisabled || undefined}
          onClick={isPrevDisabled ? (e) => e.preventDefault() : handlePrev}
        >
          &lsaquo;
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className={paginationEllipsisStyles}>
              &hellip;
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={paginationButtonRecipe({ active: p === page || undefined })}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              onClick={handlePage(p)}
            >
              {p}
            </button>
          ),
        )}

        {/* Next button */}
        <button
          type="button"
          className={paginationButtonRecipe()}
          aria-label="Next page"
          aria-disabled={isNextDisabled || undefined}
          onClick={isNextDisabled ? (e) => e.preventDefault() : handleNext}
        >
          &rsaquo;
        </button>
      </nav>
    );
  },
);
