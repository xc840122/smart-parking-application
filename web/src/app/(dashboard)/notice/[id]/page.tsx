import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConvexTimeToDisplayFormat } from '@/utils/date-convertor';
import { getNoticeById } from '@/services/notice-service';
import { toast } from 'sonner';
import Link from 'next/link';

const NoticeDetailPage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params;

  // Get notice by id
  const response = await getNoticeById(id);
  // Show error message if no notice is found
  if (!response.result || !response.data) {
    toast.error(response.message);
    return;
  };

  const { title, description, classroom, _creationTime } = response.data;

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <Card className='shadow-lg'>
        <CardHeader>
          <CardTitle className='text-xl'>{title}</CardTitle>
          <p className='text-sm text-gray-500'>Created on: {ConvexTimeToDisplayFormat(_creationTime)}</p>
        </CardHeader>
        <CardContent>
          <p className='text-sm font-medium text-gray-700'>Classroom: {classroom}</p>
          <div className='border-t my-4'></div>
          <p className='text-gray-800'>{description}</p>
        </CardContent>
      </Card>
      <div className='mt-6 flex justify-center'>
        <Link href='/notice' passHref>
          <Button variant='outline'>
            ← Back to Notice List
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NoticeDetailPage;
