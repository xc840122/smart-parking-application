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
import { bookingCreationSchema, BookingCreationType, BookingType } from "@/validators/booking.validator";
import { getParkingByIdService } from "./parking.service";
import { PARKING_SPACE_MESSAGES } from "@/constants/messages/parking-space.message";
import costCalculation from "@/utils/cost.util";

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
): Promise<ApiResponse<{ bookingId: string, totalCost: number }>> => {
  try {
    // Extract the booking data
    const { parkingSpaceId, startTime, endTime } = bookingData;

    // Validate the booking data using Zod
    const validationResult = bookingCreationSchema.safeParse(bookingData);

    // Return error if validation fails
    if (!validationResult.success) {
      return {
        result: false,
        message: BOOKING_MESSAGES.ERROR.INVALID_INPUT_FOR_CREATE,
      };
    }

    // Query parking space details
    const parkingSpace = await getParkingByIdService(parkingSpaceId);
    if (!parkingSpace.data) {
      return { result: false, message: PARKING_SPACE_MESSAGES.ERROR.NOT_FOUND };
    }

    // Calculate total cost
    const totalCost = await costCalculation(parkingSpace.data.pricePerHour, startTime, endTime);

    // Conflict check
    const conflictCheck = await checkBookingConflictService(
      bookingData.userId,
      bookingData.startTime,
      bookingData.endTime
    );

    if (conflictCheck.result === false) {
      return { result: false, message: BOOKING_MESSAGES.ERROR.CONFLICTING_BOOKING };
    }

    // Start time must be before end time
    if (bookingData.startTime >= bookingData.endTime) {
      return {
        result: false,
        message: BOOKING_MESSAGES.ERROR.ENDTIME_BEFORE_STARTTIME,
      };
    }

    // Start time must be after current time
    if (bookingData.startTime <= Date.now()) {
      return {
        result: false,
        message: BOOKING_MESSAGES.ERROR.STARTTIME_BEFORE_NOW,
      };
    }

    // Create booking for 24 hours only
    if (bookingData.endTime - bookingData.startTime > 86400000) {
      return {
        result: false,
        message: BOOKING_MESSAGES.ERROR.HOURS_LIMIT,
      };
    }

    // Booking next 7 days only
    if (bookingData.startTime > Date.now() + 604800000) {
      return {
        result: false,
        message: BOOKING_MESSAGES.ERROR.DAYS_LIMIT,
      };
    }

    // Prepare booking data
    const newBookingData: BookingType = {
      ...bookingData,
      parkingName: parkingSpace.data.name,
      totalCost: totalCost,
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
      data: { bookingId: bookingId, totalCost: totalCost },
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