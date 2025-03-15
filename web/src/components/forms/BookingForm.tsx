"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BookingCreationType, bookingCreationSchema } from "@/validators/booking.validator";
import { confirmBookingService, createBookingService } from "@/services/booking.service";
import { Input } from "../ui/input";
import { convertToDateTimeLocal } from "@/utils/date.util";
import { bookingCostHelper } from "@/helper/booking.helper";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BOOKING_MESSAGES } from "@/constants/messages/booking.message";

const BookingForm = ({
  defaultData,
}: {
  defaultData?: { userId: string; parkingSpaceId: string };
}) => {
  const form = useForm<BookingCreationType>({
    resolver: zodResolver(bookingCreationSchema),
    defaultValues: {
      userId: defaultData?.userId,
      startTime: Date.now(),
      endTime: Date.now(),
      parkingSpaceId: defaultData?.parkingSpaceId,
    },
  });

  const [totalCost, setTotalCost] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  console.log("totalCost", totalCost);
  console.log("discountRate", discountRate);

  // Handle time change and trigger get price and discount
  const handleTimeChange = async (fieldName: string, value: number) => {
    // Set form value
    form.setValue(fieldName as keyof BookingCreationType, value);

    // Prepare booking object to get discount and base cost
    const bookingData = {
      ...form.getValues(),
      userId: defaultData?.userId as string,
      parkingSpaceId: defaultData?.parkingSpaceId as string,
    };

    const result = await bookingCostHelper(bookingData);

    // Show error message if no parking lot is found
    if (!result || !result.data) {
      setError(result.message);
      return;
    }
    // Reset error message
    setError(null);
    // Set total cost and discount rate
    setTotalCost(result.data.totalCost ? result.data.totalCost : 0);
    setDiscountRate(result.data.discountRate ? result.data.discountRate : 0);
  };

  // Handle form submission
  const onSubmit = async (values: BookingCreationType) => {
    const bookingData = {
      ...values,
      userId: defaultData?.userId as string,
      parkingSpaceId: defaultData?.parkingSpaceId as string,
    };

    const validationResult = bookingCreationSchema.safeParse(bookingData);
    if (!validationResult.success) {
      setError(BOOKING_MESSAGES.ERROR.INVALID_INPUT_FOR_CREATE)
      return;
    }
    // Create booking
    const createResponse = await createBookingService(bookingData);
    if (!createResponse.result || !createResponse.data || !createResponse.data.bookingId) {
      setError(createResponse.message);
      return;
    }
    // Confirm booking
    confirmBookingService(
      createResponse.data.bookingId,
      {
        userId: defaultData?.userId as string,
        state: "confirmed",
      });

    // Close the modal
    onCancelClick()
  };

  const router = useRouter();
  // Handle cancel button
  const onCancelClick = () => {
    form.reset();
    router.back();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Start Time Field */}
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between gap-8 items-center">
                <FormLabel className="nowrap">Start Time</FormLabel>
                <FormControl>
                  <Input
                    className="w-2/3"
                    type="datetime-local"
                    value={convertToDateTimeLocal(field.value)}
                    onChange={(e) =>
                      handleTimeChange("startTime", new Date(e.target.value).getTime())
                    }
                  />
                </FormControl>
              </div>
              <FormDescription>The start time of the booking.</FormDescription>
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
              <div className="flex justify-between gap-8 items-center">
                <FormLabel className="nowrap">End Time</FormLabel>
                <FormControl>
                  <Input
                    className="w-2/3"
                    type="datetime-local"
                    value={convertToDateTimeLocal(field.value)}
                    onChange={(e) =>
                      handleTimeChange("endTime", new Date(e.target.value).getTime())
                    }
                  />
                </FormControl>
              </div>
              <FormDescription>The end time of the booking.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Total Cost Field */}
        {totalCost > 0 ? <div className="flex flex-col space-y-2 p-4 bg-white rounded-lg shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Original Price:</span>
              <span className="text-xs text-gray-500 line-through">${totalCost}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Discount Rate:</span>
              <span className="text-xs text-green-500">{(discountRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-lg text-black">
              <span>Final Price:</span>
              <span>${(totalCost * (1 - discountRate)).toFixed(1)}</span>
            </div>
          </div>
        </div> : null}
        {error && <FormMessage className="text-xs text-red-500">{error}</FormMessage>}
        {/* Cancel and Submit Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            className="mr-2 w-16 flex-1"
            variant="outline"
            onClick={onCancelClick}
            type="button" // Prevent form submission, it may trigger unpexpected toast message(cancel may bring null data)
          >
            Cancel
          </Button>
          <Button
            className="w-16 flex-1"
            type="submit"
            disabled={form.formState.isSubmitting}>
            Book Now
          </Button>
        </div>
      </form>
    </Form >
  );
};

export default BookingForm;
