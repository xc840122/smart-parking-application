import { BookingDataModel } from "@/types/convex.type";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { BookingState, BookingType } from "@/validators/booking.validator";

// models/booking.model.ts
export const createBookingModel = async (
  ctx: MutationCtx,
  bookingData: BookingType,
): Promise<Id<"bookings">> => {
  try {
    const { userId, parkingSpaceId, parkingName, startTime, endTime, totalCost, state } = bookingData;
    // Basic validation (required fields)
    if (
      !userId ||
      !parkingSpaceId ||
      !parkingName ||
      !startTime ||
      !endTime ||
      !totalCost ||
      !state
    ) {
      throw new Error("Invalid input: Missing required fields");
    }
    // Insert the booking into the database
    return await ctx.db.insert("bookings",
      {
        ...bookingData,
        userId: bookingData.userId as Id<"users">,
        parkingSpaceId: bookingData.parkingSpaceId as Id<"parking_spaces">,
        updatedAt: bookingData.updatedAt || Date.now(),
      },
    );
  } catch (error) {
    console.error("Failed to create booking:", error);
    throw new Error("Booking creation failed");
  }
};

export const confirmBookingModel = async (
  ctx: MutationCtx,
  bookingId: Id<"bookings">,
  update: { userId: string, state: string },
): Promise<void> => {
  try {
    if (!bookingId || !update.userId || !update.state) {
      throw new Error("Invalid input: Booking ID are required");
    }
    // Update the booking state
    await ctx.db.patch(bookingId, {
      ...update,
      userId: update.userId as Id<"users">,
      state: update.state as BookingState,
    });
  } catch (error) {
    console.error("Failed to update booking state:", error);
    throw new Error("Update failed");
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
  userId: Id<"users">,
  keyword?: string,
  startTime?: number,
  endTime?: number,
): Promise<BookingDataModel[]> => {
  try {
    if (!userId) {
      throw new Error("Invalid input: User ID is required");
    }
    if (keyword) {
      // If keyword is provided, search by keyword for the user
      return await ctx.db
        .query("bookings")
        .withSearchIndex("search_parking", (q) =>
          q
            .search("parkingSpaceId", keyword)
            .eq("userId", userId)
        )
        .collect();
    }
    else if (startTime && endTime) {
      // If start and end time are provided, filter by time range
      return await ctx.db
        .query("bookings")
        .withIndex("by_userId", (q) =>
          q
            .eq("userId", userId)
            .gte("_creationTime", startTime)
            .lte("_creationTime", endTime)
        )
        .collect();
    }
    else {
      return await ctx.db
        .query("bookings")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .collect();
    }
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
      throw new Error("Invalid input: User ID, start time, end time, and state are required");
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
          q.eq(q.field("state"), "pending"),
          q.eq(q.field("state"), "confirmed")
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
          q.eq(q.field("state"), "pending"),
          q.eq(q.field("state"), "confirmed")
        )
      )
      .collect();

    // Find bookings that completely encompass the proposed time
    const conflictsEncompass = await ctx.db
      .query("bookings")
      .withIndex("by_userId_state", (q) =>
        q.eq("userId", userId)
      )
      .filter((q) =>
        q.and(
          q.gte(q.field("endTime"), endTime),
          q.lte(q.field("startTime"), startTime),
          q.or(
            q.eq(q.field("state"), "pending"),
            q.eq(q.field("state"), "confirmed"),
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

export const getBookingByIdModel = async (
  ctx: QueryCtx,
  _id: Id<"bookings">
): Promise<BookingDataModel | null> => {
  try {
    // Get the parking space
    return await ctx.db
      .query("bookings")
      .withIndex("by_id", (q) => q.eq("_id", _id))
      .first();
  } catch (error) {
    console.error("Failed to get booking:", error);
    throw new Error("Query failed");
  }
}

// export const updateBookingStateModel = async (
//   ctx: MutationCtx,
//   bookingId: Id<"bookings">,
//   update: Partial<BookingType>,
// ): Promise<void> => {
//   try {
//     console.log("update", bookingId, update);
//     if (!bookingId) {
//       throw new Error("Invalid input: Booking ID are required");
//     }
//     // Update the booking state
//     await ctx.db.patch(bookingId, { update });
//   } catch (error) {
//     console.error("Failed to update booking state:", error);
//     throw new Error("Update failed");
//   }
// };

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