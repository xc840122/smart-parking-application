import { z } from "zod";

const bookingStateSchema = z.enum([
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "expired",
]);

// Define the schema for the booking data
export const bookingCreationSchema = z.object({
  userId: z.string().min(1, "User ID is required"), // User ID must be a non-empty string
  parkingSpaceId: z.string().min(1, "Parking space ID is required"), // Parking space ID must be a non-empty string
  startTime: z.number().positive("Start time must be a positive number"), // Start time must be a positive number (timestamp)
  endTime: z.number().positive("End time must be a positive number"), // End time must be a positive number (timestamp)
  totalCost: z.number().nonnegative("Total cost must be a non-negative number"), // Total cost must be a non-negative number
  status: bookingStateSchema.default("pending") // Status must be one of the enum values, defaulting to "reserved"
});

// Infer the TypeScript type from the Zod schema
export type BookingCreationData = z.infer<typeof bookingCreationSchema>;