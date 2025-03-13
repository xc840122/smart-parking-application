// duration: hours 1-24, occupancyRate: 0-1
// return: discountRate: 0-1
export const predictRate = async (duration: number, occupancyRate: number): Promise<number> => {
  const response = await fetch('http://127.0.0.1:5000/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      duration: duration,
      occupancy_rate: occupancyRate,
    }),
  });

  const data = await response.json();
  console.log('Predicted Discount Rate:', data.discount_rate);
  return data.discount_rate;
};

