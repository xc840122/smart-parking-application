export const NOTICE_MESSAGES = {
  SUCCESS: {
    GETTING_NOTICE_SUCCESSFUL: "Successfully get the noticeS.",
    UPDATE_NOTICE_SUCCESSFUL: "Successfully update the notice.",
    DELETE_NOTICE_SUCCESSFUL: "Successfully delete the notice.",
    CREATE_NOTICE_SUCCESSFUL: "Successfully create the notice.",
  },
  ERROR: {
    GETTING_NOTICE_FAILED: "Failed to get the notice.",
    UPDATE_NOTICE_FAILED: "Failed to update the notice.",
    DELETE_NOTICE_FAILED: "Failed to delete the notice.",
    CREATE_NOTICE_FAILED: "Failed to create the notice.",
    NOTICE_NOT_FOUND: "The notice information doesn't exist.",
    INVALID_INPUT: "The input is invalid.",
    INVALID_SEARTCH_INPUT: "Please input valid characters,suport a-z,A-Z,0-9",
    UNKNOWN: "An unknown error occurred.",
  },
} as const;
