import { NextResponse } from "next/server";
import { createBookingService } from "@/services/booking.service";
import { BookingDataModel } from "@/types/convex.type";
import { getBookingsByUserService } from "@/services/booking.service";

/**
 * Handles POST requests to create a new booking.
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} The HTTP response.
 */
export async function POST(request: Request) {
  try {
    // Parse the request body
    const bookingData: BookingDataModel = await request.json();

    // Call the createBookingService
    const response = await createBookingService(bookingData);

    // Return the response
    if (response.result) {
      return NextResponse.json(response, { state: 201 }); // 201 Created
    } else {
      return NextResponse.json(response, { state: 400 }); // 400 Bad Request
    }
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { result: false, message: "Failed to create booking" },
      { state: 500 } // 500 Internal Server Error
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
        { state: 400 } // 400 Bad Request
      );
    }

    // Call the getBookingsByUserService
    const response = await getBookingsByUserService(userId);

    // Return the response
    if (response.result) {
      return NextResponse.json(response, { state: 200 }); // 200 OK
    } else {
      return NextResponse.json(response, { state: 404 }); // 404 Not Found
    }
  } catch (error) {
    console.error("Failed to fetch bookings by user:", error);
    return NextResponse.json(
      { result: false, message: "Failed to fetch bookings by user" },
      { state: 500 } // 500 Internal Server Error
    );
  }
}