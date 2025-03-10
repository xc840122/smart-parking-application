import { v } from "convex/values";

export const bookingSchema = v.union(
  v.literal('pending'),
  v.literal('confirmed'),
  v.literal('completed'),
  v.literal('cancelled'),
  v.literal('expired')
);