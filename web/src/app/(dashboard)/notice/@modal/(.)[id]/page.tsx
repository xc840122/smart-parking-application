import { getNoticeById } from "@/services/notice-service"
import Modal from "./modal"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConvexTimeToDisplayFormat } from "@/utils/date-convertor"

const NoticePopUp = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {

  const { id } = await params
  // Get notice by id
  const response = await getNoticeById(id);
  // Show error message if no notice is found
  if (!response.result || !response.data) {
    toast.error(response.message);
    return;
  };

  const { title, description, classroom, _creationTime } = response.data;
  return (
    <Modal>
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
      </div>
    </Modal>
  )
}

export default NoticePopUp