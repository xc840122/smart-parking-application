import { predictDiscount } from "@/helper/booking.helper";

// Calculate the parking cost
export const costCalculation = async (
  occupancyRate: number,
  parkingRate: number,
  startTime: number,
  endTime: number
) => {
  try {
    // Calculate total cost
    const duration = Math.ceil((endTime - startTime) / 3600000); // Convert ms to hours, round up
    const baseTotalCostString = (duration * parkingRate).toFixed(2); // Round to 2 decimal places

    // Calculate timeOfDay, dayOfWeek, and isWeekend from startTime
    const startDate = new Date(startTime);
    const timeOfDay = startDate.getHours(); // Get hour of the day (0-23)
    const dayOfWeek = startDate.getDay(); // Get day of the week (0=Sunday, 6=Saturday)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Check if it's weekend

    // Request discountRate from AI model
    const discountRate = parseFloat(
      (
        await predictDiscount(
          duration,
          parseFloat(baseTotalCostString),
          occupancyRate,
          timeOfDay,
          dayOfWeek,
          isWeekend,
        )
      ).toFixed(2)) ?? 0;

    // Calculate total cost
    const totalCost = parseFloat(baseTotalCostString);
    return { totalCost, discountRate };
  } catch (error) {
    console.error('Cost calculation failed:', error);
    throw new Error('Cost calculation failed');
  }
}

export default costCalculation