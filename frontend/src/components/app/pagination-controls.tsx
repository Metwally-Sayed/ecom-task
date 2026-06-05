import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPaginationRange } from "@/lib/utils/pagination";

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  basePath?: string;
  search?: string;
  category?: string;
  status?: string;
};

function buildPageHref(
  page: number,
  basePath: string,
  filters: Omit<PaginationControlsProps, "page" | "totalPages" | "basePath">,
) {
  const searchParams = new URLSearchParams();

  if (filters.search) {
    searchParams.set("search", filters.search);
  }
  if (filters.category) {
    searchParams.set("category", filters.category);
  }
  if (filters.status) {
    searchParams.set("status", filters.status);
  }

  searchParams.set("page", String(page));

  return `${basePath}?${searchParams.toString()}`;
}

export function PaginationControls({
  page,
  totalPages,
  basePath = "/products",
  search,
  category,
  status,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  const filters = { search, category, status };
  const pages = getPaginationRange(page, totalPages);
  const showLeadingEllipsis = pages[0] > 1;
  const showTrailingEllipsis = pages[pages.length - 1] < totalPages;

  return (
    <Pagination className="justify-start">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildPageHref(Math.max(1, page - 1), basePath, filters)}
            aria-disabled={page === 1}
            className={page === 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {showLeadingEllipsis ? (
          <>
            <PaginationItem>
              <PaginationLink href={buildPageHref(1, basePath, filters)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        ) : null}

        {pages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href={buildPageHref(pageNumber, basePath, filters)}
              isActive={pageNumber === page}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showTrailingEllipsis ? (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={buildPageHref(totalPages, basePath, filters)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        ) : null}

        <PaginationItem>
          <PaginationNext
            href={buildPageHref(Math.min(totalPages, page + 1), basePath, filters)}
            aria-disabled={page === totalPages}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
