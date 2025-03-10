"use client";

import { useQuery } from "convex/react";
import { useMetadata } from "@/hooks/use-metadata";
import { useURLParams } from "@/hooks/use-params";
import { api } from "../../../../convex/_generated/api";
import ParkingListContent from "./parking-list";
import Loading from "@/components/Loading";

const ParkingWrapper = () => {
  // Get search value, start date, end date, page number from URL
  const { pageNum, mode, city, area, street, searchValue } = useURLParams();
  // Get role and session status from metadata
  const { status, role } = useMetadata();

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

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <ParkingListContent
      mode={mode}
      pageNum={pageNum}
      parkings={parkings}
      role={role}
    />
  );
};

export default ParkingWrapper;