'use client'

import DropdownMenuRadio from "@/components/DropDown";
import { getAreasByCityService, getStreetsByAreaService } from "@/services/address.service";
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";

export const AddressFilter = ({ cities }: { cities: string[] }) => {

  // State for areas and streets
  const [areas, setAreas] = useState<string[]>([]);
  const [streets, setStreets] = useState<string[]>([]);

  // Get search
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  // Set router
  const router = useRouter();
  // Get city from URL,rerender when changes
  const city = params.get('city');
  const area = params.get('area');
  const street = params.get('street');

  // Get areas and streets data
  useEffect(() => {
    const getAreas = async () => {
      if (city) {
        const areas = await getAreasByCityService(city);
        setAreas(areas.data || []);
      }
      if (area) {
        const streets = await getStreetsByAreaService(area);
        setStreets(streets.data || []);
      }
    }
    getAreas();
  }, [city, area]);

  // Set url according to the selected value, 
  // filtered list cause rerenderingaccording to the selected value
  const onCityValueChange = (value: string) => {
    router.push(`?city=${value}`);
  }

  const onAreaValueChange = (value: string) => {
    router.push(`?city=${city}&area=${value}`);
  }

  const onStreetValueChange = (value: string) => {
    router.push(`?city=${city}&area=${area}&street=${value}`);
  }

  // Control the disabled state of the dropdowns
  const areaDisabled = !city;
  const streetDisabled = !area;

  return (
    <div className="flex gap-4 justify-between w-full">
      <DropdownMenuRadio
        topItem="City"
        menu={cities}
        selectedValue={city || undefined}
        onValueChange={onCityValueChange}
      />
      <DropdownMenuRadio
        topItem="Area"
        menu={areas}
        selectedValue={area || undefined}
        onValueChange={onAreaValueChange}
        disabled={areaDisabled}
      />
      <DropdownMenuRadio
        topItem="Street"
        menu={streets}
        selectedValue={street || undefined}
        onValueChange={onStreetValueChange}
        disabled={streetDisabled}
      />
    </div>
  )
}

export default AddressFilter;