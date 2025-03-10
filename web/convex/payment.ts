import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  createPaymentModel,
  getPaymentsByBookingModel,
} from "./models/payment.model";

/**
 * Creates a new payment.
 * @param {object} args - The arguments for creating a payment.
 * @param {Id<"bookings">} args.bookingId - The ID of the booking associated with the payment.
 * @param {Id<"users">} args.userId - The ID of the user making the payment.
 * @param {number} args.amount - The amount paid.
 * @param {string} args.paymentMethod - The payment method used (e.g., "credit card", "PayPal").
 * @param {string} args.status - The status of the payment (e.g., "success", "failed").
 * @returns {Promise<Id<"payments">>} The ID of the newly created payment.
 */
export const createPayment = mutation({
  args: {
    bookingId: v.id("bookings"),
    userId: v.id("users"),
    amount: v.number(),
    paymentMethod: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await createPaymentModel(
      ctx,
      args.bookingId,
      args.userId,
      args.amount,
      args.paymentMethod,
      args.status
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