// Random forest model
export const predictDiscount = async (
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


// Linear model
// export const predictDiscount = async (
//   duration: number,
//   occupancyRate: number,
// ) => {
//   const response = await fetch('http://127.0.0.1:5000/predict', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       duration,
//       occupancy_rate: occupancyRate,
//     }),
//     signal: AbortSignal.timeout(10000),
//   });
//   const data = await response.json();
//   return data.discount_rate;
// };