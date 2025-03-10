import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  createReviewModel,
  getReviewsByParkingSpaceModel,
} from "./models/review.model";

/**
 * Creates a new review.
 * @param {object} args - The arguments for creating a review.
 * @param {Id<"users">} args.userId - The ID of the user submitting the review.
 * @param {Id<"parking_spaces">} args.id - The ID of the parking space being reviewed.
 * @param {number} args.rating - The rating given by the user (e.g., 1 to 5 stars).
 * @param {string} [args.comment] - An optional comment from the user.
 * @returns {Promise<Id<"reviews">>} The ID of the newly created review.
 */
export const createReview = mutation({
  args: {
    userId: v.id("users"),
    id: v.id("parking_spaces"),
    rating: v.number(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await createReviewModel(
      ctx,
      args.userId,
      args.id,
      args.rating,
      args.comment
    );
  },
});

/**
 * Retrieves reviews for a parking space.
 * @param {object} args - The arguments for retrieving reviews.
 * @param {Id<"parking_spaces">} args.id - The ID of the parking space.
 * @returns {Promise<object[]>} A list of reviews for the specified parking space.
 */
export const getReviewsByParkingSpace = query({
  args: { id: v.id("parking_spaces") },
  handler: async (ctx, args) => {
    return await getReviewsByParkingSpaceModel(ctx, args.id);
  },
});