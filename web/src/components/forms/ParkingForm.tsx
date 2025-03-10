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
import { toast } from "sonner"
import { ParkingSpaceDataModel } from "@/types/parking-space.type"
import { parkingSpaceSchema, ParkingSpaceType } from "@/validators/parking-space.validator"
import { createParkingSpaceService, updateParkingSpaceService } from "@/services/parking.service"
import { Switch } from "@radix-ui/react-switch"


const ParkingForm = ({
  operationType,
  defaultData,
  onClose,
}: {
  operationType: 'create' | 'edit'
  defaultData?: ParkingSpaceDataModel
  onClose?: () => void
}) => {

  // Define form.
  const form = useForm<ParkingSpaceType>({
    resolver: zodResolver(parkingSpaceSchema),
    defaultValues: {
      name: defaultData?.name ?? '',
      city: defaultData?.city ?? '',
      area: defaultData?.area ?? '',
      street: defaultData?.street ?? '',
      unit: defaultData?.unit ?? '',
      totalSlots: defaultData?.totalSlots ?? 0,
      availableSlots: defaultData?.availableSlots ?? 0,
      pricePerHour: defaultData?.pricePerHour ?? 0,
      isActive: defaultData?.isActive ?? false,
      location: defaultData?.location ?? { lat: 0, lng: 0 },
    }, //Load default values for edit action
  })

  // Define a submit handler.
  const onSubmit = async (values: ParkingSpaceType) => {
    const result = parkingSpaceSchema.safeParse(values);
    if (!result.success) return;
    // Call create or update message function
    switch (operationType) {
      case 'create':
        const response = await createParkingSpaceService(
          values.name,
          values.location,
          values.city,
          values.area,
          values.street,
          values.unit,
          values.totalSlots,
          values.pricePerHour
        );
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
          const response = await updateParkingSpaceService(defaultData._id, {
            name: values.name,
            location: values.location,
            city: values.city,
            area: values.area,
            street: values.street,
            unit: values.unit,
            totalSlots: values.totalSlots,
            pricePerHour: values.pricePerHour,
            isActive: values.isActive,
          });
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
        {operationType === 'create' ? 'Create Parking Lots' : 'Edit Parking Lots'}
      </AlertDialogTitle>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="text-xs"
                  placeholder="Enter parking space name" {...field} />
              </FormControl>
              <FormDescription>
                Name of parking lots.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City Field */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  className="text-xs"
                  placeholder="Enter city" {...field} />
              </FormControl>
              <FormDescription>
                City of parking lots.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Area Field */}
        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area</FormLabel>
              <FormControl>
                <Input
                  className="text-xs"
                  placeholder="Enter area" {...field} />
              </FormControl>
              <FormDescription>
                Area of parking lots.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Street Field */}
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street</FormLabel>
              <FormControl>
                <Input
                  className="text-xs"
                  placeholder="Enter street" {...field} />
              </FormControl>
              <FormDescription>
                Street of parking lots.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Unit Field */}
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Input
                  className="text-xs"
                  placeholder="Enter unit" {...field} />
              </FormControl>
              <FormDescription>
                Unit of parking lots.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Total Slots Field */}
        <FormField
          control={form.control}
          name="totalSlots"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Slots</FormLabel>
              <FormControl>
                <Input
                  className="text-xs"
                  type="number"
                  placeholder="Enter total slots" {...field} />
              </FormControl>
              <FormDescription>
                Total slots of parking lots.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Per Hour Field */}
        <FormField
          control={form.control}
          name="pricePerHour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Per Hour</FormLabel>
              <FormControl>
                <Input
                  className="text-xs"
                  type="number"
                  placeholder="Enter price per hour" {...field} />
              </FormControl>
              <FormDescription>
                Available slots of parking lots.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Field (Latitude and Longitude) */}
        <FormField
          control={form.control}
          name="location.lat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input
                  className="text-xs"
                  type="number"
                  placeholder="Enter latitude" {...field} />
              </FormControl>
              <FormDescription>
                Latitude of parking lots.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location.lng"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input
                  className="text-xs"
                  type="number"
                  placeholder="Enter longitude" {...field} />
              </FormControl>
              <FormDescription>
                Longitude of parking lots.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Active Field */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Is Active</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cancel Button */}
        <AlertDialogCancel
          className="mr-2"
          disabled={form.formState.isLoading}>
          Cancel
        </AlertDialogCancel>

        {/* Submit Button */}
        <Button type="submit">
          {operationType === "create" ? "Create Parking Space" : "Update Parking Space"}
        </Button>
      </form>
    </Form>
  );
};
export default ParkingForm;