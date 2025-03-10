import { NextResponse } from "next/server";
import { getParkingService } from "@/services/parking.service";
import { ApiResponse } from "@/types/api.type";
import { ParkingSpaceDataModel } from "@/types/parking-space.type";

// GET: Fetch parking spaces by filters
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const isActive = searchParams.get("isActive") === "true";
    const city = searchParams.get("city") || undefined;
    const area = searchParams.get("area") || undefined;
    const street = searchParams.get("street") || undefined;
    const keyword = searchParams.get("keyword") || undefined;

    // Fetch parking spaces using the service
    const response: ApiResponse<ParkingSpaceDataModel[]> = await getParkingService(
      isActive,
      city,
      area,
      street,
      keyword
    );

    // Handle no data found
    if (!response.result) {
      return NextResponse.json({ error: response.message }, { status: 404 });
    }

    // Return success response
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch parking data:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}