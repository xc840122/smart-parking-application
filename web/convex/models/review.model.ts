import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

/**
 * Creates a new review in the database.
 * @param {MutationCtx} ctx - The Convex mutation context.
 * @param {Id<"users">} userId - The ID of the user submitting the review.
 * @param {Id<"parking_spaces">} parkingSpaceId - The ID of the parking space being reviewed.
 * @param {number} rating - The rating given by the user (e.g., 1 to 5 stars).
 * @param {string} [comment] - An optional comment from the user.
 * @returns {Promise<Id<"reviews">>} The ID of the newly created review.
 * @throws {Error} If required fields are missing or creation fails.
 */
export const createReviewModel = async (
  ctx: MutationCtx,
  userId: Id<"users">,
  parkingSpaceId: Id<"parking_spaces">,
  rating: number,
  comment?: string
): Promise<Id<"reviews">> => {
  try {
    // Validate required fields
    if (!userId || !parkingSpaceId || !rating) {
      throw new Error("Invalid input: Missing required fields");
    }

    // Validate rating (e.g., 1 to 5 stars)
    if (rating < 1 || rating > 5) {
      throw new Error("Invalid rating: Rating must be between 1 and 5");
    }

    // Create the review
    return await ctx.db.insert("reviews", {
      userId,
      parkingSpaceId,
      rating,
      comment,
      createdAt: Date.now(),
    });
  } catch (error) {
    console.error("Failed to create review:", error);
    throw new Error("Review creation failed");
  }
};

/**
 * Retrieves reviews for a parking space.
 * @param {QueryCtx} ctx - The Convex query context.
 * @param {Id<"parking_spaces">} id - The ID of the parking space.
 * @returns {Promise<object[]>} A list of reviews for the specified parking space.
 * @throws {Error} If the parking space ID is invalid or query fails.
 */
export const getReviewsByParkingSpaceModel = async (
  ctx: QueryCtx,
  parkingSpaceId: Id<"parking_spaces">
): Promise<object[]> => {
  try {
    return await ctx.db
      .query("reviews")
      .withIndex("by_parkingSpaceId", (q) =>
        q.eq("parkingSpaceId", parkingSpaceId)
      )
      .collect();
  } catch (error) {
    console.error("Failed to get reviews by parking space:", error);
    throw new Error("Query failed");
  }
};