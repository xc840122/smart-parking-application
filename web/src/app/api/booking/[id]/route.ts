import { NextResponse } from "next/server";
import { deleteBookingService } from "@/services/booking.service";

/**
 * Handles DELETE requests to delete a booking by its ID.
 * @param {Request} request - The incoming HTTP request.
 * @param {Object} params - The route parameters.
 * @param {string} params.bookingId - The ID of the booking to delete.
 * @returns {Promise<NextResponse>} The HTTP response.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const bookingId = params.bookingId;

    // Call the deleteBookingService
    const response = await deleteBookingService(bookingId);

    // Return the response
    if (response.result) {
      return NextResponse.json(response, { status: 200 }); // 200 OK
    } else {
      return NextResponse.json(response, { status: 400 }); // 400 Bad Request
    }
  } catch (error) {
    console.error("Failed to delete booking:", error);
    return NextResponse.json(
      { result: false, message: "Failed to delete booking" },
      { status: 500 } // 500 Internal Server Error
    );
  }
}