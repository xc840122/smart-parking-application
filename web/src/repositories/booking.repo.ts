import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { BookingDataModel } from "@/types/convex.type";

export const checkBookingConflictRepo = async (
  userId: string,
  startTime: number,
  endTime: number
): Promise<BookingDataModel[]> => {
  try {
    const conflictExists = await fetchQuery(api.booking.checkBookingConflict, {
      userId: userId as Id<"users">,
      startTime,
      endTime,
    });
    return conflictExists;
  } catch (error) {
    console.error("Failed to check booking conflict:", error);
    throw new Error("Failed to check booking conflict");
  }
};

export const getBookingsByUserRepo = async (
  userId: string
): Promise<BookingDataModel[]> => {
  return await fetchQuery(api.booking.getBookingsByUser, {
    userId: userId as Id<"users">,
  });
};


export const createBookingRepo = async (
  bookingData: BookingDataModel
): Promise<string> => {
  return await fetchMutation(api.booking.createBooking, { bookingData });
};


export const deleteBookingRepo = async (bookingId: string) => {
  await fetchMutation(api.booking.deleteBooking, {
    bookingId: bookingId as Id<"bookings">,
  });
};


// export const updateBookingStatusRepo = async (
//   bookingId: string,
//   status: BookingType
// ) => {
//   await fetchMutation(api.booking.updateBookingStatus, {
//     bookingId: bookingId as Id<"bookings">,
//     status,
//   });
// };