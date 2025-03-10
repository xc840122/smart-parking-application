import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  createUserModel,
  getUserByIdModel,
  getUsersModel,
  updateUserModel,
  deleteUserModel,
} from "./models/user.model";

/**
 * Creates a new user.
 * @param {object} args - The arguments for creating a user.
 * @param {string} args.clerkUserId - The unique Clerk user ID.
 * @param {string} args.firstName - The user's first name.
 * @param {string} args.lastName - The user's last name.
 * @param {string} args.email - The user's email address.
 * @param {string} args.phoneNumber - The user's phone number.
 * @param {object} args.vehicleDetails - The user's vehicle details.
 * @param {string} args.vehicleDetails.licensePlate - The vehicle's license plate.
 * @param {string} args.vehicleDetails.vehicleType - The type of vehicle.
 * @returns {Promise<Id<"users">>} The ID of the newly created user.
 */
export const createUser = mutation({
  args: {
    clerkUserId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    vehicleDetails: v.object({
      licensePlate: v.string(),
      vehicleType: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    return await createUserModel(
      ctx,
      args.clerkUserId,
      args.firstName,
      args.lastName,
      args.email,
      args.phoneNumber,
      args.vehicleDetails
    );
  },
});

/**
 * Retrieves a user by their ID.
 * @param {object} args - The arguments for retrieving a user.
 * @param {Id<"users">} args.userId - The ID of the user to retrieve.
 * @returns {Promise<UserDataModel>} The user object.
 */
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await getUserByIdModel(ctx, args.userId);
  },
});

/**
 * Retrieves all users.
 * @returns {Promise<UserDataModel[]>} A list of all users.
 */
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await getUsersModel(ctx);
  },
});

/**
 * Updates a user's details by their ID.
 * @param {object} args - The arguments for updating a user.
 * @param {Id<"users">} args.userId - The ID of the user to update.
 * @param {object} args.updates - The fields to update.
 * @param {string} [args.updates.firstName] - The user's updated first name.
 * @param {string} [args.updates.lastName] - The user's updated last name.
 * @param {string} [args.updates.email] - The user's updated email.
 * @param {string} [args.updates.phoneNumber] - The user's updated phone number.
 * @param {object} [args.updates.vehicleDetails] - The user's updated vehicle details.
 */
export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    updates: v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      vehicleDetails: v.optional(
        v.object({
          licensePlate: v.string(),
          vehicleType: v.string(),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    await updateUserModel(ctx, args.userId, args.updates);
  },
});

/**
 * Deletes a user by their ID.
 * @param {object} args - The arguments for deleting a user.
 * @param {Id<"users">} args.userId - The ID of the user to delete.
 */
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await deleteUserModel(ctx, args.userId);
  },
});