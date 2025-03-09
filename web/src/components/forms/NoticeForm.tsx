"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertDialogCancel, AlertDialogTitle } from "../ui/alert-dialog"
import { NoticeDataModel } from "@/types/convex-type"
import { NoticeCreationType, noticeCreationSchema } from "@/validators/notice-validator"
import { createNotice, updateNotice } from "@/services/notice-service"
import { ClassroomEnum } from "@/constants/class-enum"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"


const NoticeForm = ({
  operationType,
  classroom,
  defaultData,
  onClose,
}: {
  operationType: 'create' | 'edit'
  classroom: ClassroomEnum
  defaultData?: NoticeDataModel
  onClose?: () => void
}) => {

  // Define form.
  const form = useForm<NoticeCreationType>({
    resolver: zodResolver(noticeCreationSchema),
    defaultValues: {
      title: defaultData?.title ?? '',
      description: defaultData?.description ?? '',
    }, //Load default values for edit action
  })

  // Define a submit handler.
  const onSubmit = async (values: NoticeCreationType) => {
    const result = noticeCreationSchema.safeParse(values);
    if (!result.success) return;
    // Call create or update message function
    switch (operationType) {
      case 'create':
        const response = await createNotice(classroom, values.title, values.description);
        // Show toast message
        if (response.result) {
          toast.success(response.message)
        }
        else {
          toast.error(response.message);
        }
        break;
      case 'edit':
        if (defaultData?._id) {
          const response = await updateNotice(defaultData._id, values.title, values.description);
          // Show toast message
          if (response.result) {
            toast.success(response.message)
          }
          else {
            toast.error(response.message);
          }
        }
        break;
    }
    onClose?.();
  }

  return (
    <Form {...form}>
      {/* Form title, apply AlertDialogTitle to avoid warning of screen reader */}
      <AlertDialogTitle>
        {operationType === 'create' ? 'Create Notice' : 'Edit Notice'}
      </AlertDialogTitle>
      {/* Fields */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  className='text-xs'
                  placeholder="At least 2 characters" {...field} />
              </FormControl>
              <FormDescription>
                Title of the message.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Description field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className='text-xs'
                  placeholder="At least 10 characters." {...field} />
              </FormControl>
              <FormDescription>
                Description of the message.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialogCancel
          className="mr-2"
          disabled={form.formState.isLoading}>
          Cancel
        </AlertDialogCancel>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
export default NoticeForm;