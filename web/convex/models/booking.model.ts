import { BookingDataModel, BookingType } from "@/types/convex.type";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

// models/booking.model.ts
export const createBookingModel = async (
  ctx: MutationCtx,
  bookingData: {
    userId: Id<"users">,
    parkingSpaceId: Id<"parking_spaces">,
    startTime: number,
    endTime: number,
    totalCost: number,
    status: BookingType
  }
): Promise<Id<"bookings">> => {
  try {
    // Basic validation (required fields)
    if (
      !bookingData.userId ||
      !bookingData.parkingSpaceId ||
      !bookingData.startTime ||
      !bookingData.endTime ||
      !bookingData.totalCost ||
      !bookingData.status
    ) {
      throw new Error("Invalid input: Missing required fields");
    }

    // Insert the booking into the database
    return await ctx.db.insert("bookings", {
      ...bookingData,
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

export const checkBookingConflictModel = async (
  ctx: QueryCtx,
  userId: Id<"users">,
  startTime: number,
  endTime: number,
): Promise<BookingDataModel[]> => {
  try {
    if (!userId || !startTime || !endTime) {
      throw new Error("Invalid input: User ID, start time, end time, and status are required");
    }
    // Find bookings that start during the proposed time
    const conflictsStartDuring = await ctx.db
      .query("bookings")
      .withIndex("by_userId_startTime", (q) =>
        q.eq("userId", userId)
          .gte("startTime", startTime)
          .lt("startTime", endTime)
      )
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "confirmed")
        )
      )
      .collect();

    // Find bookings that end during the proposed time
    const conflictsEndDuring = await ctx.db
      .query("bookings")
      .withIndex("by_userId_endTime", (q) =>
        q.eq("userId", userId)
          .gt("endTime", startTime)
          .lte("endTime", endTime)
      )
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "confirmed")
        )
      )
      .collect();

    // Find bookings that completely encompass the proposed time
    const conflictsEncompass = await ctx.db
      .query("bookings")
      .withIndex("by_userId_status", (q) =>
        q.eq("userId", userId)
      )
      .filter((q) =>
        q.and(
          q.gte(q.field("endTime"), endTime),
          q.lte(q.field("startTime"), startTime),
          q.or(
            q.eq(q.field("status"), "pending"),
            q.eq(q.field("status"), "confirmed"),
          )
        )
      )
      .collect();

    // Combine all conflicts, removing any duplicates
    const allConflicts = [...conflictsStartDuring, ...conflictsEndDuring, ...conflictsEncompass];
    return allConflicts;

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