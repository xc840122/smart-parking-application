import { NextResponse } from "next/server";
import { createBookingService, getBookingsByUserService } from "@/services/booking.service";
import { BookingCreationType } from "@/validators/booking.validator";
import { getUserByClerkIdService } from "@/services/user.service";
import { USER_MESSAGES } from "@/constants/messages/user.message";

type BookingRequestBody = {
  clerkUserId: string;
  startTime: number;
  endTime: number;
  parkingSpaceId: string;
};
/**
 * Reserved booking{POST} - Create a new booking.start time, end time, parking space ID are required.
 * @param request 
 * @param params 
 * @returns 
 */
export const POST = async (request: Request) => {
  try {
    // Parse request body
    const body: BookingRequestBody = await request.json();
    const { clerkUserId, startTime, endTime, parkingSpaceId } = body;

    // Validate required fields
    if (!startTime || !endTime || !parkingSpaceId || !clerkUserId) {
      return NextResponse.json(
        { result: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the user ID from heaeders
    const user = await getUserByClerkIdService(clerkUserId);

    if (!user) {
      return NextResponse.json(
        { result: false, message: USER_MESSAGES.ERROR.GET_USER_FAILED },
        { status: 404 }
      );
    }

    // Prepare booking data
    const bookingData: BookingCreationType = {
      userId: user.data?._id as string,
      parkingSpaceId: parkingSpaceId,
      startTime: startTime,
      endTime: endTime,
    };

    // Create booking
    const response = await createBookingService(bookingData);

    if (response.result) {
      return NextResponse.json(
        { result: true, message: "Booking created successfully", data: response.data },
        { status: 201 }
      );
    } else {
      return NextResponse.json(response, { status: 400 });
    }
  } catch (error) {
    console.error("Failed to reserve booking:", error);
    return NextResponse.json(
      { result: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handles GET requests to fetch bookings by user ID.
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} The HTTP response.
 */
export async function GET(request: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Validate the userId
    if (!userId) {
      return NextResponse.json(
        { result: false, message: "User ID is required" },
        { status: 400 } // 400 Bad Request
      );
    }

    // Call the getBookingsByUserService
    const response = await getBookingsByUserService(userId);

    // Return the response
    if (response.result) {
      return NextResponse.json(response, { status: 200 }); // 200 OK
    } else {
      return NextResponse.json(response, { status: 404 }); // 404 Not Found
    }
  } catch (error) {
    console.error("Failed to fetch bookings by user:", error);
    return NextResponse.json(
      { result: false, message: "Failed to fetch bookings by user" },
      { status: 500 } // 500 Internal Server Error
    );
  }
}