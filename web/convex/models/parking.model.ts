import { ParkingSpaceDataModel } from "@/types/parking-space.type";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { searchInputSchema } from "@/validators/parking-space.validator";
import { ITEM_PER_PAGE } from "@/lib/settings";

/**
 * Creates a new parking space in the database.
 * @param {MutationCtx} ctx - The Convex mutation context.
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
 * @throws {Error} If required fields are missing or invalid.
 */
export const createParkingSpaceModel = async (
  ctx: MutationCtx,
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
    // Validate required fields
    if (!name || !location || !city || !area || !street || !unit || !totalSlots || !pricePerHour) {
      throw new Error("Invalid input: Missing required fields");
    }

    // Create the parking space
    return await ctx.db.insert("parking_spaces", {
      name,
      location,
      city,
      area,
      street,
      unit,
      totalSlots,
      availableSlots: totalSlots,
      pricePerHour,
      isActive: true,
    });
  } catch (error) {
    console.error("Failed to create parking space:", error);
    throw new Error("Parking space creation failed");
  }
};

/**
 * Retrieves parking spaces by location (city and area).
 * @param {QueryCtx} ctx - The Convex query context.
 * @param {string} city - The city to search for parking spaces.
 * @param {string} area - The area within the city to search.
 * @returns {Promise<ParkingSpaceDataModel[]>} A list of parking spaces in the specified location.
 * @throws {Error} If the query fails.
 */
export const getParkingSpacesByLocationModel = async (
  ctx: QueryCtx,
  isActive?: boolean,//By default get only active parking spaces
  city?: string,
  area?: string,
  street?: string,
  keyword?: string,
  page?: number,
): Promise<ParkingSpaceDataModel[]> => {
  try {
    // Calculate the start index for pagination
    // const offset = page ? (page - 1) * ITEM_PER_PAGE : 0;

    // Get the key at the offset position
    // const { key } = await yourTableAggregate.at(ctx, offset);
    // For search
    if (keyword) {
      //Validate keyword
      const result = searchInputSchema.safeParse({ keyword: keyword });
      const validKeyword = result.success ? result.data.keyword : null;
      if (!validKeyword) {
        throw new Error(`Invalid keyword: ${keyword}`);
      }
      const parkings = await ctx.db
        .query("parking_spaces")
        .withSearchIndex("search_name", q =>
          q
            .search("name", validKeyword)
            .eq("isActive", isActive ?? true)
        )
        .collect();
      return parkings.sort((a, b) => b._creationTime - a._creationTime);
    } else if (city && area && street) {
      // For filter by city and area
      return await ctx.db
        .query("parking_spaces")
        .withIndex("by_city_area_street_isActive", (q) =>
          q
            .eq("city", city)
            .eq("area", area)
            .eq("street", street)
            .eq("isActive", isActive ?? true)
        )
        .order("desc")
        .collect();
    } else {
      // For all parking spaces
      return await ctx.db
        .query("parking_spaces")
        .withIndex("is_active", (q) => q.eq("isActive", isActive ?? true))
        .order("desc")
        .collect();
    }
  } catch (error) {
    console.error("Failed to get parking spaces by location:", error);
    throw new Error("Query failed");
  }
};

/**
 * Updates a parking space's details by its ID.
 * @param {MutationCtx} ctx - The Convex mutation context.
 * @param {Id<"parking_spaces">} id - The ID of the parking space to update.
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
 * @throws {Error} If the parking space ID is invalid or update fails.
 */
export const updateParkingSpaceModel = async (
  ctx: MutationCtx,
  _id: Id<"parking_spaces">,
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
): Promise<void> => {
  try {
    if (!_id) {
      throw new Error("Invalid input: Parking space ID is required");
    }

    // Update the parking space
    await ctx.db.patch(_id, updates);
  } catch (error) {
    console.error("Failed to update parking space:", error);
    throw new Error("Update failed");
  }
};

/**
 * Deletes a parking space by its ID.
 * @param {MutationCtx} ctx - The Convex mutation context.
 * @param {Id<"parking_spaces">} id - The ID of the parking space to delete.
 * @throws {Error} If the parking space ID is invalid or deletion fails.
 */
export const deleteParkingSpaceModel = async (
  ctx: MutationCtx,
  _id: Id<"parking_spaces">
): Promise<void> => {
  try {
    if (!_id) {
      throw new Error("Invalid input: Parking space ID is required");
    }

    // Check if the parking space exists
    const parkingSpace = await ctx.db.get(_id);
    if (!parkingSpace) {
      throw new Error("Parking space not found");
    }

    // Delete the parking space
    await ctx.db.delete(_id);
  } catch (error) {
    console.error("Failed to delete parking space:", error);
    throw new Error("Delete failed");
  }
};