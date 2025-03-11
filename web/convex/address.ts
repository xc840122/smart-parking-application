import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAreasInCityModel, getCitiesModel, getStreetsInAreaModel } from "./models/address.model";

export const getCitiesData = query({
  handler: async (ctx) => {
    return await getCitiesModel(ctx);
  }
});

export const getAreasInCityData = query({
  args: { cityName: v.string() },
  handler: async (ctx, args) => {
    return await getAreasInCityModel(ctx, args.cityName);
  }
});

export const getStreetsInAreaData = query({
  args: { areaName: v.string() },
  handler: async (ctx, args) => {
    return await getStreetsInAreaModel(ctx, args.areaName);
  }
});