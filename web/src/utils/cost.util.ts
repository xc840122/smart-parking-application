import { predictRate } from "@/helper/booking.helper";

// Calculate the parking cost
export const costCalculation = async (
  usage: number,
  parkingRate: number,
  startTime: number,
  endTime: number
) => {
  // Calculate total cost
  const ratePerHour = parkingRate; // Hour rate
  const durationHours = Math.ceil((endTime - startTime) / 3600000); // Convert ms to hours, round up
  const baseTotalCostString = (durationHours * ratePerHour).toFixed(2); // Round to 2 decimal places

  // Request discountRate from AI model
  const discountRate = parseFloat((await predictRate(durationHours, usage)).toFixed(2));

  // Calculate total cost
  const totalCost = parseFloat(baseTotalCostString);
  return { totalCost, discountRate };
}

export default costCalculation