import { ITEM_PER_PAGE } from "@/lib/settings";

// Convert list to paginated map
export const arrayConverter = <T,>(list: Array<T>): Map<number, T[]> => {
  try {
    const listWithPage = list.reduce((map, item: T, index) => {
      // Calculate page number
      const pageNumber = Math.floor(index / ITEM_PER_PAGE) + 1;
      // Set new pageNumber if not exist
      if (!map.has(pageNumber)) {
        map.set(pageNumber, []);
      }
      // Push item:T to page
      map.get(pageNumber)?.push(item);
      return map;
    }, new Map<number, T[]>());
    return listWithPage;
  } catch (error) {
    console.error(`Failed to get list: ${error}`);
    throw new Error("Convert list to paginated map failed");
  }
}