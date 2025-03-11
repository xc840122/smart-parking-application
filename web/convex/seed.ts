// import { mutation } from "./_generated/server";

// // Helper function to generate random data
// const getRandomElement = <T>(array: T[]): T => {
//   return array[Math.floor(Math.random() * array.length)];
// };

// // Helper function to generate random coordinates within a range
// const getRandomCoordinate = (min: number, max: number): number => {
//   return Math.random() * (max - min) + min;
// };

// // Seed data for testing
// export const seedParkingSpaces = mutation({
//   args: {},
//   handler: async (ctx) => {
//     // Cities, areas, and streets for testing
//     const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
//     const areas = ["Downtown", "Uptown", "Midtown", "Suburb", "Industrial Zone"];
//     const streets = ["Main St", "Broadway", "Elm St", "Oak St", "Maple Ave"];

//     // Generate 100 parking spaces
//     for (let i = 0; i < 5; i++) {
//       const name = `Parking Space ${i + 1}`;
//       const location = {
//         lat: getRandomCoordinate(34.0, 35.0), // Latitude range for testing
//         lng: getRandomCoordinate(-118.0, -117.0), // Longitude range for testing
//       };
//       const city = getRandomElement(cities);
//       const area = getRandomElement(areas);
//       const street = getRandomElement(streets);
//       const unit = `Unit ${Math.floor(Math.random() * 100)}`;
//       const totalSlots = Math.floor(Math.random() * 50) + 10; // Random slots between 10 and 60
//       const availableSlots = Math.floor(Math.random() * totalSlots); // Random available slots
//       const pricePerHour = Math.floor(Math.random() * 10) + 5; // Random price between $5 and $15
//       const isActive = true;

//       // Insert the parking space into the database
//       await ctx.db.insert("parking_spaces", {
//         name,
//         location,
//         city,
//         area,
//         street,
//         unit,
//         totalSlots,
//         availableSlots,
//         pricePerHour,
//         isActive,
//       });
//     }

//     return "Seeded 100 parking spaces successfully!";
//   },
// });

import { faker } from '@faker-js/faker';
import { internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { BookingType } from '@/types/convex.type';

// Helper to get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper to get a random future timestamp (in milliseconds)
const getRandomFutureTimestamp = (minHours = 1, maxHours = 168): number => {
  const now = Date.now();
  const hoursToAdd = faker.number.int({ min: minHours, max: maxHours });
  return now + (hoursToAdd * 60 * 60 * 1000);
};

// Helper to get a random past timestamp (in milliseconds)
const getRandomPastTimestamp = (minHours = 1, maxHours = 168): number => {
  const now = Date.now();
  const hoursToSubtract = faker.number.int({ min: minHours, max: maxHours });
  return now - (hoursToSubtract * 60 * 60 * 1000);
};

export const seed = internalMutation({
  handler: async (ctx) => {
    // Check if data already exists to avoid duplicate seeding
    const existingUsers = await ctx.db.query("users").collect();
    if (existingUsers.length > 0) {
      console.log("Database already has data. Skipping seed operation.");
      return { success: false, message: "Data already exists" };
    }

    // Initialize Faker with a random seed
    faker.seed();

    // Create users
    const userIds: Id<"users">[] = [];
    const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
    const areas = ["Downtown", "Uptown", "Midtown", "Westside", "Eastside"];
    const streets = ["Main St", "Broadway", "Park Ave", "5th Ave", "Ocean Blvd"];
    const vehicleTypes = ["Sedan", "SUV", "Truck", "Compact", "Van"];

    console.log("Creating users...");
    for (let i = 0; i < 20; i++) {
      const userId = await ctx.db.insert("users", {
        clerkUserId: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        vehicleDetails: {
          licensePlate: faker.vehicle.vrm(),
          vehicleType: getRandomItem(vehicleTypes),
        },
      });
      userIds.push(userId);
    }

    // Create parking spaces
    const parkingSpaceIds: Id<"parking_spaces">[] = [];
    console.log("Creating parking spaces...");
    for (let i = 0; i < 15; i++) {
      const city = getRandomItem(cities);
      const area = getRandomItem(areas);
      const street = getRandomItem(streets);
      const totalSlots = faker.number.int({ min: 5, max: 50 });
      const parkingSpaceId = await ctx.db.insert("parking_spaces", {
        name: `${area} ${street} Parking`,
        location: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
        },
        city,
        area,
        street,
        unit: faker.location.buildingNumber(),
        totalSlots,
        availableSlots: faker.number.int({ min: 0, max: totalSlots }),
        pricePerHour: faker.number.float({ min: 2, max: 15, fractionDigits: 1 }),
        isActive: faker.datatype.boolean(0.9), // 90% chance of being active
      });
      parkingSpaceIds.push(parkingSpaceId);
    }

    // Create bookings
    const bookingIds: Id<"bookings">[] = [];
    const bookingStatuses = ["pending", "confirmed", "completed", "cancelled", "expired"];
    console.log("Creating bookings...");
    for (let i = 0; i < 30; i++) {
      const startTime = getRandomFutureTimestamp();
      const endTime = startTime + (faker.number.int({ min: 1, max: 8 }) * 60 * 60 * 1000); // 1-8 hours later
      const parkingSpaceId = getRandomItem(parkingSpaceIds);

      // Get the price per hour for this parking space
      const parkingSpace = await ctx.db.get(parkingSpaceId);
      const pricePerHour = parkingSpace?.pricePerHour || 5;

      // Calculate duration in hours
      const durationHours = (endTime - startTime) / (60 * 60 * 1000);
      const totalCost = pricePerHour * durationHours;

      const bookingId = await ctx.db.insert("bookings", {
        userId: getRandomItem(userIds),
        parkingSpaceId,
        startTime,
        endTime,
        totalCost,
        status: getRandomItem(bookingStatuses) as BookingType,
        updatedAt: Date.now(),
      });
      bookingIds.push(bookingId);
    }

    // Create IoT data
    console.log("Creating IoT data...");
    for (let i = 0; i < 50; i++) {
      await ctx.db.insert("iot_data", {
        parkingSpaceId: getRandomItem(parkingSpaceIds),
        sensorId: `sensor-${faker.string.alphanumeric(6)}`,
        occupancyStatus: faker.datatype.boolean(),
        updatedAt: getRandomPastTimestamp(),
      });
    }

    // Create reviews
    console.log("Creating reviews...");
    for (let i = 0; i < 25; i++) {
      await ctx.db.insert("reviews", {
        userId: getRandomItem(userIds),
        parkingSpaceId: getRandomItem(parkingSpaceIds),
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.datatype.boolean(0.8) ? faker.lorem.paragraph() : undefined,
        createdAt: getRandomPastTimestamp(),
      });
    }

    // Create payments
    console.log("Creating payments...");
    const paymentMethods = ["credit_card", "debit_card", "paypal", "apple_pay", "google_pay"];
    const paymentStatuses = ["completed", "pending", "failed", "refunded"];

    for (let i = 0; i < bookingIds.length; i++) {
      const booking = await ctx.db.get(bookingIds[i]);
      if (booking) {
        await ctx.db.insert("payments", {
          bookingId: bookingIds[i],
          userId: booking.userId,
          amount: booking.totalCost,
          paymentMethod: getRandomItem(paymentMethods),
          status: getRandomItem(paymentStatuses),
          createdAt: getRandomPastTimestamp(),
        });
      }
    }

    console.log("Seed completed successfully!");
    return {
      success: true,
      counts: {
        users: userIds.length,
        parkingSpaces: parkingSpaceIds.length,
        bookings: bookingIds.length
      }
    };
  },
});

export default seed;