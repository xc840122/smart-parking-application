import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { BookingDataModel } from "@/types/convex.type";
import { BookingType } from "@/validators/booking.validator";

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
    userId,
  });
};

export const getBookingByIdRepo = async (id: string): Promise<BookingDataModel | null> => {
  try {
    const booking = await fetchQuery(api.booking.getBookingByIdData, { id });
    return !booking ? null : booking;
  } catch (error) {
    console.error(`Failed to get booking by ID: ${error}`);
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
    bookingId: bookingId as Id<"bookings">,
  });
};


export const updateBookingStateRepo = async (
  bookingId: string,
  update: Partial<BookingType>,
) => {
  await fetchMutation(api.booking.updateBookingState, {
    bookingId: bookingId,
    update,
  });
};