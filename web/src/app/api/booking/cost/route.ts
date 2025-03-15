import { USER_MESSAGES } from "@/constants/messages/user.message";
import { bookingCostHelper } from "@/helper/booking.helper";
import { getUserByClerkIdService } from "@/services/user.service";
import { BookingRequestBody } from "@/types/booking.type";
import { BookingCreationType } from "@/validators/booking.validator";
import { NextResponse } from "next/server";

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
    const response = await bookingCostHelper(bookingData);

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