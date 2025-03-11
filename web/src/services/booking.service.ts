// services/booking.service.ts
import { ApiResponse } from "@/types/api.type";
import { BookingDataModel } from "@/types/convex.type";
import { BOOKING_MESSAGES } from "@/constants/messages/booking.message";
import {
  getBookingsByUserRepo,
  createBookingRepo,
  deleteBookingRepo,
  checkBookingConflictRepo,
} from "@/repositories/booking.repo";
import { bookingCreationSchema } from "@/validators/booking.validator";

export const checkBookingConflictService = async (
  userId: string,
  startTime: number,
  endTime: number
): Promise<ApiResponse<boolean>> => {
  try {
    // Validate input
    if (!userId || !startTime || !endTime) {
      return {
        result: false,
        message: BOOKING_MESSAGES.ERROR.INVALID_INPUT,
      };
    }

    // Check for conflicting bookings
    const conflictExists = await checkBookingConflictRepo(userId, startTime, endTime);
    return conflictExists && conflictExists.length > 0
      ? { result: false, message: BOOKING_MESSAGES.ERROR.CONFLICTING_BOOKING }
      : { result: true, message: BOOKING_MESSAGES.SUCCESS.NO_CONFLICT };

  } catch (error) {
    console.error("Failed to check booking conflict:", error);
    throw new Error(BOOKING_MESSAGES.ERROR.GET_FAILED);
  }
};

export const createBookingService = async (
  bookingData: BookingDataModel
): Promise<ApiResponse<string>> => {
  try {
    // Validate the booking data using Zod
    const validationResult = bookingCreationSchema.safeParse(bookingData);

    // Return error if validation fails
    if (!validationResult.success) {
      return {
        result: false,
        message: BOOKING_MESSAGES.ERROR.INVALID_INPUT,
      };
    }
    // Conflict check
    const conflictCheck = await checkBookingConflictService(
      bookingData.userId,
      bookingData.startTime,
      bookingData.endTime
    );
    if (conflictCheck.result === false) {
      return { result: false, message: BOOKING_MESSAGES.ERROR.CONFLICTING_BOOKING };
    }

    // Create the booking,default status is pending
    const bookingId = await createBookingRepo({ ...bookingData, status: "pending" });

    return {
      result: true,
      message: BOOKING_MESSAGES.SUCCESS.CREATE_SUCCESSFUL,
      data: bookingId,
    };
  } catch (error) {
    console.error("Failed to create booking:", error);
    throw new Error(BOOKING_MESSAGES.ERROR.CREATE_FAILED);
  }
};

export const getBookingsByUserService = async (
  userId: string
): Promise<ApiResponse<BookingDataModel[]>> => {
  try {
    // Fetch bookings by user ID
    const bookings = await getBookingsByUserRepo(userId);

    // Return error if no bookings are found
    if (!bookings || bookings.length === 0) {
      return { result: false, message: BOOKING_MESSAGES.ERROR.NOT_FOUND };
    }

    // Return success response with bookings
    return {
      result: true,
      message: BOOKING_MESSAGES.SUCCESS.GET_SUCCESSFUL,
      data: bookings,
    };
  } catch (error) {
    console.error("Failed to fetch bookings by user:", error);
    throw new Error(BOOKING_MESSAGES.ERROR.GET_FAILED);
  }
};

export const deleteBookingService = async (
  bookingId: string
): Promise<ApiResponse> => {
  try {
    // Delete the booking
    await deleteBookingRepo(bookingId);

    return { result: true, message: BOOKING_MESSAGES.SUCCESS.DELETE_SUCCESSFUL };
  } catch (error) {
    console.error("Failed to delete booking:", error);
    throw new Error(BOOKING_MESSAGES.ERROR.DELETE_FAILED);
  }
};

// export const updateBookingStatusService = async (
//   bookingId: string,
//   status: BookingType
// ): Promise<ApiResponse> => {
//   try {
//     // Update the booking status
//     await updateBookingStatusRepo(bookingId, status);

//     return { result: true, message: BOOKING_MESSAGES.SUCCESS.UPDATE_SUCCESSFUL };
//   } catch (error) {
//     console.error("Failed to update booking status:", error);
//     throw new Error(BOOKING_MESSAGES.ERROR.UPDATE_FAILED);
//   }
// };