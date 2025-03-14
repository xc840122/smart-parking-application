import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

/**
 * Creates a new IoT data entry in the database.
 * @param {MutationCtx} ctx - The Convex mutation context.
 * @param {Id<"parking_spaces">} parkingSpaceId - The ID of the parking space.
 * @param {string} sensorId - The ID of the IoT sensor.
 * @param {boolean} occupancyState - The occupancy state (true = occupied, false = available).
 * @param {number} timestamp - The timestamp when the data was recorded.
 * @returns {Promise<Id<"iot_data">>} The ID of the newly created IoT data entry.
 * @throws {Error} If required fields are missing or creation fails.
 */
export const createIoTDataModel = async (
  ctx: MutationCtx,
  parkingSpaceId: Id<"parking_spaces">,
  sensorId: string,
  occupancyState: boolean,
  updatedAt: number
): Promise<Id<"iot_data">> => {
  try {
    // Validate required fields
    if (!parkingSpaceId || !sensorId || occupancyState === undefined || !updatedAt) {
      throw new Error("Invalid input: Missing required fields");
    }

    // Create the IoT data entry
    return await ctx.db.insert("iot_data", {
      parkingSpaceId,
      sensorId,
      occupancyState,
      updatedAt,
    });
  } catch (error) {
    console.error("Failed to create IoT data entry:", error);
    throw new Error("IoT data creation failed");
  }
};

/**
 * Retrieves the latest occupancy state for a parking space.
 * @param {QueryCtx} ctx - The Convex query context.
 * @param {Id<"parking_spaces">} parkingSpaceId - The ID of the parking space.
 * @returns {Promise<object | null>} The latest IoT data entry for the parking space.
 * @throws {Error} If the parking space ID is invalid or query fails.
 */
export const getLatestOccupancyStateModel = async (
  ctx: QueryCtx,
  parkingSpaceId: Id<"parking_spaces">
): Promise<object | null> => {
  try {
    if (!parkingSpaceId) {
      throw new Error("Invalid input: Parking space ID is required");
    }
    return await ctx.db
      .query("iot_data")
      .withIndex("by_parkingSpaceId_updatedAt", (q) =>
        q.eq("parkingSpaceId", parkingSpaceId)
      )
      .order("desc")
      .first();
  } catch (error) {
    console.error("Failed to get latest occupancy state:", error);
    throw new Error("Query failed");
  }
};