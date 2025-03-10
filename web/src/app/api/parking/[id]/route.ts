import { NextResponse } from "next/server";
import { getParkingByIdService } from "@/services/parking.service";
import { ApiResponse } from "@/types/api.type";
import { ParkingSpaceDataModel } from "@/types/parking-space.type";

// GET: Fetch a parking space by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch parking space by ID using the service
    const response: ApiResponse<ParkingSpaceDataModel> = await getParkingByIdService(id);

    // Handle no data found
    if (!response.result) {
      return NextResponse.json({ error: response.message }, { status: 404 });
    }

    // Return success response
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch parking space by ID:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}