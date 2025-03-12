// Calculate the parking cost
export const costCalculation = async (
  parkingRate: number,
  startTime: number,
  endTime: number) => {

  return (Math.ceil((endTime - startTime) / (3600 * 1000)) * parkingRate).toFixed(2);
}

export default costCalculation