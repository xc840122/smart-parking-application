import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  getParkingModel,
  getParkingByIdModel,
  createParkingModel,
  updateParkingModel,
  deleteParkingModel,
} from "./models/parking.model";

/**
 * Creates a new parking space.
 * @param {object} args - The arguments for creating a parking space.
 * @param {string} args.name - The name of the parking space.
 * @param {object} args.location - The geo-location of the parking space.
 * @param {number} args.location.lat - The latitude of the parking space.
 * @param {number} args.location.lng - The longitude of the parking space.
 * @param {string} args.city - The city where the parking space is located.
 * @param {string} args.area - The area or district within the city.
 * @param {string} args.street - The street where the parking space is located.
 * @param {string} args.unit - The unit identifier for the parking space.
 * @param {number} args.totalSlots - The total number of parking slots available.
 * @param {number} args.pricePerHour - The cost of parking per hour.
 * @returns {Promise<Id<"parking_spaces">>} The ID of the newly created parking space.
 */
export const createParkingData = mutation({
  args: {
    name: v.string(),
    location: v.object({ lat: v.number(), lng: v.number() }),
    city: v.string(),
    area: v.string(),
    street: v.string(),
    unit: v.string(),
    totalSlots: v.number(),
    pricePerHour: v.number(),
  },
  handler: async (ctx, args) => {
    return await createParkingModel(
      ctx,
      args.name,
      args.location,
      args.city,
      args.area,
      args.street,
      args.unit,
      args.totalSlots,
      args.pricePerHour
    );
  },
});

/**
 * Retrieves parking spaces.
 * @param {object} args - The arguments for retrieving parking spaces.
 * @param {string} args.city - The city to search for parking spaces.
 * @param {string} args.area - The area within the city to search.
 * @returns {Promise<ParkingSpaceDataModel[]>} A list of parking spaces in the specified location.
 */
export const getParkingData = query({
  args: {
    isActive: v.boolean(),
    city: v.optional(v.string()),
    area: v.optional(v.string()),
    street: v.optional(v.string()),
    keyword: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const parkings = await getParkingModel(
      ctx,
      args.isActive,
      args.city,
      args.area,
      args.street,
      args.keyword,
    );
    return parkings;
  },
});

export const getParkingByIdData = query({
  args: {
    id: v.id("parking_spaces"),
  },
  handler: async (ctx, args) => {
    const parking = await getParkingByIdModel(ctx, args.id);
    return parking;
  },
});

/**
 * Updates a parking space's details by its ID.
 * @param {object} args - The arguments for updating a parking space.
 * @param {Id<"parking_spaces">} args.id - The ID of the parking space to update.
 * @param {object} args.updates - The fields to update.
 * @param {string} [args.updates.name] - The updated name of the parking space.
 * @param {object} [args.updates.location] - The updated geo-location of the parking space.
 * @param {number} [args.updates.location.lat] - The updated latitude.
 * @param {number} [args.updates.location.lng] - The updated longitude.
 * @param {string} [args.updates.city] - The updated city.
 * @param {string} [args.updates.area] - The updated area.
 * @param {string} [args.updates.street] - The updated street.
 * @param {string} [args.updates.unit] - The updated unit.
 * @param {number} [args.updates.totalSlots] - The updated total number of slots.
 * @param {number} [args.updates.pricePerHour] - The updated price per hour.
 * @param {boolean} [args.updates.isActive] - The updated active status.
 */
export const updateParkingData = mutation({
  args: {
    id: v.id("parking_spaces"),
    updates: v.object({
      name: v.optional(v.string()),
      location: v.optional(v.object({ lat: v.number(), lng: v.number() })),
      city: v.optional(v.string()),
      area: v.optional(v.string()),
      street: v.optional(v.string()),
      unit: v.optional(v.string()),
      totalSlots: v.optional(v.number()),
      pricePerHour: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    await updateParkingModel(ctx, args.id, args.updates);
  },
});

/**
 * Deletes a parking space by its ID.
 * @param {object} args - The arguments for deleting a parking space.
 * @param {Id<"parking_spaces">} args.id - The ID of the parking space to delete.
 */
export const deleteParkingData = mutation({
  args: { id: v.id("parking_spaces") },
  handler: async (ctx, args) => {
    await deleteParkingModel(ctx, args.id);
  },
});