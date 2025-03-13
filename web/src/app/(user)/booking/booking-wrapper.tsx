"use client";

import { useQuery } from "convex/react";
import { useURLParams } from "@/hooks/use-params";
import { api } from "../../../../convex/_generated/api";
import { getUserByClerkIdService } from "@/services/user.service";
import { useEffect, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { DateToConvexTime } from "@/utils/date.util";
import BookingListContent from "./booking-list";

const BookingWrapper = ({
  clerkUserId,
  role,
}: {
  clerkUserId: string,
  role: string,
}
) => {
  // Get related data for booking
  const { page, mode, searchValue, startDate, endDate } = useURLParams();
  const [userId, setUserId] = useState<Id<"users"> | null>(null);

  // Get userID by Clerk user
  useEffect(() => {
    const getUser = async () => {
      try {
        if (clerkUserId) {
          const appUser = await getUserByClerkIdService(clerkUserId);
          if (appUser.result && appUser.data) {
            setUserId(appUser.data._id);
          } else {
            console.error("Failed to fetch user:", appUser.message);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    getUser();
  }, [clerkUserId]);

  // Use useQuery but allow it to wait until userId is available
  const bookings = useQuery(
    api.booking.getBookingsByUser,
    {
      userId: userId!,
      keyword: searchValue,
      startTime: DateToConvexTime(startDate, true),
      endTime: DateToConvexTime(endDate, false),
    },
  ) ?? [];

  return (
    <BookingListContent
      mode={mode}
      page={page}
      bookings={bookings}
      role={role}
    />
  );
};

export default BookingWrapper;