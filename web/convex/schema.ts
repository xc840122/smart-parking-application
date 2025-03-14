import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const bookingStateDataSchema = v.union(
  v.literal('pending'),
  v.literal('confirmed'),
  v.literal('completed'),
  v.literal('cancelled'),
  v.literal('expired')
);

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(), // Unique ID from Clerk
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    vehicleDetails: v.object({
      licensePlate: v.string(),
      vehicleType: v.string(),
    }),
  })
    .index("by_clerkUserId", ["clerkUserId"]) // Index for Clerk user ID
    .index("by_email", ["email"]), // Index for email

  parking_spaces: defineTable({
    name: v.string(),
    location: v.object({ lat: v.number(), lng: v.number() }), // For Google Maps
    city: v.string(),
    area: v.string(),
    street: v.string(),
    unit: v.string(),
    totalSlots: v.number(),
    availableSlots: v.number(),
    pricePerHour: v.number(),
    isActive: v.boolean(),
  })
    .index("by_location_isActive", ["location.lat", "location.lng", "isActive"])
    .index("by_city_isActive", ["city", "isActive"])
    .index("by_city_area_isActive", ["city", "area", "isActive"])
    .index("by_city_area_street_isActive", ["city", "area", "street", "isActive"])
    .index("is_active", ["isActive"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["isActive"],
    }), // Search index for name

  bookings: defineTable({
    userId: v.id("users"),
    parkingSpaceId: v.optional(v.id("parking_spaces")),
    parkingName: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    totalCost: v.number(),
    discountRate: v.number(),
    state: bookingStateDataSchema, // Use string literals for enum-like behavior
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"]) // Index for user bookings
    .index("by_userId_state", ["userId", "state"]) // Index for user bookings by state
    .index("by_userId_startTime", ["userId", "startTime"])
    .index("by_userId_endTime", ["userId", "endTime"])// Index for user bookings by time range
    .index("by_userId_startTime_endTime", ["userId", "startTime", "endTime"])// Index for user bookings by time range
    .searchIndex("search_parking", {
      searchField: "parkingSpaceId",
      filterFields: ["userId"],
    }), // Search index for parking space

  iot_data: defineTable({
    parkingSpaceId: v.id("parking_spaces"),
    sensorId: v.string(),
    occupancyState: v.boolean(),
    updatedAt: v.number(), //For exact time of sensor data
  })
    .index("by_parkingSpaceId_updatedAt", ["parkingSpaceId", "updatedAt"]), // Index for IoT data

  reviews: defineTable({
    userId: v.id("users"),
    parkingSpaceId: v.id("parking_spaces"),
    rating: v.number(),
    comment: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_parkingSpaceId", ["parkingSpaceId"]), // Index for reviews by parking space

  payments: defineTable({
    bookingId: v.id("bookings"),
    userId: v.id("users"),
    amount: v.number(),
    paymentMethod: v.string(),
    state: v.string(),
    createdAt: v.number(),
  })
    .index("by_bookingId", ["bookingId"]), // Index for payments by booking

  // Define tables for cities, areas, and streets
  cities: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),

  areas: defineTable({
    name: v.string(),
    cityId: v.id("cities"),
  }).index("by_city", ["cityId"])
    .index("by_name", ["name"]),

  streets: defineTable({
    name: v.string(),
    areaId: v.id("areas"),
  }).index("by_area", ["areaId"]),
});