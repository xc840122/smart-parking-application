import { mutation } from "./_generated/server";

// Helper function to generate random data
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to generate random coordinates within a range
const getRandomCoordinate = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Seed data for testing
export const seedParkingSpaces = mutation({
  args: {},
  handler: async (ctx) => {
    // Cities, areas, and streets for testing
    const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
    const areas = ["Downtown", "Uptown", "Midtown", "Suburb", "Industrial Zone"];
    const streets = ["Main St", "Broadway", "Elm St", "Oak St", "Maple Ave"];

    // Generate 100 parking spaces
    for (let i = 0; i < 100; i++) {
      const name = `Parking Space ${i + 1}`;
      const location = {
        lat: getRandomCoordinate(34.0, 35.0), // Latitude range for testing
        lng: getRandomCoordinate(-118.0, -117.0), // Longitude range for testing
      };
      const city = getRandomElement(cities);
      const area = getRandomElement(areas);
      const street = getRandomElement(streets);
      const unit = `Unit ${Math.floor(Math.random() * 100)}`;
      const totalSlots = Math.floor(Math.random() * 50) + 10; // Random slots between 10 and 60
      const availableSlots = Math.floor(Math.random() * totalSlots); // Random available slots
      const pricePerHour = Math.floor(Math.random() * 10) + 5; // Random price between $5 and $15
      const isActive = true;

      // Insert the parking space into the database
      await ctx.db.insert("parking_spaces", {
        name,
        location,
        city,
        area,
        street,
        unit,
        totalSlots,
        availableSlots,
        pricePerHour,
        isActive,
      });
    }

    return "Seeded 100 parking spaces successfully!";
  },
});