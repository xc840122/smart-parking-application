import { getCitiesService } from "@/services/address.service"
import { NextResponse } from "next/server";

// API to get cities
export const GET = async () => {
  try {
    const response = await getCitiesService();
    if (response.result) {
      return NextResponse.json(response, { state: 200 });
    }
    return NextResponse.json(response, { state: 404 });
  } catch (error) {
    console.error("Failed to get cities:", error);
    return NextResponse.json(
      { result: false, message: "Failed to get cities" },
      { state: 500 }
    );
  }
}