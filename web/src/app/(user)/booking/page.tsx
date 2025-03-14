import { Suspense } from "react";
import Loading from "@/components/Loading";
import BookingWrapper from "./booking-wrapper";
import { userHelper } from "@/helper/user.helper";
import SignInPage from "@/app/sign-in/[[...sign-in]]/page";

const BookingPage = async () => {
  // Get clerk user ID
  const { clerkUserId, role } = await userHelper();

  if (!clerkUserId) {
    return <SignInPage />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <BookingWrapper clerkUserId={clerkUserId} role={role} />
    </Suspense>
  );
};

export default BookingPage;
