import { UserDataModel } from "@/types/convex.type";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

// Query user by clerk user ID
export const getUserByClerkIdModel = async (
  ctx: QueryCtx,
  clerkUserId: string
): Promise<UserDataModel> => {
  try {
    if (!clerkUserId) {
      throw new Error("Invalid input: Clerk user ID is required");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Failed to get user by Clerk ID:", error);
    throw new Error("Query failed");
  }
};

/**
 * Creates a new user in the database.
 * @param {MutationCtx} ctx - The Convex mutation context.
 * @param {string} clerkUserId - The unique Clerk user ID.
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @param {string} email - The user's email address.
 * @param {string} phoneNumber - The user's phone number.
 * @param {object} vehicleDetails - The user's vehicle details.
 * @param {string} vehicleDetails.licensePlate - The vehicle's license plate.
 * @param {string} vehicleDetails.vehicleType - The type of vehicle.
 * @returns {Promise<Id<"users">>} The ID of the newly created user.
 * @throws {Error} If required fields are missing, email/phone is invalid, or user already exists.
 */
export const createUserModel = async (
  ctx: MutationCtx,
  clerkUserId: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  vehicleDetails: { licensePlate: string; vehicleType: string }
): Promise<Id<"users">> => {
  try {
    // Validate required fields
    if (!clerkUserId || !firstName || !lastName || !email || !phoneNumber || !vehicleDetails) {
      throw new Error("Invalid input: Missing required fields");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Validate phone number format
    const phoneRegex = /^\d{9,10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error("Invalid phone number format");
    }

    // Check if user already exists with the same email or clerkUserId
    const existingUserByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingUserByEmail) {
      throw new Error("User with this email already exists");
    }

    const existingUserByClerkId = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (existingUserByClerkId) {
      throw new Error("User with this Clerk ID already exists");
    }

    // Create the user
    return await ctx.db.insert("users", {
      clerkUserId,
      firstName,
      lastName,
      email,
      phoneNumber,
      vehicleDetails,
    });
  } catch (error) {
    console.error("Failed to create user:", error);
    throw new Error("User creation failed");
  }
};

/**
 * Retrieves a user by their ID.
 * @param {QueryCtx} ctx - The Convex query context.
 * @param {Id<"users">} userId - The ID of the user to retrieve.
 * @returns {Promise<UserDataModel>} The user object.
 * @throws {Error} If the user ID is invalid or the user is not found.
 */
export const getUserByIdModel = async (
  ctx: QueryCtx,
  userId: Id<"users">
): Promise<UserDataModel> => {
  try {
    if (!userId) {
      throw new Error("Invalid input: User ID is required");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Failed to get user by ID:", error);
    throw new Error("Query failed");
  }
};

/**
 * Retrieves all users from the database.
 * @param {QueryCtx} ctx - The Convex query context.
 * @returns {Promise<object[]>} A list of all users.
 * @throws {Error} If the query fails.
 */
export const getUsersModel = async (ctx: QueryCtx): Promise<object[]> => {
  try {
    return await ctx.db.query("users").collect();
  } catch (error) {
    console.error("Failed to get users:", error);
    throw new Error("Query failed");
  }
};

/**
 * Updates a user's details by their ID.
 * @param {MutationCtx} ctx - The Convex mutation context.
 * @param {Id<"users">} userId - The ID of the user to update.
 * @param {object} updates - The fields to update.
 * @param {string} [updates.firstName] - The user's updated first name.
 * @param {string} [updates.lastName] - The user's updated last name.
 * @param {string} [updates.email] - The user's updated email.
 * @param {string} [updates.phoneNumber] - The user's updated phone number.
 * @param {object} [updates.vehicleDetails] - The user's updated vehicle details.
 * @throws {Error} If the user ID is invalid, email/phone is invalid, or update fails.
 */
export const updateUserModel = async (
  ctx: MutationCtx,
  userId: Id<"users">,
  updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    vehicleDetails?: { licensePlate: string; vehicleType: string };
  }
): Promise<void> => {
  try {
    if (!userId) {
      throw new Error("Invalid input: User ID is required");
    }

    // Validate email format if provided
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        throw new Error("Invalid email format");
      }
    }

    // Validate phone number format if provided
    if (updates.phoneNumber) {
      const phoneRegex = /^\d{9,10}$/;
      if (!phoneRegex.test(updates.phoneNumber)) {
        throw new Error("Invalid phone number format");
      }
    }

    // Update the user
    await ctx.db.patch(userId, updates);
  } catch (error) {
    console.error("Failed to update user:", error);
    throw new Error("Update failed");
  }
};

/**
 * Deletes a user by their ID.
 * @param {MutationCtx} ctx - The Convex mutation context.
 * @param {Id<"users">} userId - The ID of the user to delete.
 * @throws {Error} If the user ID is invalid or deletion fails.
 */
export const deleteUserModel = async (
  ctx: MutationCtx,
  userId: Id<"users">
): Promise<void> => {
  try {
    if (!userId) {
      throw new Error("Invalid input: User ID is required");
    }

    // Check if the user exists
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Delete the user
    await ctx.db.delete(userId);
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw new Error("Delete failed");
  }
};