import { z } from "zod";

export const parkingSpaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  street: z.string().min(1, "Street is required"),
  unit: z.string().min(1, "Unit is required"),
  totalSlots: z.number().min(1, "Total slots must be at least 1"),
  availableSlots: z.number().min(1, "Total slots must be at least 1"),
  pricePerHour: z.number().min(0, "Price per hour must be a positive number"),
  isActive: z.boolean(),
});

export type ParkingSpaceType = z.infer<typeof parkingSpaceSchema>;

/**
 * Schema for message item on list.
 */
export const searchInputSchema = z.object({
  keyword: z.string().regex(/^[A-Za-z0-9]+$/, {
    message: "Keyword must contain only letters and numbers.",
  }),
});