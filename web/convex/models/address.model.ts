import { AreaDataModel, CityDataModel, StreetDataModel } from "@/types/convex.type";
import { QueryCtx } from "../_generated/server";

// Get all cities (for a dropdown)
export const getCitiesModel = async (ctx: QueryCtx): Promise<CityDataModel[]> => {
  return await ctx.db.query("cities")
    .order("asc")
    .collect();
}

// Get city by city name
export const getCityByNameModel = async (ctx: QueryCtx, cityName: string):
  Promise<CityDataModel | null> => {
  return await ctx.db.query("cities")
    .withIndex("by_name", q => q.eq("name", cityName))
    .first();
}

// Get areas in a specific city
export const getAreasInCityModel =
  async (ctx: QueryCtx, cityName: string): Promise<AreaDataModel[]> => {
    const city = await getCityByNameModel(ctx, cityName);
    if (!city) {
      throw new Error("City not found");
    }
    return await ctx.db.query("areas")
      .withIndex("by_city", q => q.eq("cityId", city._id))
      .collect();
  }

// Get area by area name
export const getAreaByNameModel = async (ctx: QueryCtx, areaName: string):
  Promise<AreaDataModel | null> => {
  return await ctx.db.query("areas")
    .withIndex("by_name", q => q.eq("name", areaName))
    .first();
}

// Get streets in a specific area
export const getStreetsInAreaModel =
  async (ctx: QueryCtx, areaName: string): Promise<StreetDataModel[]> => {
    const area = await getAreaByNameModel(ctx, areaName);
    if (!area) {
      throw new Error("Area not found");
    }
    return await ctx.db.query("streets")
      .withIndex("by_area", q => q.eq("areaId", area._id))
      .collect();
  }