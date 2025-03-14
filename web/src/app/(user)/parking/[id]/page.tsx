import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { convexTimeToDisplayFormat } from '@/utils/date.util';
import { toast } from 'sonner';
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
  // Query userId by clerkUserId
  if (!clerkUserId) {
    toast.error('Failed to get user information');
    return;
  }
  const userId = (await getUserByClerkIdService(clerkUserId)).data?._id as string;
  const { id } = await params;

  // Get parking lot details by id
  const response = await getParkingByIdService(id);

  // Show error message if no parking lot is found
  if (!response.result || !response.data) {
    toast.error(response.message);
    return;
  };

  const { name, city, area, street, unit, _creationTime } = response.data;

  return (
    <div className='max-w-xl mx-auto p-4 h-screen'>
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
          {/* Description Section */}
          {/* <p className='text-gray-800'>{'pending'}</p> */}
          {/* Booking form */}
          <BookingForm defaultData={{ userId: userId, parkingSpaceId: id }} />
          {/* Booking/Cancel Button */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ParkingDetailPage;