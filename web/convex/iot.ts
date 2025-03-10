import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  createIoTDataModel,
  getLatestOccupancyStatusModel,
} from "./models/iot.model";

/**
 * Creates a new IoT data entry.
 * @param {object} args - The arguments for creating an IoT data entry.
 * @param {Id<"parking_spaces">} args.id - The ID of the parking space.
 * @param {string} args.sensorId - The ID of the IoT sensor.
 * @param {boolean} args.occupancyStatus - The occupancy status (true = occupied, false = available).
 * @param {number} args.timestamp - The timestamp when the data was recorded.
 * @returns {Promise<Id<"iot_data">>} The ID of the newly created IoT data entry.
 */
export const createIoTData = mutation({
  args: {
    id: v.id("parking_spaces"),
    sensorId: v.string(),
    occupancyStatus: v.boolean(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    return await createIoTDataModel(
      ctx,
      args.id,
      args.sensorId,
      args.occupancyStatus,
      args.timestamp
    );
  },
});

/**
 * Retrieves the latest occupancy status for a parking space.
 * @param {object} args - The arguments for retrieving the latest occupancy status.
 * @param {Id<"parking_spaces">} args.id - The ID of the parking space.
 * @returns {Promise<object | null>} The latest IoT data entry for the parking space.
 */
export const getLatestOccupancyStatus = query({
  args: { id: v.id("parking_spaces") },
  handler: async (ctx, args) => {
    return await getLatestOccupancyStatusModel(ctx, args.id);
  },
});