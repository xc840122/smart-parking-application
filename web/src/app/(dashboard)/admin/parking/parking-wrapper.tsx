'use client';

import { useQuery } from "convex/react";
import { useMetadata } from "@/hooks/use-metadata";
import { useURLParams } from "@/hooks/use-params";
import { api } from "../../../../../convex/_generated/api";
import ParkingListContent from "./parking-list";

const ParkingSpaceWrapper = () => {
  // Get search value, start date, end date, page number from URL
  const { searchValue, city, area, pageNum, mode } = useURLParams();
  // Get role and classroom from session (metadata)
  const { status, role } = useMetadata();
  // Get notice list (auto handle search, date range)
  // const parkings = useQuery(
  //   api.parking.getParkingSpacesByLocation,
  //   {
  //     city: city,
  //     area: area,
  //     keyword: searchValue,
  //   }
  // ) ?? [];
  const parkings = [];
  return (
    <ParkingListContent
      mode={mode}
      pageNum={pageNum}
      status={status}
      role={role}
      parkings={parkings}
    />
  )
}

export default ParkingSpaceWrapper