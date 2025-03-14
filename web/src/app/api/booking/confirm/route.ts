import { USER_MESSAGES } from "@/constants/messages/user.message";
import { confirmBookingService } from "@/services/booking.service";
import { getUserByClerkIdService } from "@/services/user.service";
import { NextResponse } from "next/server";

// Confirm a booking
export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json();
    // Get params from request body
    const { clerkUserId, bookingId } = body;
    if (!clerkUserId) {
      return NextResponse.json(
        { result: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user ID from heaeders
    const user = await getUserByClerkIdService(clerkUserId);

    if (!user || !user.data?._id) {
      return NextResponse.json(
        { result: false, message: USER_MESSAGES.ERROR.GET_USER_FAILED },
        { status: 404 }
      );
    }

    const response = await confirmBookingService(bookingId, {
      userId: user.data?._id as string,
      state: "confirmed",
    });

    // Return error if update failed
    if (!response.result) {
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json(
      response,
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to confirm booking:", error);
    return NextResponse.json(
      { result: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
