"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ParkingListContent from "./parking-list";
import { useURLParams } from "@/hooks/use-params";

const ParkingWrapper = ({
  role,
}: {
  role: string,
}) => {

  const { page, mode, city, area, street, searchValue } = useURLParams();

  const parkings = useQuery(
    api.parking.getParkingData,
    {
      isActive: true,
      city: city,
      area: area,
      street: street,
      keyword: searchValue,
    }
  ) ?? [];

  return (
    <ParkingListContent
      mode={mode}
      page={page}
      parkings={parkings}
      role={role}
    />
  );
};

export default ParkingWrapper;