import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export const getCitiesRepo = async () => {
  const cities = await fetchQuery(api.address.getCitiesData);
  return cities;
}

export const getAreasInCityRepo = async (cityName: string) => {
  const areas = await fetchQuery(api.address.getAreasInCityData, { cityName });
  return areas;
}

export const getStreetsInAreaRepo = async (areaName: string) => {
  const streets = await fetchQuery(api.address.getStreetsInAreaData, { areaName });
  return streets;
}