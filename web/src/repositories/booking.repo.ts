import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { BookingDataModel } from "@/types/convex.type";
import { BookingType } from "@/validators/booking.validator";

export const checkBookingConflictRepo = async (
  userId: string,
  startTime: number,
  endTime: number
): Promise<BookingDataModel[]> => {
  try {
    const conflictExists = await fetchQuery(api.booking.checkBookingConflict, {
      userId,
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
    userId,
  });
};

export const getBookingByIdRepo = async (bookingId: string): Promise<BookingDataModel | null> => {
  try {
    const booking = await fetchQuery(api.booking.getBookingByIdData, { id: bookingId });
    return !booking ? null : booking;
  } catch (error) {
    console.error(`Failed to get booking by ID from database: ${error}`);
    throw new Error("Get booking by ID failed");
  }
}

export const createBookingRepo = async (
  bookingData: BookingType
): Promise<string> => {
  return await fetchMutation(api.booking.createBooking, {
    bookingData
  });
};


export const deleteBookingRepo = async (bookingId: string) => {
  await fetchMutation(api.booking.deleteBooking, {
    bookingId: bookingId,
  });
};


export const confirmBookingRepo = async (
  bookingId: string,
  update: { userId: string, state: string },
) => {
  await fetchMutation(api.booking.confirmBookingData, {
    bookingId: bookingId,
    update,
  });
};