import { z } from "zod";

// Enum for booking state
const bookingStateSchema = z.enum(["pending", "confirmed", "cancelled", "completed", "expired"]);

// Common schema
export const bookingFormSchema = z.object({
  userId: z.string(),
  parkingSpaceId: z.string().min(1, "Parking space ID is required"),
  parkingName: z.string().min(1, "Parking name is required"),
  startTime: z.number().positive("Start time must be a positive number"),
  endTime: z.number().positive("End time must be a positive number"),
  totalCost: z.number().nonnegative("Total cost must be zero or positive"),
  updatedAt: z.number().optional(),
  state: bookingStateSchema,
});

export type BookingType = z.infer<typeof bookingFormSchema>;

export type BookingState = z.infer<typeof bookingStateSchema>;
