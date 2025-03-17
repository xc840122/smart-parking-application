import { ApiResponse } from "@/types/api.type";
import { BookingDataModel } from "@/types/convex.type";
import { BOOKING_MESSAGES } from "@/constants/messages/booking.message";
import {
  getBookingsByUserRepo,
  createBookingRepo,
  deleteBookingRepo,
  checkBookingConflictRepo,
  getBookingByIdRepo,
  confirmBookingRepo,
} from "@/repositories/booking.repo";
import { BookingCreationType, BookingType } from "@/validators/booking.validator";
import { bookingCostHelper } from "@/helper/booking.helper";

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
        message: BOOKING_MESSAGES.ERROR.INVALID_INPUT_FOR_CONFLICT_CHECK,
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
  bookingData: BookingCreationType
): Promise<ApiResponse<{ bookingId: string, dicountRate: number, totalCost: number }>> => {
  try {
    // Get the total cost and discount rate
    const result = await bookingCostHelper(bookingData);

    if (!result || !result.data) {
      return { result: false, message: result.message };
    }
    const { parkingName, totalCost, discountRate } = result.data;

    // Conflict check
    const conflictCheck = await checkBookingConflictService(
      bookingData.userId,
      bookingData.startTime,
      bookingData.endTime
    );

    if (conflictCheck.result === false) {
      return { result: false, message: BOOKING_MESSAGES.ERROR.CONFLICTING_BOOKING };
    }

    // if (!parkingName || !totalCost || discountRate === null || discountRate === undefined) {
    //   return {
    //     result: false,
    //     message: BOOKING_MESSAGES.ERROR.COST_HANDELING_ERROR,
    //   };
    // }
    // Prepare booking data
    const newBookingData: BookingType = {
      ...bookingData,
      parkingName: parkingName,
      totalCost: totalCost,
      discountRate: discountRate,
      state: "pending",
      updatedAt: new Date().getTime(),
    };

    // Create the booking,default state is pending
    const bookingId = await createBookingRepo(newBookingData);
    if (!bookingId) {
      return { result: false, message: BOOKING_MESSAGES.ERROR.CREATE_FAILED };
    }

    return {
      result: true,
      message: BOOKING_MESSAGES.SUCCESS.CREATE_SUCCESSFUL,
      data: { bookingId: bookingId, dicountRate: discountRate, totalCost: totalCost },
    };
  } catch (error) {
    console.error("Failed to create booking:", error);
    throw new Error(BOOKING_MESSAGES.ERROR.CREATE_FAILED);
  }
};

// Confirm booking service
export const confirmBookingService = async (
  bookingId: string,
  update: { userId: string, state: string }
): Promise<ApiResponse> => {
  try {
    // Get booking by ID
    const booking = await getBookingByIdRepo(bookingId);
    // Check reserved booking state
    if (!booking || !booking.state) {
      throw new Error(BOOKING_MESSAGES.ERROR.NOT_FOUND);
    } else if (booking.state !== "pending") {
      throw new Error(BOOKING_MESSAGES.ERROR.INVALID_BOOKING_STATUS);
    }

    // Check if user is same as user in booking
    if (update.userId !== booking.userId) {
      throw new Error(BOOKING_MESSAGES.ERROR.USER_NOT_SAME);
    }

    // Todo: update available parking space

    // Update the booking state
    await confirmBookingRepo(bookingId, update);

    return { result: true, message: BOOKING_MESSAGES.SUCCESS.UPDATE_SUCCESSFUL };
  } catch (error) {
    console.error("Failed to confirm booking:", error);
    throw new Error(BOOKING_MESSAGES.ERROR.UPDATE_FAILED);
  }
}

// Get bookings by user ID
export const getBookingsByUserService = async (
  userId: string
): Promise<ApiResponse<BookingDataModel[] | []>> => {
  try {
    // Fetch bookings by user ID
    const bookings = await getBookingsByUserRepo(userId);

    // Return error if no bookings are found
    if (!bookings || bookings.length === 0) {
      return { result: false, message: BOOKING_MESSAGES.ERROR.NOT_FOUND, data: [] };
    }

    // Return success response with bookings
    return {
      result: true,
      message: BOOKING_MESSAGES.SUCCESS.GET_SUCCESSFUL,
      data: bookings,
    };
  } catch (error) {
    console.error("Service Failed to fetch bookings by user:", error);
    throw new Error(BOOKING_MESSAGES.ERROR.GET_FAILED);
  }
};

export const getBookingByIdService = async (id: string): Promise<ApiResponse<BookingDataModel>> => {
  try {
    const booking = await getBookingByIdRepo(id);
    if (!booking) {
      return { result: false, message: BOOKING_MESSAGES.ERROR.NOT_FOUND };
    } else {
      return { result: true, message: BOOKING_MESSAGES.SUCCESS.GET_SUCCESSFUL, data: booking };
    }
  } catch (error) {
    console.error(`Failed to get booking by ID: ${error}`);
    return { result: false, message: BOOKING_MESSAGES.ERROR.GET_FAILED };
  }
}

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

// export const updateBookingService = async (
//   bookingId: string,
//   update: Partial<BookingType>
// ): Promise<ApiResponse> => {
//   try {
//     // Update the booking state
//     await updateBookingStateRepo(bookingId, update);

//     return { result: true, message: BOOKING_MESSAGES.SUCCESS.UPDATE_SUCCESSFUL };
//   } catch (error) {
//     console.error("Failed to update booking:", error);
//     throw new Error(BOOKING_MESSAGES.ERROR.UPDATE_FAILED);
//   }
// };