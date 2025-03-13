import { getAreasByCityService } from "@/services/address.service"
import { NextResponse } from "next/server";

// API to get areas by city
export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");

    // Validate the city
    if (!city) {
      return NextResponse.json(
        { result: false, message: "City name is required" },
        { status: 400 } // 400 Bad Request
      );
    }

    const response = await getAreasByCityService(city);

    if (response.result) {
      return NextResponse.json(response, { status: 200 });
    }
    return NextResponse.json(response, { status: 404 });
  } catch (error) {
    console.error("Failed to get areas:", error);
    return NextResponse.json(
      { result: false, message: "Failed to get areas" },
      { status: 500 }
    );
  }
}