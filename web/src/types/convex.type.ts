import { Infer } from "convex/values";
import { Doc } from "../../convex/_generated/dataModel";
import { bookingStateDataSchema } from "../../convex/schema";

export type BookingType = Infer<typeof bookingStateDataSchema>;

export type UserDataModel = Doc<"users">;

export type BookingDataModel = Doc<'bookings'>

export type ParkingSpaceDataModel = Doc<"parking_spaces">;

export type CityDataModel = Doc<"cities">;

export type AreaDataModel = Doc<"areas">;

export type StreetDataModel = Doc<"streets">;