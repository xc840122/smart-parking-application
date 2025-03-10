import { useSearchParams } from "next/navigation";

/**
 * Customer hook to extract URL parameters
 * @returns 
 */

export const useURLParams = () => {
  const searchParams = useSearchParams();

  // Extract page from url, defaulting to '1' if missing
  const pageNum = parseInt(searchParams.get('page') ?? '1');

  // Get search keyword from url
  const searchValue = searchParams.has('search')
    ? (searchParams.get('search') ?? '').trim().toLowerCase()
    : '';

  // Get start and end date from url
  const startDate = searchParams.get('start') ?? '';
  const endDate = searchParams.get('end') ?? '';

  // Get load more,for little screen device
  const mode = searchParams.get('mode') ?? '';

  return { pageNum, searchValue, startDate, endDate, mode };
};
