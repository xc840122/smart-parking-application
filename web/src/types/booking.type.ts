export type BookingRequestBody = {
  clerkUserId: string;
  startTime: number;
  endTime: number;
  parkingSpaceId: string;
};