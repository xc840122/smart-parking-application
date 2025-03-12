import { NextResponse } from "next/server";
import { getParkingByIdService } from "@/services/parking.service";
import { ApiResponse } from "@/types/api.type";
import { ParkingSpaceDataModel } from "@/types/convex.type";

// GET: Fetch a parking space by ID
export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;

    // Fetch parking space by ID using the service
    const response: ApiResponse<ParkingSpaceDataModel> = await getParkingByIdService(id);

    // Handle no data found
    if (!response.result) {
      return NextResponse.json({ error: response.message }, { state: 404 });
    }

    // Return success response
    return NextResponse.json(response, { state: 200 });
  } catch (error) {
    console.error("Failed to fetch parking space by ID:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { state: 500 }
    );
  }
}