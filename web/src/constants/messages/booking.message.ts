// constants/messages/booking.message.ts
export const BOOKING_MESSAGES = {
  SUCCESS: {
    CREATE_SUCCESSFUL: "Booking created successfully",
    UPDATE_SUCCESSFUL: "Booking updated successfully",
    DELETE_SUCCESSFUL: "Booking deleted successfully",
    GET_SUCCESSFUL: "Bookings retrieved successfully",
    NO_CONFLICT: "No conflicting booking found",
  },
  ERROR: {
    USER_NOT_SAME: "User is not the same as the booking user",
    INVALID_INPUT_FOR_CREATE: "Invalid input data for booking creation",
    INVALID_INPUT_FOR_CONFLICT_CHECK: "Invalid input data for conflict check",
    INVALID_BOOKING_STATUS: "Invalid booking status",
    NOT_FOUND: "Booking not found",
    CREATE_FAILED: "Failed to create booking",
    UPDATE_FAILED: "Failed to update booking",
    DELETE_FAILED: "Failed to delete booking",
    GET_FAILED: "Failed to retrieve bookings",
    CONFLICTING_BOOKING: "Conflicting booking exists",
    USER_NOT_FOUND: "User not found",
    PARKING_SPACE_NOT_AVAILABLE: "Parking space is not available",
    ENDTIME_BEFORE_STARTTIME: "End time must be after start time",
    STARTTIME_BEFORE_NOW: "Start time must be after current time",
    HOURS_LIMIT: "Invalid time range,24-hour booking only",
    DAYS_LIMIT: "Invalid time range,7-day booking only",
    RESERVED_BOOKING_STATE_ERROR: "Reserved booking state is not corrent",
  },
};