import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { convexTimeToDisplayFormat } from '@/utils/date.util';
import { toast } from 'sonner';
import Link from 'next/link';
import { getParkingByIdService } from '@/services/parking.service';

const ParkingDetailPage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
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
    <div className='max-w-2xl mx-auto p-4'>
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
          <p className='text-gray-800'>{'pending'}</p>

          {/* Booking/Cancel Button */}
          <div className='mt-6 gap-2'>
            <Button variant='outline' className='w-full'>
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className='mt-6 flex justify-center'>
        <Link href='/parking' passHref>
          <Button variant='outline'>
            ← Back to Parking List
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ParkingDetailPage;