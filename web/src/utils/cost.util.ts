// Calculate the parking cost
export const costCalculation = async (
  parkingRate: number,
  startTime: number,
  endTime: number
) => {
  // Calculate total cost
  const ratePerHour = parkingRate; // Hour rate
  const durationHours = Math.ceil((endTime - startTime) / 3600000); // Convert ms to hours, round up
  const totalCostString = (durationHours * ratePerHour).toFixed(2); // Round to 2 decimal places
  return parseFloat(totalCostString);
}

export default costCalculation