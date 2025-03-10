import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ParkingSpaceDataModel } from "@/types/parking-space.type";

/**
 * Retrieves parking spaces by location (city and area).
 * @param {string} city - The city to search for parking spaces.
 * @param {string} area - The area within the city to search.
 * @returns {Promise<ParkingSpaceDataModel[]>} A list of parking spaces in the specified location.
 * @throws {Error} If the query fails.
 */
export const getParkingSpacesByLocationRepo = async (
  isActive?: boolean,
  keyword?: string,
  city?: string,
  area?: string): Promise<ParkingSpaceDataModel[]> => {
  try {
    return await fetchQuery(api.parking.getParkingSpacesByLocation, {
      isActive,
      keyword,
      city,
      area,
    });
  } catch (error) {
    console.error(`Failed to get parking spaces by location: ${error}`);
    throw new Error("Get parking spaces by location failed");
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
 * @returns {Promise<Id<"parking_spaces">>} The ID of the newly created parking space.
 * @throws {Error} If the mutation fails.
 */
export const createParkingSpaceRepo = async (
  name: string,
  location: { lat: number; lng: number },
  city: string,
  area: string,
  street: string,
  unit: string,
  totalSlots: number,
  pricePerHour: number
): Promise<Id<"parking_spaces">> => {
  try {
    return await fetchMutation(api.parking.createParkingSpace, {
      name,
      location,
      city,
      area,
      street,
      unit,
      totalSlots,
      pricePerHour,
    });
  } catch (error) {
    console.error(`Failed to create parking space: ${error}`);
    throw new Error("Create parking space failed");
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
 * @throws {Error} If the mutation fails.
 */
export const updateParkingSpaceRepo = async (
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
) => {
  try {
    await fetchMutation(api.parking.updateParkingSpace, {
      id: id as Id<"parking_spaces">,
      updates,
    });
  } catch (error) {
    console.error(`Failed to update parking space: ${error}`);
    throw new Error("Update parking space failed");
  }
}

/**
 * Deletes a parking space by its ID.
 * @param {string} id - The ID of the parking space to delete.
 * @throws {Error} If the mutation fails.
 */
export const deleteParkingSpaceRepo = async (id: string) => {
  try {
    await fetchMutation(api.parking.deleteParkingSpace, {
      id: id as Id<"parking_spaces">,
    });
  } catch (error) {
    console.error(`Failed to delete parking space: ${error}`);
    throw new Error("Delete parking space failed");
  }
}
