import { Infer } from "convex/values";
import { bookingSchema } from "@/validators/booking.validator";
import { Doc } from "../../convex/_generated/dataModel";

export type BookingType = Infer<typeof bookingSchema>;

export type BookingDataModel = Doc<'bookings'>