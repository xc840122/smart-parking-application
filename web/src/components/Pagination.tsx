'use client';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { MAX_DISPLAY_PAGE_NUMBER } from "@/lib/settings";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


/**
 * Apply different view according to screen size
 * @param param0 
 * @returns 
 */
const PaginationView = ({
  currentPage,
  totalPages
}: {
  currentPage: number,
  totalPages: number
}) => {

  // Handle the change of the pagination
  const path = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const onPageChange = (page: number) => {
    // Create a new URLSearchParams instance to preserve existing parameters
    const params = new URLSearchParams(searchParams.toString());
    // Control the display of list
    params.set("mode", "desktop");
    // Update or set the `page` parameter
    params.set("page", page.toString());
    // Return the new URL with the updated parameters
    return `${path}?${params.toString()}`;
  }

  const onClickLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    // Load next page once the button is clicked
    params.set("page", (currentPage + 1).toString());
    // Control the display of list
    params.set("mode", "mobile");
    // Handle the last page
    if (currentPage === totalPages) {
      return null;
    }
    router.push(`${path}?${params.toString()}`, { scroll: false });
  }

  /**
   * Handle the display of page numbers based on the following logic:
   * 1. If the total number of pages is less than or equal to the maximum number of pages to display, show all pages.
   * 2. If the current page is near the start, show the first few pages.
   * 3. If the current page is near the end, show the last few pages.
   * 4. If the current page is in the middle, show the current page with surrounding pages.
 **/
  const pageDisplayNumbers = (totalPages: number, currentPage: number) => {
    // Case 1: Display all pages if totalPages is less than or equal to MAX_DISPLAY_PAGE_NUMBER
    if (totalPages <= MAX_DISPLAY_PAGE_NUMBER) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    // Case 2: Display first few pages if the current page is near the beginning
    if (currentPage <= Math.floor(MAX_DISPLAY_PAGE_NUMBER / 2)) {
      return Array.from({ length: MAX_DISPLAY_PAGE_NUMBER }, (_, index) => index + 1);
    }
    // Case 3: Display last few pages if the current page is near the end
    if (currentPage >= totalPages - Math.floor(MAX_DISPLAY_PAGE_NUMBER / 2)) {
      return Array.from({ length: MAX_DISPLAY_PAGE_NUMBER }, (_, index) => totalPages - MAX_DISPLAY_PAGE_NUMBER + index + 1);
    }
    // Case 4: Display pages centered around the current page
    return Array.from({ length: MAX_DISPLAY_PAGE_NUMBER }, (_, index) => currentPage - Math.floor(MAX_DISPLAY_PAGE_NUMBER / 2) + index);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem
          onClick={onClickLoadMore}
          className={`grid place-items-center md:hidden w-screen mx-4 mt-2 rounded-md shadow-md h-10
           bg-slate-400 hover:bg-slate-500 text-white font-semibold py-1 cursor-pointer ${currentPage === totalPages ? "hidden" : ""}`}>
          Load More
        </PaginationItem>
        {/* Previous button, modify the default shadcnui component for disable feature */}
        <PaginationItem className="hidden md:block">
          <PaginationPrevious
            disable={currentPage === 1 || totalPages === 0}
            href={onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
          />
        </PaginationItem>
        {/* Render the pagination number */}
        {pageDisplayNumbers(totalPages, currentPage)
          .map((pageNumber) => {
            return (
              <PaginationItem key={pageNumber} className="hidden md:block">
                <PaginationLink
                  isActive={currentPage === pageNumber}
                  href={onPageChange(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          })}
        {/* Next button, modify the default shadcnui component for disable feature */}
        <PaginationItem className="hidden md:block">
          <PaginationNext
            disable={currentPage === totalPages || totalPages === 0}
            href={onPageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination >
  )
}

export default PaginationView;
