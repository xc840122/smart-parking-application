import { Suspense } from "react";
import ParkingSpaceWrapper from "./parking-wrapper";
import Loading from "@/components/Loading";
import { userHelper } from "@/helper/user.helper";
import { SignIn } from "@clerk/nextjs";


const ParkingSpacePage = async () => {
  // Get clerk user ID
  const { role, userId } = await userHelper()
  // If user is not signed in, return SignIn component
  if (!role || !userId) {
    return <SignIn />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <ParkingSpaceWrapper
        role={role}
      />
    </Suspense>
  );
};

export default ParkingSpacePage;
