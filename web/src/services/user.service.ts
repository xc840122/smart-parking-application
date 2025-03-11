// services/user.service.ts
import { ApiResponse } from "@/types/api.type";
import { UserDataModel } from "@/types/convex.type";
import { getUserByClerkIdRepo } from "@/repositories/user.repo";
import { USER_MESSAGES } from "@/constants/messages/user.message";

/**
 * Fetches a user by their Clerk user ID.
 * @param {string} clerkUserId - The Clerk user ID.
 * @returns {Promise<ApiResponse<UserDataModel>>} A response containing the user data or an error message.
 */
export const getUserByClerkIdService = async (clerkUserId: string): Promise<ApiResponse<UserDataModel>> => {
  try {
    // Validate the Clerk user ID
    if (!clerkUserId) {
      return {
        result: false,
        message: USER_MESSAGES.ERROR.CLERK_USER_NOT_FOUND,
      };
    }
    // Fetch the user by Clerk user ID
    const user = await getUserByClerkIdRepo(clerkUserId);

    // Return error if user is not found
    if (!user) {
      return { result: false, message: USER_MESSAGES.ERROR.GET_USER_FAILED };
    }

    // Return success response with user data
    return {
      result: true,
      message: USER_MESSAGES.SUCCESS.GET_USER_SUCCESSFUL,
      data: user,
    };
  } catch (error) {
    console.error("Failed to fetch user by Clerk ID:", error);
    return { result: false, message: USER_MESSAGES.ERROR.UNKONWN_ERROR };
  }
};