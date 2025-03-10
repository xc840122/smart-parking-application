import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  createBookingModel,
  getBookingsByUserModel,
  updateBookingStatusModel,
  deleteBookingModel,
} from "./models/booking.model";
import { bookingSchema } from "@/validators/booking.validator";

/**
 * Creates a new booking.
 * @param {object} args - The arguments for creating a booking.
 * @param {Id<"users">} args.userId - The ID of the user making the booking.
 * @param {Id<"parking_spaces">} args.parkingSpaceId - The ID of the parking space being booked.
 * @param {number} args.startTime - The start time of the booking (timestamp).
 * @param {number} args.endTime - The end time of the booking (timestamp).
 * @param {number} args.totalCost - The total cost of the booking.
 * @param {bookingSchema} args.status - The status of the booking (e.g., "pending", "confirmed").
 * @returns {Promise<Id<"bookings">>} The ID of the newly created booking.
 */
export const createBooking = mutation({
  args: {
    userId: v.id("users"),
    parkingSpaceId: v.id("parking_spaces"),
    startTime: v.number(),
    endTime: v.number(),
    totalCost: v.number(),
    status: bookingSchema,
  },
  handler: async (ctx, args) => {
    return await createBookingModel(
      ctx,
      args.userId,
      args.parkingSpaceId,
      args.startTime,
      args.endTime,
      args.totalCost,
      args.status
    );
  },
});

/**
 * Retrieves bookings by user ID.
 * @param {object} args - The arguments for retrieving bookings.
 * @param {Id<"users">} args.userId - The ID of the user to retrieve bookings for.
 * @returns {Promise<BookingDataModel[]>} A list of bookings for the specified user.
 */
export const getBookingsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await getBookingsByUserModel(ctx, args.userId);
  },
});

/**
 * Updates a booking's status by its ID.
 * @param {object} args - The arguments for updating a booking.
 * @param {Id<"bookings">} args.bookingId - The ID of the booking to update.
 * @param {bookingSchema} args.status - The new status of the booking.
 */
export const updateBookingStatus = mutation({
  args: { bookingId: v.id("bookings"), status: bookingSchema },
  handler: async (ctx, args) => {
    await updateBookingStatusModel(ctx, args.bookingId, args.status);
  },
});

/**
 * Deletes a booking by its ID.
 * @param {object} args - The arguments for deleting a booking.
 * @param {Id<"bookings">} args.bookingId - The ID of the booking to delete.
 */
export const deleteBooking = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    await deleteBookingModel(ctx, args.bookingId);
  },
});