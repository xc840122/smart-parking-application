import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ParkingSpaceDataModel } from "@/types/convex.type";
import { ParkingSpaceType } from "@/validators/parking-space.validator";

export const getParkingByIdRepo = async (id: string): Promise<ParkingSpaceDataModel | null> => {
  try {
    const parking = await fetchQuery(api.parking.getParkingByIdData, { id });
    return !parking ? null : parking;
  } catch (error) {
    console.error(`Failed to get parking space by ID: ${error}`);
    throw new Error("Get parking space by ID failed");
  }
}

export const getParkingRepo = async (
  isActive: boolean,
  city?: string,
  area?: string,
  street?: string,
  keyword?: string
): Promise<ParkingSpaceDataModel[]> => {
  try {
    const parkingData = await fetchQuery(api.parking.getParkingData, {
      isActive,
      city,
      area,
      street,
      keyword,
    });
    return parkingData;
  } catch (error) {
    console.error("Failed to fetch parking data:", error);
    throw new Error("Failed to fetch parking data");
  }
};

export const createParkingRepo = async (parkingData: ParkingSpaceType): Promise<Id<"parking_spaces">> => {
  try {
    return await fetchMutation(api.parking.createParkingData, {
      parkingData
    }
    );
  } catch (error) {
    console.error(`Failed to create parking space: ${error}`);
    throw new Error("Create parking space failed");
  }
}

export const updateParkingRepo = async (
  id: string,
  update: Partial<ParkingSpaceType>
) => {
  try {
    await fetchMutation(api.parking.updateParkingData, {
      id,
      update,
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
export const deleteParkingRepo = async (id: string) => {
  try {
    await fetchMutation(api.parking.deleteParkingData, {
      id,
    });
  } catch (error) {
    console.error(`Failed to delete parking space: ${error}`);
    throw new Error("Delete parking space failed");
  }
}
