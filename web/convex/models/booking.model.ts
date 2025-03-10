import { BookingDataModel, BookingType } from "@/types/booking.type";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

/**
 * Creates a new booking in the database.
 * @param {MutationCtx} ctx - The Convex mutation context.
 * @param {Id<"users">} userId - The ID of the user making the booking.
 * @param {Id<"parking_spaces">} parkingSpaceId - The ID of the parking space being booked.
 * @param {number} startTime - The start time of the booking (timestamp).
 * @param {number} endTime - The end time of the booking (timestamp).
 * @param {number} totalCost - The total cost of the booking.
 * @param {BookingType} status - The status of the booking (e.g., "pending", "confirmed").
 * @returns {Promise<Id<"bookings">>} The ID of the newly created booking.
 * @throws {Error} If required fields are missing, status is invalid, or booking creation fails.
 */
export const createBookingModel = async (
  ctx: MutationCtx,
  userId: Id<"users">,
  parkingSpaceId: Id<"parking_spaces">,
  startTime: number,
  endTime: number,
  totalCost: number,
  status: BookingType
): Promise<Id<"bookings">> => {
  try {
    // Validate required fields
    if (!userId || !parkingSpaceId || !startTime || !endTime || !totalCost || !status) {
      throw new Error("Invalid input: Missing required fields");
    }

    // Create the booking
    return await ctx.db.insert("bookings", {
      userId,
      parkingSpaceId,
      startTime,
      endTime,
      totalCost,
      status,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error("Failed to create booking:", error);
    throw new Error("Booking creation failed");
  }
};

/**
 * Retrieves bookings by user ID.
 * @param {QueryCtx} ctx - The Convex query context.
 * @param {Id<"users">} userId - The ID of the user to retrieve bookings for.
 * @returns {Promise<BookingDataModel[]>} A list of bookings for the specified user.
 * @throws {Error} If the user ID is invalid or query fails.
 */
export const getBookingsByUserModel = async (
  ctx: QueryCtx,
  userId: Id<"users">
): Promise<BookingDataModel[]> => {
  try {
    if (!userId) {
      throw new Error("Invalid input: User ID is required");
    }
    return await ctx.db
      .query("bookings")
      .withIndex("by_userId_status", (q) => q.eq("userId", userId))
      .collect();
  } catch (error) {
    console.error("Failed to get bookings by user:", error);
    throw new Error("Query failed");
  }
};

/**
 * Updates a booking's status by its ID.
 * @param {MutationCtx} ctx - The Convex mutation context.
 * @param {Id<"bookings">} bookingId - The ID of the booking to update.
 * @param {BookingType} status - The new status of the booking.
 * @throws {Error} If the booking ID is invalid, status is invalid, or update fails.
 */
export const updateBookingStatusModel = async (
  ctx: MutationCtx,
  bookingId: Id<"bookings">,
  status: BookingType
): Promise<void> => {
  try {
    if (!bookingId || !status) {
      throw new Error("Invalid input: Booking ID and status are required");
    }

    // Update the booking status
    await ctx.db.patch(bookingId, { status });
  } catch (error) {
    console.error("Failed to update booking status:", error);
    throw new Error("Update failed");
  }
};

/**
 * Deletes a booking by its ID.
 * @param {MutationCtx} ctx - The Convex mutation context.
 * @param {Id<"bookings">} bookingId - The ID of the booking to delete.
 * @throws {Error} If the booking ID is invalid or deletion fails.
 */
export const deleteBookingModel = async (
  ctx: MutationCtx,
  bookingId: Id<"bookings">
): Promise<void> => {
  try {
    if (!bookingId) {
      throw new Error("Invalid input: Booking ID is required");
    }

    // Check if the booking exists
    const booking = await ctx.db.get(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Delete the booking
    await ctx.db.delete(bookingId);
  } catch (error) {
    console.error("Failed to delete booking:", error);
    throw new Error("Delete failed");
  }
};