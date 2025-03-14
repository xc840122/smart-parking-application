import { createBookingRepo } from "@/repositories/booking.repo"
import { BookingState } from "@/validators/booking.validator"

const TestPage = async () => {

  const bookingData = {
    userId: 'k17cb30ben4vpb7wt0p335fd217c1c7s',
    parkingSpaceId: 'k576marh78evwmsnk8n4hd7fen7c0q1q',
    startTime: 1742030400000,
    endTime: 1742052000000,
    parkingName: 'Downtown 5th Ave Parking',
    totalCost: 36,
    discountRate: 1,
    state: 'pending' as BookingState,
    updatedAt: 1741911009979
  }

  const result = await createBookingRepo(bookingData)
  return (
    <div>{result}</div>
  )
}

export default TestPage