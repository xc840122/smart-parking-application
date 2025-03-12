import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConvexTimeToDisplayFormat } from '@/utils/date.util';
import { toast } from 'sonner';
import Link from 'next/link';
import { getBookingByIdService } from '@/services/booking.service';

const BookingDetailPage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params;

  // Get booking details by id
  const response = await getBookingByIdService(id);

  // Show error message if no booking is found
  if (!response.result || !response.data) {
    toast.error(response.message);
    return;
  };

  const { parkingName, startTime, endTime, totalCost, updatedAt, state } = response.data;

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle className='text-xl'>{parkingName}</CardTitle>
          <p className='text-sm text-gray-500'>Last Updated: {ConvexTimeToDisplayFormat(updatedAt)}</p>
        </CardHeader>
        <CardContent>
          {/* Booking Details Section */}
          <div className='space-y-2'>
            <p className='text-sm font-medium text-gray-700'>
              Start Time: {ConvexTimeToDisplayFormat(startTime)}
            </p>
            <p className='text-sm font-medium text-gray-700'>
              End Time: {ConvexTimeToDisplayFormat(endTime)}
            </p>
            <p className='text-sm font-medium text-gray-700'>
              Total Cost: ${totalCost.toFixed(2)}
            </p>
            <p className='text-sm font-medium text-gray-700'>
              Status: <span className={`${state === 'pending' ? 'text-yellow-600' : state === 'confirmed' ? 'text-green-600' : 'text-red-600'}`}>
                {state}
              </span>
            </p>
          </div>

          <div className='border-t my-4'></div>

          {/* Action Buttons */}
          <div className='mt-6 gap-2'>
            {state === 'pending' && (
              <Button variant='outline' className='w-full'>
                Confirm Booking
              </Button>
            )}
            {state === 'confirmed' && (
              <Button variant='outline' className='w-full' disabled>
                Booking Confirmed
              </Button>
            )}
            {state === 'cancelled' && (
              <Button variant='outline' className='w-full' disabled>
                Booking Cancelled
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className='mt-6 flex justify-center'>
        <Link href='/bookings' passHref>
          <Button variant='outline'>
            ← Back to Booking List
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BookingDetailPage;