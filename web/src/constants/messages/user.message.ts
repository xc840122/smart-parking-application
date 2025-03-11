export const USER_MESSAGES = {
  SUCCESS: {
    GET_USER_SUCCESSFUL: "User data fetched successfully.",
  },
  ERROR: {
    GET_USER_FAILED: "Failed to fetch user data.",
    CLERK_USER_NOT_FOUND: "Clerk user not found.",
    UNKONWN_ERROR: "An unknown error occurred.",
  },
} as const;
