"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ParkingListContent from "./parking-list";
import { useURLParams } from "@/hooks/use-params";
import { Suspense } from "react";
import Loading from "@/components/Loading";

const ParkingWrapper = ({
  role,
  cities,
}: {
  role: string,
  cities: string[],
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
    <Suspense fallback={<Loading />}>
      <ParkingListContent
        cities={cities}
        mode={mode}
        page={page}
        parkings={parkings}
        role={role}
      />
    </Suspense>
  );
};

export default ParkingWrapper;