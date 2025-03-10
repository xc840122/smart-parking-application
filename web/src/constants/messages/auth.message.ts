export const AUTH_MESSAGES = {
  SUCCESS: {
    VERIFICATION_SUCCESSFUL: "Verification successful!",
    LOGIN: "Login successful!",
    LOGOUT: "You have been logged out.",
  },
  ERROR: {
    CODE_NOT_FOUND: "The verification information doesn't exist.",
    INVALID_CODE: "The verification code is invalid.",
    CLASSROOM_NOT_MATCH: "The classroom doesn't match.",
    UNKNOWN: "An unknown error occurred.",
  },
} as const;
