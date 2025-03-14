import { BOOKING_MESSAGES } from "@/constants/messages/booking.message";
import { PARKING_SPACE_MESSAGES } from "@/constants/messages/parking-space.message"
import { checkBookingConflictService } from "@/services/booking.service";
import { getParkingByIdService } from "@/services/parking.service"
import { ApiResponse } from "@/types/api.type";
import costCalculation from "@/utils/cost.util";
import { bookingCreationSchema, BookingCreationType } from "@/validators/booking.validator";

// Get the total cost and discount rate
export const bookingCostHelper = async (bookingData: BookingCreationType):
  Promise<ApiResponse<{ parkingName: string, totalCost: number, discountRate: number }>> => {
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

  if (!parkingSpace.result || !parkingSpace.data) {
    return { result: false, message: PARKING_SPACE_MESSAGES.ERROR.GET_FAILED };
  }

  // Destructure the parking space data
  const { name, totalSlots, availableSlots, pricePerHour } = parkingSpace.data;
  // Get current parking loading(0-1)
  const occupancyRateString =
    ((totalSlots - availableSlots) / totalSlots).toFixed(2);

  const occupancyRate = parseFloat(occupancyRateString);

  // Calculate total cost (with AI prediction)
  const { totalCost, discountRate } =
    await costCalculation(occupancyRate, pricePerHour, startTime, endTime)

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

  return {
    result: true, message: BOOKING_MESSAGES.SUCCESS.COST_CALCULATION_SUCCESSFUL,
    data: {
      parkingName: name,
      totalCost: totalCost,
      discountRate: discountRate,
    },
  };
}



// Linear model
// export const predictDiscount = async (
//   duration: number,
//   occupancyRate: number,
// ) => {
//   const response = await fetch('http://127.0.0.1:5000/predict', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       duration,
//       occupancy_rate: occupancyRate,
//     }),
//     signal: AbortSignal.timeout(10000),
//   });
//   const data = await response.json();
//   return data.discount_rate;
// };