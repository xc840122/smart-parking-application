import { faker } from '@faker-js/faker';
import { internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { BookingState } from '@/validators/booking.validator';

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
    const existingCities = await ctx.db.query("cities").collect();
    if (existingCities.length > 0) {
      console.log("Database already has data. Skipping seed operation.");
      return { success: false, message: "Data already exists" };
    }

    // Initialize Faker with a random seed
    faker.seed();

    // Create cities
    console.log("Creating cities...");
    const cityNames = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
    const cityIds: Record<string, Id<"cities">> = {};

    for (const cityName of cityNames) {
      cityIds[cityName] = await ctx.db.insert("cities", {
        name: cityName,
      });
    }

    // Create areas
    console.log("Creating areas...");
    const areaNames = ["Downtown", "Uptown", "Midtown", "Westside", "Eastside"];
    const areaIds: Record<string, Id<"areas">> = {};

    for (const cityName of cityNames) {
      for (const areaName of areaNames) {
        const key = `${cityName}-${areaName}`;
        areaIds[key] = await ctx.db.insert("areas", {
          name: areaName,
          cityId: cityIds[cityName],
        });
      }
    }

    // Create streets
    console.log("Creating streets...");
    const streetNames = ["Main St", "Broadway", "Park Ave", "5th Ave", "Ocean Blvd"];
    const streetIds: Record<string, Id<"streets">> = {};

    for (const cityName of cityNames) {
      for (const areaName of areaNames) {
        for (const streetName of streetNames) {
          const areaKey = `${cityName}-${areaName}`;
          const streetKey = `${areaKey}-${streetName}`;
          streetIds[streetKey] = await ctx.db.insert("streets", {
            name: streetName,
            areaId: areaIds[areaKey],
          });
        }
      }
    }

    // Create users
    const userIds: Id<"users">[] = [];
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
    const parkingSpaces: Record<string, { id: Id<"parking_spaces">, name: string }> = {};

    console.log("Creating parking spaces...");
    for (let i = 0; i < 15; i++) {
      const city = getRandomItem(cityNames);
      const area = getRandomItem(areaNames);
      const street = getRandomItem(streetNames);
      const totalSlots = faker.number.int({ min: 5, max: 50 });
      const parkingName = `${area} ${street} Parking`;

      const parkingSpaceId = await ctx.db.insert("parking_spaces", {
        name: parkingName,
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
      parkingSpaces[parkingSpaceId.toString()] = {
        id: parkingSpaceId,
        name: parkingName
      };
    }

    // Create bookings
    const bookingIds: Id<"bookings">[] = [];
    const bookingStatees = ["pending", "confirmed", "completed", "cancelled", "expired"];
    console.log("Creating bookings...");
    for (let i = 0; i < 30; i++) {
      const startTime = getRandomFutureTimestamp();
      const endTime = startTime + (faker.number.int({ min: 1, max: 8 }) * 60 * 60 * 1000); // 1-8 hours later
      const parkingSpaceId = getRandomItem(parkingSpaceIds);

      // Get the price per hour for this parking space
      const parkingSpace = await ctx.db.get(parkingSpaceId);
      const pricePerHour = parkingSpace?.pricePerHour || 5;
      const parkingName = parkingSpace?.name || "Unknown Parking";

      // Calculate duration in hours
      const durationHours = (endTime - startTime) / (60 * 60 * 1000);
      const totalCost = pricePerHour * durationHours;

      const bookingId = await ctx.db.insert("bookings", {
        userId: getRandomItem(userIds),
        parkingSpaceId,
        parkingName, // Add the parking name from the parking space
        startTime,
        endTime,
        totalCost,
        state: getRandomItem(bookingStatees) as BookingState,
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
        occupancyState: faker.datatype.boolean(),
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
    const paymentStatees = ["completed", "pending", "failed", "refunded"];

    for (let i = 0; i < bookingIds.length; i++) {
      const booking = await ctx.db.get(bookingIds[i]);
      if (booking) {
        await ctx.db.insert("payments", {
          bookingId: bookingIds[i],
          userId: booking.userId,
          amount: booking.totalCost,
          paymentMethod: getRandomItem(paymentMethods),
          state: getRandomItem(paymentStatees),
          createdAt: getRandomPastTimestamp(),
        });
      }
    }

    console.log("Seed completed successfully!");
    return {
      success: true,
      counts: {
        cities: Object.keys(cityIds).length,
        areas: Object.keys(areaIds).length,
        streets: Object.keys(streetIds).length,
        users: userIds.length,
        parkingSpaces: parkingSpaceIds.length,
        bookings: bookingIds.length
      }
    };
  },
});

export default seed;