import { bookingSchema } from "@/validators/booking.validator";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
    parkingSpaceId: v.id("parking_spaces"),
    startTime: v.number(),
    endTime: v.number(),
    totalCost: v.number(),
    status: bookingSchema, // Use string literals for enum-like behavior
    updatedAt: v.number(),
  })
    .index("by_userId_status", ["userId", "status"]) // Index for user bookings by status
    .index("by_parkingSpaceId_status", ["parkingSpaceId", "status"]), // Index for parking space bookings by status

  iot_data: defineTable({
    parkingSpaceId: v.id("parking_spaces"),
    sensorId: v.string(),
    occupancyStatus: v.boolean(),
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
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_bookingId", ["bookingId"]), // Index for payments by booking
});