import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  createBookingModel,
  getBookingsByUserModel,
  deleteBookingModel,
  checkBookingConflictModel,
  getBookingByIdModel,
  confirmBookingModel,
} from "./models/booking.model";
import { Id } from "./_generated/dataModel";
import { bookingStateDataSchema } from "./schema";

export const checkBookingConflict = query({
  args: {
    userId: v.string(),
    startTime: v.number(),
    endTime: v.number(),
  },
  handler: async (ctx, args) => {
    return await checkBookingConflictModel(
      ctx,
      args.userId as Id<"users">,
      args.startTime,
      args.endTime);
  },
});

export const createBooking = mutation({
  args: {
    bookingData: v.object({
      userId: v.string(),
      parkingSpaceId: v.string(),
      parkingName: v.string(),
      startTime: v.number(),
      endTime: v.number(),
      totalCost: v.number(),
      discountRate: v.number(),
      state: bookingStateDataSchema,
      updatedAt: v.optional(v.number()),
    })
  },
  handler: async (ctx, args) => {
    return await createBookingModel(
      ctx,
      args.bookingData,
    );
  },
});

export const getBookingsByUser = query({
  args: {
    userId: v.string(),
    keyword: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await getBookingsByUserModel(
      ctx,
      args.userId as Id<"users">,
      args.keyword,
      args.startTime,
      args.endTime);
  },
});

export const getBookingByIdData = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const booking = await getBookingByIdModel(ctx, args.id as Id<"bookings">);
    return booking;
  },
});

export const confirmBookingData = mutation({
  args: {
    bookingId: v.string(),
    update: v.object({
      userId: v.string(),
      state: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await confirmBookingModel(
      ctx,
      args.bookingId as Id<"bookings">,
      args.update,
    );
  },
});

// export const updateBookingState = mutation({
//   args: {
//     bookingId: v.string(),
//     update: v.object({
//       startTime: v.optional(v.number()),
//       endTime: v.optional(v.number()),
//       totalCost: v.optional(v.number()),
//       updatedAt: v.optional(v.number()),
//       state: v.optional(bookingStateDataSchema),
//       userId: v.string(),
//       parkingSpaceId: v.optional(v.string()),
//       parkingName: v.optional(v.string()),
//     }),
//   },
//   handler: async (ctx, args) => {
//     await updateBookingStateModel(
//       ctx,
//       args.bookingId as Id<"bookings">,
//       { ...args.update, userId: args.update.userId as Id<"users"> },
//     );
//   },
// });

export const deleteBooking = mutation({
  args: { bookingId: v.string() },
  handler: async (ctx, args) => {
    await deleteBookingModel(ctx, args.bookingId as Id<"bookings">);
  },
});