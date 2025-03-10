import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

/**
 * Creates a new payment in the database.
 * @param {MutationCtx} ctx - The Convex mutation context.
 * @param {Id<"bookings">} bookingId - The ID of the booking associated with the payment.
 * @param {Id<"users">} userId - The ID of the user making the payment.
 * @param {number} amount - The amount paid.
 * @param {string} paymentMethod - The payment method used (e.g., "credit card", "PayPal").
 * @param {string} status - The status of the payment (e.g., "success", "failed").
 * @returns {Promise<Id<"payments">>} The ID of the newly created payment.
 * @throws {Error} If required fields are missing or creation fails.
 */
export const createPaymentModel = async (
  ctx: MutationCtx,
  bookingId: Id<"bookings">,
  userId: Id<"users">,
  amount: number,
  paymentMethod: string,
  status: string
): Promise<Id<"payments">> => {
  try {
    // Validate required fields
    if (!bookingId || !userId || !amount || !paymentMethod || !status) {
      throw new Error("Invalid input: Missing required fields");
    }

    // Create the payment
    return await ctx.db.insert("payments", {
      bookingId,
      userId,
      amount,
      paymentMethod,
      status,
      createdAt: Date.now(),
    });
  } catch (error) {
    console.error("Failed to create payment:", error);
    throw new Error("Payment creation failed");
  }
};

/**
 * Retrieves payments by booking ID.
 * @param {QueryCtx} ctx - The Convex query context.
 * @param {Id<"bookings">} bookingId - The ID of the booking.
 * @returns {Promise<object[]>} A list of payments for the specified booking.
 * @throws {Error} If the booking ID is invalid or query fails.
 */
export const getPaymentsByBookingModel = async (
  ctx: QueryCtx,
  bookingId: Id<"bookings">
): Promise<object[]> => {
  try {
    if (!bookingId) {
      throw new Error("Invalid input: Booking ID is required");
    }
    return await ctx.db
      .query("payments")
      .withIndex("by_bookingId", (q) => q.eq("bookingId", bookingId))
      .collect();
  } catch (error) {
    console.error("Failed to get payments by booking:", error);
    throw new Error("Query failed");
  }
};