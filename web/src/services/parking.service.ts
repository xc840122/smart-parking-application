import { ApiResponse } from "@/types/api.type";
import { parkingSpaceSchema, ParkingSpaceType } from "@/validators/parking-space.validator";
import { PARKING_SPACE_MESSAGES } from "@/constants/messages/parking-space.message";
import { createParkingRepo, deleteParkingRepo, getParkingByIdRepo, getParkingRepo, updateParkingRepo } from "@/repositories/parking.repo";
import { ParkingSpaceDataModel } from "@/types/convex.type";

export const getParkingService = async (
  isActive: boolean,
  city?: string,
  area?: string,
  street?: string,
  keyword?: string
): Promise<ApiResponse<ParkingSpaceDataModel[]>> => {
  try {
    // Fetch parking data from the repository
    const parkingData = await getParkingRepo(isActive, city, area, street, keyword);

    // Return error if no parking spaces are found
    if (!parkingData || parkingData.length === 0) {
      return { result: false, message: PARKING_SPACE_MESSAGES.ERROR.NOT_FOUND };
    }

    // Return success response with parking data
    return { result: true, message: PARKING_SPACE_MESSAGES.SUCCESS.GET_SUCCESSFUL, data: parkingData };
  } catch (error) {
    console.error("Failed to fetch parking data:", error);
    return { result: false, message: PARKING_SPACE_MESSAGES.ERROR.GET_FAILED };
  }
};

export const getParkingByIdService = async (id: string): Promise<ApiResponse<ParkingSpaceDataModel>> => {
  try {
    const parkingSpace = await getParkingByIdRepo(id);
    if (!parkingSpace) {
      return { result: false, message: PARKING_SPACE_MESSAGES.ERROR.NOT_FOUND };
    } else {
      return { result: true, message: PARKING_SPACE_MESSAGES.SUCCESS.GET_SUCCESSFUL, data: parkingSpace };
    }
  } catch (error) {
    console.error(`Failed to get parking space by ID: ${error}`);
    return { result: false, message: PARKING_SPACE_MESSAGES.ERROR.GET_FAILED };
  }
}

export const createParkingService = async (
  parkingData: ParkingSpaceType
): Promise<ApiResponse<string>> => {
  try {
    // Validate form input
    const result = parkingSpaceSchema.safeParse(parkingData);

    if (!result.success) {
      return { result: false, message: PARKING_SPACE_MESSAGES.ERROR.INVALID_INPUT };
    }

    // Create the parking space
    const parkingSpaceId = await createParkingRepo(parkingData);

    return { result: true, message: PARKING_SPACE_MESSAGES.SUCCESS.CREATE_SUCCESSFUL, data: parkingSpaceId };
  } catch (error) {
    console.error(`Failed to create parking space: ${error}`);
    return { result: false, message: PARKING_SPACE_MESSAGES.ERROR.CREATE_FAILED };
  }
}


export const updateParkingService = async (
  id: string,
  updates: Partial<ParkingSpaceType>
): Promise<ApiResponse> => {
  try {
    // Validate form input
    const result = parkingSpaceSchema.safeParse(updates);

    if (!result.success) {
      return { result: false, message: PARKING_SPACE_MESSAGES.ERROR.INVALID_INPUT };
    }

    // Update the parking space
    await updateParkingRepo(id, updates);

    return { result: true, message: PARKING_SPACE_MESSAGES.SUCCESS.UPDATE_SUCCESSFUL };
  } catch (error) {
    console.error(`Failed to update parking space: ${error}`);
    return { result: false, message: PARKING_SPACE_MESSAGES.ERROR.UPDATE_FAILED };
  }
}

export const deleteParkingService = async (id: string): Promise<ApiResponse> => {
  try {
    // Delete the parking space
    await deleteParkingRepo(id);

    return { result: true, message: PARKING_SPACE_MESSAGES.SUCCESS.DELETE_SUCCESSFUL };
  } catch (error) {
    console.error(`Failed to delete parking space: ${error}`);
    return { result: false, message: PARKING_SPACE_MESSAGES.ERROR.DELETE_FAILED };
  }
}