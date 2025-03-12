import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  getParkingModel,
  getParkingByIdModel,
  createParkingModel,
  updateParkingModel,
  deleteParkingModel,
} from "./models/parking.model";
import { Id } from "./_generated/dataModel";

export const createParkingData = mutation({
  args: {
    parkingData: v.object({
      name: v.string(),
      location: v.optional(v.object({ lat: v.number(), lng: v.number() })),
      city: v.string(),
      area: v.string(),
      street: v.string(),
      unit: v.string(),
      totalSlots: v.number(),
      availableSlots: v.number(),
      pricePerHour: v.number(),
      isActive: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    return await createParkingModel(
      ctx,
      args.parkingData,
    );
  },
});


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
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const parking = await getParkingByIdModel(ctx, args.id as Id<"parking_spaces">);
    return parking;
  },
});


export const updateParkingData = mutation({
  args: {
    id: v.string(),
    update: v.object({
      name: v.optional(v.string()),
      location: v.optional(v.object({ lat: v.number(), lng: v.number() })),
      city: v.optional(v.string()),
      area: v.optional(v.string()),
      street: v.optional(v.string()),
      unit: v.optional(v.string()),
      totalSlots: v.optional(v.number()),
      pricePerHour: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
    })
  },
  handler: async (ctx, args) => {
    await updateParkingModel(
      ctx,
      args.id as Id<"parking_spaces">,
      args.update,
    );
  },
});

/**
 * Deletes a parking space by its ID.
 * @param {object} args - The arguments for deleting a parking space.
 * @param {Id<"parking_spaces">} args.id - The ID of the parking space to delete.
 */
export const deleteParkingData = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    await deleteParkingModel(ctx, args.id as Id<"parking_spaces">);
  },
});