import { z } from "zod";

// Enum for booking state
const bookingStateSchema = z.enum(["pending", "confirmed", "cancelled", "completed", "expired"]);
export type BookingState = z.infer<typeof bookingStateSchema>;

// Schema for create booking
export const bookingCreationSchema = z.object({
  userId: z.string(),
  startTime: z.number().positive("Start time must be a positive number"),
  endTime: z.number().positive("End time must be a positive number"),
  parkingSpaceId: z.string().min(1, "Parking space ID is required"),
});
export type BookingCreationType = z.infer<typeof bookingCreationSchema>;

export const bookingSchema = z.object({
  userId: z.string(),
  startTime: z.number().positive("Start time must be a positive number"),
  endTime: z.number().positive("End time must be a positive number"),
  parkingSpaceId: z.string().min(1, "Parking space ID is required"),
  parkingName: z.string().min(1, "Parking name is required"),
  totalCost: z.number().nonnegative("Total cost must be zero or positive"),
  updatedAt: z.number().optional(),
  state: bookingStateSchema,
});

export type BookingType = z.infer<typeof bookingSchema>;


