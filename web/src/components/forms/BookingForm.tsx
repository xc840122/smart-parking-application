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
import { AlertDialogCancel, AlertDialogTitle } from "../ui/alert-dialog"
import { toast } from "sonner"
import { BookingDataModel } from "@/types/convex.type"
import { BookingType, bookingFormSchema } from "@/validators/booking.validator"
import { createBookingService, updateBookingService } from "@/services/booking.service"
import { useState } from "react"
import TimePicker from "react-time-picker"
import "react-time-picker/dist/TimePicker.css" // Import the CSS for the time picker
import { Input } from "../ui/input"

const BookingForm = ({
  operationType,
  defaultData,
  onClose,
}: {
  operationType: 'create' | 'edit'
  defaultData?: BookingDataModel
  onClose?: () => void
}) => {
  // const [totalCost, setTotalCost] = useState<number>(defaultData?.totalCost || 0);

  const form = useForm<BookingType>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      userId: defaultData?.userId || "system-generated-user-id",
      parkingName: defaultData?.parkingName || "Default Parking",
      startTime: defaultData?.startTime || 0,
      endTime: defaultData?.endTime || 0,
      totalCost: defaultData?.totalCost || 0,
      state: defaultData?.state || "pending",
      updatedAt: defaultData?.updatedAt || new Date().getTime(),
    },
  });

  const onSubmit = async (values: BookingType) => {
    const payload = {
      // ...values,
      // userId: "system-generated-user-id", // Replace with actual logic
      // parkingName: "Default Parking", // Replace with actual logic
      // totalCost: totalCost, // Use the calculated totalCost
      // state: "pending", // Replace with actual logic
      // updatedAt: new Date().getTime(),
    };

    const validationResult = bookingFormSchema.safeParse(payload);
    if (!validationResult.success) {
      toast.error("Invalid data in payload");
      return;
    }

    switch (operationType) {
      case 'create':
        const createResponse = await createBookingService(payload);
        if (createResponse.result) {
          toast.success(createResponse.message);
        } else {
          toast.error(createResponse.message);
        }
        break;
      case 'edit':
        if (defaultData?._id) {
          const updateResponse = await updateBookingService(defaultData._id, payload);
          if (updateResponse.result) {
            toast.success(updateResponse.message);
          } else {
            toast.error(updateResponse.message);
          }
        }
        break;
    }
    onClose?.();
  };

  return (
    <Form {...form}>
      <AlertDialogTitle>
        {operationType === 'create' ? 'Create Booking' : 'Edit Booking'}
      </AlertDialogTitle>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Start Time Field */}
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <TimePicker
                  onChange={(value) => field.onChange(value)} // Update form value
                  value={field.value} // Bind to form value
                  className="react-time-picker" // Add custom class for styling
                  disableClock // Hide the clock popup
                  clearIcon={null} // Remove the clear icon
                />
              </FormControl>
              <FormDescription>
                The start time of the booking.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Time Field */}
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <TimePicker
                  onChange={(value) => field.onChange(value)} // Update form value
                  value={field.value} // Bind to form value
                  className="react-time-picker" // Add custom class for styling
                  disableClock // Hide the clock popup
                  clearIcon={null} // Remove the clear icon
                />
              </FormControl>
              <FormDescription>
                The end time of the booking.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Display Calculated Price */}
        <FormItem>
          <FormLabel>Total Cost</FormLabel>
          <FormControl>
            <Input
              type="text"
              className="text-xs"
              value={`$${totalCost.toFixed(2)}`} // Display price with 2 decimal places
              readOnly // Make the field read-only
            />
          </FormControl>
          <FormDescription>
            The total cost is calculated based on the duration of the booking.
          </FormDescription>
        </FormItem>

        {/* Cancel Button */}
        <AlertDialogCancel className="mr-2" disabled={form.formState.isSubmitting}>
          Cancel
        </AlertDialogCancel>

        {/* Submit Button */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {operationType === "create" ? "Create Booking" : "Update Booking"}
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;