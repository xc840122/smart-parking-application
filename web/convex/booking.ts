import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  createBookingModel,
  getBookingsByUserModel,
  updateBookingStatusModel,
  deleteBookingModel,
  checkBookingConflictModel,
} from "./models/booking.model";
import { bookingStateDataSchema } from "./schema";

export const checkBookingConflict = query({
  args: {
    userId: v.id("users"),
    startTime: v.number(),
    endTime: v.number(),
  },
  handler: async (ctx, args) => {
    return await checkBookingConflictModel(ctx, args.userId, args.startTime, args.endTime);
  },
});

export const createBooking = mutation({
  args: {
    bookingData: v.object({
      userId: v.id("users"),
      parkingSpaceId: v.optional(v.id("parking_spaces")),
      parkingName: v.string(),
      startTime: v.number(),
      endTime: v.number(),
      totalCost: v.number(),
      status: bookingStateDataSchema,
    })
  },
  handler: async (ctx, args) => {
    return await createBookingModel(
      ctx,
      args.bookingData
    );
  },
});

export const getBookingsByUser = query({
  args: {
    userId: v.id("users"),
    keyword: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await getBookingsByUserModel(
      ctx,
      args.userId,
      args.keyword,
      args.startTime,
      args.endTime);
  },
});


export const updateBookingStatus = mutation({
  args: { bookingId: v.id("bookings"), status: bookingStateDataSchema },
  handler: async (ctx, args) => {
    await updateBookingStatusModel(ctx, args.bookingId, args.status);
  },
});

export const deleteBooking = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    await deleteBookingModel(ctx, args.bookingId);
  },
});