import { Suspense } from "react";
import Loading from "@/components/Loading";
import ParkingSpaceWrapper from "./parking-wrapper";

const ParkingSpacePage = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <ParkingSpaceWrapper />
    </Suspense>
  );
};

export default ParkingSpacePage;
