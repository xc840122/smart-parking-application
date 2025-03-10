import { Suspense } from "react";
import ParkingSpaceWrapper from "./parking-wrapper";
import Loading from "@/components/Loading";


const ParkingSpacePage = async () => {
  return (
    <Suspense fallback={<Loading />}>
      <ParkingSpaceWrapper />
    </Suspense>
  );
};

export default ParkingSpacePage;
