import { Suspense } from "react";
import Loading from "@/components/Loading";
import BookingWrapper from "./booking-wrapper";
import { userHelper } from "@/helper/user.helper";
import SignInPage from "@/app/sign-in/[[...sign-in]]/page";

const BookingPage = async () => {
  // Get clerk user ID
  const { userId, role } = await userHelper();

  if (!userId) {
    return <SignInPage />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <BookingWrapper clerkUserId={userId} role={role} />
    </Suspense>
  );
};

export default BookingPage;
