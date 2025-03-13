import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  createPaymentModel,
  getPaymentsByBookingModel,
} from "./models/payment.model";

export const createPayment = mutation({
  args: {
    bookingId: v.id("bookings"),
    userId: v.id("users"),
    amount: v.number(),
    paymentMethod: v.string(),
    state: v.string(),
  },
  handler: async (ctx, args) => {
    return await createPaymentModel(
      ctx,
      args.bookingId,
      args.userId,
      args.amount,
      args.paymentMethod,
      args.state
    );
  },
});

/**
 * Retrieves payments by booking ID.
 * @param {object} args - The arguments for retrieving payments.
 * @param {Id<"bookings">} args.bookingId - The ID of the booking.
 * @returns {Promise<object[]>} A list of payments for the specified booking.
 */
export const getPaymentsByBooking = query({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    return await getPaymentsByBookingModel(ctx, args.bookingId);
  },
});