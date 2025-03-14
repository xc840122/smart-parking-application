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

// Random forest model
const predictDiscount = async (
  duration: number,
  cost: number,
  occupancyRate: number,
  timeOfDay: number,
  dayOfWeek: number,
  isWeekend: boolean,
): Promise<number> => {
  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        duration,
        cost,
        occupancy_rate: occupancyRate,
        time_of_day: timeOfDay,
        day_of_week: dayOfWeek,
        is_weekend: isWeekend ? 1 : 0,
      }),
      signal: AbortSignal.timeout(10000),
    })

    // Get the discount rate from the response
    const data = await response.json()

    // Parse the discount rate as a number
    const discountRate = Number(data.discount_rate)
    return discountRate
  } catch (error) {
    console.error("Get prediction failed:", error)
    return 0
  }
}