import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { UserDataModel } from "@/types/auth.type";

/**
 * Retrieves a user by their ID.
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<UserDataModel | null>} The user object, or null if not found.
 * @throws {Error} If the query fails.
 */
export const getUserByIdRepo = async (userId: string): Promise<UserDataModel | null> => {
  try {
    const user = await fetchQuery(api.user.getUserById, {
      userId: userId as Id<"users">,
    });
    return user;
  } catch (error) {
    console.error(`Failed to get user by ID: ${error}`);
    throw new Error("Get user by ID failed");
  }
}

/**
 * Creates a new user in the database.
 * @param {string} clerkUserId - The unique Clerk user ID.
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @param {string} email - The user's email address.
 * @param {string} phoneNumber - The user's phone number.
 * @param {object} vehicleDetails - The user's vehicle details.
 * @param {string} vehicleDetails.licensePlate - The vehicle's license plate.
 * @param {string} vehicleDetails.vehicleType - The type of vehicle.
 * @returns {Promise<Id<"users">>} The ID of the newly created user.
 * @throws {Error} If the mutation fails.
 */
export const createUserRepo = async (
  clerkUserId: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  vehicleDetails: { licensePlate: string; vehicleType: string }
): Promise<string> => {
  try {
    return await fetchMutation(api.user.createUser, {
      clerkUserId,
      firstName,
      lastName,
      email,
      phoneNumber,
      vehicleDetails,
    });
  } catch (error) {
    console.error(`Failed to create user: ${error}`);
    throw new Error("Create user failed");
  }
}

/**
 * Updates a user's details by their ID.
 * @param {string} userId - The ID of the user to update.
 * @param {object} updates - The fields to update.
 * @param {string} [updates.firstName] - The user's updated first name.
 * @param {string} [updates.lastName] - The user's updated last name.
 * @param {string} [updates.email] - The user's updated email.
 * @param {string} [updates.phoneNumber] - The user's updated phone number.
 * @param {object} [updates.vehicleDetails] - The user's updated vehicle details.
 * @throws {Error} If the mutation fails.
 */
export const updateUserRepo = async (
  userId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    vehicleDetails?: { licensePlate: string; vehicleType: string };
  }
) => {
  try {
    await fetchMutation(api.user.updateUser, {
      userId: userId as Id<"users">,
      updates,
    });
  } catch (error) {
    console.error(`Failed to update user: ${error}`);
    throw new Error("Update user failed");
  }
}

/**
 * Deletes a user by their ID.
 * @param {string} userId - The ID of the user to delete.
 * @throws {Error} If the mutation fails.
 */
export const deleteUserRepo = async (userId: string) => {
  try {
    await fetchMutation(api.user.deleteUser, {
      userId: userId as Id<"users">,
    });
  } catch (error) {
    console.error(`Failed to delete user: ${error}`);
    throw new Error("Delete user failed");
  }
}