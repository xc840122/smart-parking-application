import { Suspense } from "react";
import ParkingSpaceWrapper from "./parking-wrapper";
import Loading from "@/components/Loading";
import { userHelper } from "@/helper/user.helper";
import { getCitiesService } from "@/services/address.service";


const ParkingSpacePage = async () => {
  // Get clerk user ID
  const { role } = await userHelper()
  // Get cities
  const cities = await getCitiesService();

  return (
    <Suspense fallback={<Loading />}>
      <ParkingSpaceWrapper
        role={role}
        cities={cities.data || []}
      />
    </Suspense>
  );
};

export default ParkingSpacePage;
