import { z } from "zod";

/**
 * Define form schema to update or create a message.
 */
export const noticeCreationSchema = z.object({
  title: z.string().max(20, {
    message: "Title must be less than 20 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
})

export type NoticeCreationType = z.infer<typeof noticeCreationSchema>;


/**
 * Schema for message item on list.
 */
export const searchInputSchema = z.object({
  keyword: z.string().regex(/^[A-Za-z0-9]+$/, {
    message: "Keyword must contain only letters and numbers.",
  }),
})