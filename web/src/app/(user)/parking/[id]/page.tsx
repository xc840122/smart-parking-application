import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { convexTimeToDisplayFormat } from '@/utils/date.util';
import { getParkingByIdService } from '@/services/parking.service';
import BookingForm from '@/components/forms/BookingForm';
import { userHelper } from '@/helper/user.helper';
import { getUserByClerkIdService } from '@/services/user.service';

const ParkingDetailPage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  // Get userId
  const { clerkUserId } = await userHelper()

  const userId = clerkUserId ? (await getUserByClerkIdService(clerkUserId)).data?._id as string : '';
  const { id } = await params;

  // Get parking lot details by id
  const response = await getParkingByIdService(id);

  // Show error message if no parking lot is found
  if (!response.result || !response.data) {
    return response.message;
  };

  const { name, city, area, street, unit, _creationTime } = response.data;

  return (
    <>
      {userId ? (<div className='max-w-2xl mx-auto p-4'>
        <Card className='shadow-lg'>
          <CardHeader>
            <CardTitle className='text-xl'>{name}</CardTitle>
            <p className='text-sm text-gray-500'>Added on: {convexTimeToDisplayFormat(_creationTime)}</p>
          </CardHeader>
          <CardContent>
            {/* Address Section */}
            <div className='space-y-2'>
              <p className='text-sm font-medium text-gray-700'>City: {city}</p>
              <p className='text-sm font-medium text-gray-700'>Area: {area}</p>
              <p className='text-sm font-medium text-gray-700'>Street: {street}</p>
              <p className='text-sm font-medium text-gray-700'>Unit: {unit}</p>
            </div>
            <div className='border-t my-4'></div>
            {/* Booking form */}
            <BookingForm defaultData={{ userId: userId, parkingSpaceId: id }} />
          </CardContent>
        </Card>
      </div>)
        : (
          <div className='flex justify-center items-center h-4'>
            Please Login to book a parking space
          </div>
        )}
    </>
  );
};

export default ParkingDetailPage;