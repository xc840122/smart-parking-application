import { Suspense } from "react";
import Loading from "@/components/Loading";
import BookingWrapper from "./booking-wrapper";
import { userHelper } from "@/helper/user.helper";

const BookingPage = async () => {
  // Get clerk user ID
  const { userId, role } = await userHelper()

  // Return loading if no user ID
  if (!userId) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <BookingWrapper clerkUserId={userId} role={role} />
    </Suspense>
  );
};

export default BookingPage;
