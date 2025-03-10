import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { BookingDataModel, BookingType } from "@/types/booking.type";

/**
 * Retrieves bookings by user ID.
 * @param {string} userId - The ID of the user to retrieve bookings for.
 * @returns {Promise<BookingDataModel[]>} A list of bookings for the specified user.
 * @throws {Error} If the query fails.
 */
export const getBookingsByUserRepo = async (userId: string): Promise<BookingDataModel[]> => {
  try {
    return await fetchQuery(api.booking.getBookingsByUser, {
      userId: userId as Id<"users">,
    });
  } catch (error) {
    console.error(`Failed to get bookings by user: ${error}`);
    throw new Error("Get bookings by user failed");
  }
}

/**
 * Creates a new booking in the database.
 * @param {string} userId - The ID of the user making the booking.
 * @param {string} parkingSpaceId - The ID of the parking space being booked.
 * @param {number} startTime - The start time of the booking (timestamp).
 * @param {number} endTime - The end time of the booking (timestamp).
 * @param {number} totalCost - The total cost of the booking.
 * @param {BookingType} status - The status of the booking (e.g., "pending", "confirmed").
 * @returns {string} The ID of the newly created booking.
 * @throws {Error} If the mutation fails.
 */
export const createBooking = async (
  userId: string,
  parkingSpaceId: string,
  startTime: number,
  endTime: number,
  totalCost: number,
  status: BookingType
): Promise<string> => {
  try {
    return await fetchMutation(api.booking.createBooking, {
      userId: userId as Id<"users">,
      parkingSpaceId: parkingSpaceId as Id<"parking_spaces">,
      startTime,
      endTime,
      totalCost,
      status,
    });
  } catch (error) {
    console.error(`Failed to create booking: ${error}`);
    throw new Error("Create booking failed");
  }
}

/**
 * Updates a booking's status by its ID.
 * @param {string} bookingId - The ID of the booking to update.
 * @param {BookingType} status - The new status of the booking.
 * @throws {Error} If the mutation fails.
 */
export const updateBookingStatus = async (bookingId: string, status: BookingType) => {
  try {
    await fetchMutation(api.booking.updateBookingStatus, {
      bookingId: bookingId as Id<"bookings">,
      status,
    });
  } catch (error) {
    console.error(`Failed to update booking status: ${error}`);
    throw new Error("Update booking status failed");
  }
}

/**
 * Deletes a booking by its ID.
 * @param {string} bookingId - The ID of the booking to delete.
 * @throws {Error} If the mutation fails.
 */
export const deleteBooking = async (bookingId: string) => {
  try {
    await fetchMutation(api.booking.deleteBooking, {
      bookingId: bookingId as Id<"bookings">,
    });
  } catch (error) {
    console.error(`Failed to delete booking: ${error}`);
    throw new Error("Delete booking failed");
  }
}