export const PARKING_SPACE_MESSAGES = {
  SUCCESS: {
    GET_SUCCESSFUL: "Successfully retrieved parking spaces.",
    CREATE_SUCCESSFUL: "Successfully created a parking space.",
    UPDATE_SUCCESSFUL: "Successfully updated the parking space.",
    DELETE_SUCCESSFUL: "Successfully deleted the parking space.",
  },
  ERROR: {
    GET_FAILED: "Failed to retrieve parking spaces.",
    CREATE_FAILED: "Failed to create a parking space.",
    UPDATE_FAILED: "Failed to update the parking space.",
    DELETE_FAILED: "Failed to delete the parking space.",
    NOT_FOUND: "No parking spaces found.",
    INVALID_INPUT: "The input is invalid.",
    UNKNOWN: "An unknown error occurred.",
  },
} as const;