import { z } from "zod";

/**
 * Schema for message item on list.
 */
export const searchInputSchema = z.object({
  keyword: z.string().regex(/^[A-Za-z0-9]+$/, {
    message: "Keyword must contain only letters and numbers.",
  }),
});