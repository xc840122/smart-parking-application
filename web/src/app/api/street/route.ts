import { getStreetsByAreaService } from "@/services/address.service"
import { NextResponse } from "next/server";

// API to get steets by area
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");

    // Validate the city
    if (!area) {
      return NextResponse.json(
        { result: false, message: "Area name is required" },
        { status: 400 } // 400 Bad Request
      );
    }

    const response = await getStreetsByAreaService(area);

    if (response.result) {
      return NextResponse.json(response, { status: 200 });
    }
    return NextResponse.json(response, { status: 404 });
  } catch (error) {
    console.error("Failed to get streets:", error);
    return NextResponse.json(
      { result: false, message: "Failed to get streets" },
      { status: 500 }
    );
  }
}