import { ADDRESS_MESSAGES } from "@/constants/messages/address.message";
import { getAreasInCityRepo, getCitiesRepo, getStreetsInAreaRepo } from "@/repositories/address.repo";

// Get city list
export const getCitiesService = async () => {
  const cities = await getCitiesRepo();
  if (!cities) {
    return { result: false, message: ADDRESS_MESSAGES.ERROR.GET_CITIES_FAILED, data: [] };
  }
  const cityNames = cities.map((city) => city.name);
  return { result: true, message: ADDRESS_MESSAGES.SUCCESS.GET_CITIES_SUCCESSFUL, data: cityNames };
}

// Get area list in a city
export const getAreasByCityService = async (cityName: string) => {
  const areas = await getAreasInCityRepo(cityName);
  if (!areas) {
    return { result: false, message: ADDRESS_MESSAGES.ERROR.GET_AREAS_IN_CITY_FAILED, data: [] };
  }
  const areaNames = areas.map((area) => area.name);
  return { result: true, message: ADDRESS_MESSAGES.SUCCESS.GET_AREAS_IN_CITY_SUCCESSFUL, data: areaNames };
}

// Get street list in an area
export const getStreetsByAreaService = async (areaName: string) => {
  const streets = await getStreetsInAreaRepo(areaName);
  if (!streets) {
    return { result: false, message: ADDRESS_MESSAGES.ERROR.GET_STREETS_IN_AREA_FAILED, data: [] };
  }
  const streetNames = streets.map((street) => street.name);
  return { result: true, message: ADDRESS_MESSAGES.SUCCESS.GET_STREETS_IN_AREA_SUCCESSFUL, data: streetNames };
}