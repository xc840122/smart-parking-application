import { Suspense } from "react";
import ParkingSpaceWrapper from "./parking-wrapper";
import Loading from "@/components/Loading";
import { userHelper } from "@/helper/user.helper";


const ParkingSpacePage = async () => {
  // Get clerk user ID
  const { role } = await userHelper()

  return (
    <Suspense fallback={<Loading />}>
      <ParkingSpaceWrapper
        role={role}
      />
    </Suspense>
  );
};

export default ParkingSpacePage;
