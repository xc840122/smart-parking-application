import { z } from "zod";

export const parkingSpaceSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    location: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
    city: z.string().min(1, "City is required"),
    area: z.string().min(1, "Area is required"),
    street: z.string().min(1, "Street is required"),
    unit: z.string().min(1, "Unit is required"),
    totalSlots: z.number().min(1, "Total slots must be at least 1"),
    availableSlots: z.number().min(1, "Available slots must be at least 1"),
    pricePerHour: z.number().min(0, "Price per hour must be a positive number"),
    isActive: z.boolean(),
  })
  .refine((data) => data.availableSlots <= data.totalSlots, {
    message: "Available slots cannot be greater than total slots",
    path: ["availableSlots"],
  });


export type ParkingSpaceType = z.infer<typeof parkingSpaceSchema>;