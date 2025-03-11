import { ApiResponse } from "@/types/api.type";
import { parkingSpaceSchema } from "@/validators/parking-space.validator";
import { PARKING_SPACE_MESSAGES } from "@/constants/messages/parking-space.message";
import { createParkingRepo, deleteParkingRepo, getParkingByIdRepo, getParkingRepo, updateParkingRepo } from "@/repositories/parking.repo";
import { ParkingSpaceDataModel } from "@/types/convex.type";

/**
 * Fetches parking data based on filters.
 * @param {boolean} isActive - Whether the parking space is active.
 * @param {string} [city] - The city to filter by.
 * @param {string} [area] - The area to filter by.
 * @param {string} [street] - The street to filter by.
 * @param {string} [keyword] - The keyword to search for in the parking space name.
 * @returns {Promise<ApiResponse<object[]>>} A response containing the list of parking spaces or an error message.
 */
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


/**
 * Creates a new parking space in the database.
 * @param {string} name - The name of the parking space.
 * @param {object} location - The geo-location of the parking space.
 * @param {number} location.lat - The latitude of the parking space.
 * @param {number} location.lng - The longitude of the parking space.
 * @param {string} city - The city where the parking space is located.
 * @param {string} area - The area or district within the city.
 * @param {string} street - The street where the parking space is located.
 * @param {string} unit - The unit identifier for the parking space.
 * @param {number} totalSlots - The total number of parking slots available.
 * @param {number} pricePerHour - The cost of parking per hour.
 * @returns {Promise<ApiResponse<string>>} A response containing the ID of the newly created parking space or an error message.
 */
export const createParkingService = async (
  name: string,
  location: { lat: number; lng: number },
  city: string,
  area: string,
  street: string,
  unit: string,
  totalSlots: number,
  pricePerHour: number,
  isActive: boolean = true, // Default to active
): Promise<ApiResponse<string>> => {
  try {
    // Validate form input
    const result = parkingSpaceSchema.safeParse({
      name,
      location,
      city,
      area,
      street,
      unit,
      totalSlots,
      pricePerHour,
      isActive
    });

    if (!result.success) {
      return { result: false, message: PARKING_SPACE_MESSAGES.ERROR.INVALID_INPUT };
    }

    // Create the parking space
    const parkingSpaceId = await createParkingRepo(
      name,
      location,
      city,
      area,
      street,
      unit,
      totalSlots,
      pricePerHour,
      isActive
    );

    return { result: true, message: PARKING_SPACE_MESSAGES.SUCCESS.CREATE_SUCCESSFUL, data: parkingSpaceId };
  } catch (error) {
    console.error(`Failed to create parking space: ${error}`);
    return { result: false, message: PARKING_SPACE_MESSAGES.ERROR.CREATE_FAILED };
  }
}

/**
 * Updates a parking space's details by its ID.
 * @param {string} id - The ID of the parking space to update.
 * @param {object} updates - The fields to update.
 * @param {string} [updates.name] - The updated name of the parking space.
 * @param {object} [updates.location] - The updated geo-location of the parking space.
 * @param {number} [updates.location.lat] - The updated latitude.
 * @param {number} [updates.location.lng] - The updated longitude.
 * @param {string} [updates.city] - The updated city.
 * @param {string} [updates.area] - The updated area.
 * @param {string} [updates.street] - The updated street.
 * @param {string} [updates.unit] - The updated unit.
 * @param {number} [updates.totalSlots] - The updated total number of slots.
 * @param {number} [updates.pricePerHour] - The updated price per hour.
 * @param {boolean} [updates.isActive] - The updated active status.
 * @returns {Promise<ApiResponse>} A response indicating success or failure.
 */

export const updateParkingService = async (
  id: string,
  updates: {
    name?: string;
    location?: { lat: number; lng: number };
    city?: string;
    area?: string;
    street?: string;
    unit?: string;
    totalSlots?: number;
    pricePerHour?: number;
    isActive?: boolean;
  }
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

/**
 * Deletes a parking space by its ID.
 * @param {string} id - The ID of the parking space to delete.
 * @returns {Promise<ApiResponse>} A response indicating success or failure.
 */
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