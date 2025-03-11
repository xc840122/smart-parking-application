import { ParkingSpaceDataModel } from "@/types/parking-space.type";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

export const createParkingModel = async (
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

export const getParkingModel = async (
  ctx: QueryCtx,
  isActive: boolean,//By default get only active parking spaces
  city?: string,
  area?: string,
  street?: string,
  keyword?: string,
): Promise<ParkingSpaceDataModel[]> => {
  try {
    // For search by keyword
    if (keyword) {
      const parkings = await ctx.db
        .query("parking_spaces")
        .withSearchIndex("search_name", q =>
          q
            .search("name", keyword)
            .eq("isActive", isActive)
        )
        .collect();
      return parkings.sort((a, b) => b._creationTime - a._creationTime);
    } else if (city && !area && !street) {
      // For filter by city
      return await ctx.db
        .query("parking_spaces")
        .withIndex("by_city_isActive", (q) =>
          q
            .eq("city", city)
            .eq("isActive", isActive)
        )
        .order("desc")
        .collect();
    } else if (city && area && !street) {
      // For filter by city and area
      return await ctx.db
        .query("parking_spaces")
        .withIndex("by_city_area_isActive", (q) =>
          q
            .eq("city", city)
            .eq("area", area)
            .eq("isActive", isActive)
        )
        .order("desc")
        .collect();
    } else if (city && area && street) {
      // For filter by city and area and steet
      return await ctx.db
        .query("parking_spaces")
        .withIndex("by_city_area_street_isActive", (q) =>
          q
            .eq("city", city)
            .eq("area", area)
            .eq("street", street)
            .eq("isActive", isActive)
        )
        .order("desc")
        .collect();
    } else {
      // For all parking spaces
      return await ctx.db
        .query("parking_spaces")
        .withIndex("is_active", (q) => q.eq("isActive", isActive))
        .order("desc")
        .collect();
    }
  } catch (error) {
    console.error("Failed to get parking spaces by location:", error);
    throw new Error("Query failed");
  }
};


export const getParkingByIdModel = async (
  ctx: QueryCtx,
  _id: Id<"parking_spaces">
): Promise<ParkingSpaceDataModel | null> => {
  try {
    // Get the parking space
    return await ctx.db
      .query("parking_spaces")
      .withIndex("by_id", (q) => q.eq("_id", _id))
      .first();
  } catch (error) {
    console.error("Failed to get parking space:", error);
    throw new Error("Query failed");
  }
}

export const updateParkingModel = async (
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

export const deleteParkingModel = async (
  ctx: MutationCtx,
  _id: Id<"parking_spaces">
): Promise<void> => {
  try {
    // Delete the parking space
    await ctx.db.delete(_id);
  } catch (error) {
    console.error("Failed to delete parking space:", error);
    throw new Error("Delete failed");
  }
};