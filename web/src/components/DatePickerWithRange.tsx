"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { format, subDays, isBefore, isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange, SelectSingleEventHandler } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams()

  // Get last week and today
  const today = new Date();
  const lastWeek = subDays(today, 7);

  // Get date range from URL search params, or use last week and today
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: searchParams.get("start") ? new Date(searchParams.get("start") ?? '') : today,
    to: searchParams.get("end") ? new Date(searchParams.get("end") ?? '') : lastWeek,
  });


  // Use tempDate to store the selected date range
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date);
  // Use open to control the popover
  const [open, setOpen] = React.useState(false);

  // First Click: Always sets the from date.
  // Second Click: Compares with from and assigns the earlier one to from and the later one to to.
  const handleDateClick: SelectSingleEventHandler = (selectedDate) => {
    if (!selectedDate) return; // Ensure selectedDate is defined

    setTempDate((prev) => {
      if (!prev?.from) {
        // First click: Set from date and clear 'to'
        return { from: selectedDate, to: undefined };
      } else if (!prev?.to) {
        // Second click: Ensure order (earlier date as 'from', later date as 'to')
        return isBefore(selectedDate, prev.from)
          ? { from: selectedDate, to: prev.from }
          : { from: prev.from, to: selectedDate };
      } else {
        // Reset if both dates exist (start new selection)
        return { from: selectedDate, to: undefined };
      }
    });
  };

  // Method to Convert date to URL search params format "yyyy-mm-dd"
  const dateParamsValue = (tempDateValue: Date | undefined) => {
    if (!tempDateValue) return "";
    return `${tempDateValue?.getFullYear()}-${tempDateValue?.getMonth() + 1}-${tempDateValue?.getDate()}`;
  };

  // Confirm the selected date range "?start=from&end=to"
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form submission (page reload)

    if (tempDate?.from && tempDate?.to) {
      const params = new URLSearchParams();

      // Convert date to URL search params format
      const from = dateParamsValue(tempDate.from);
      const to = dateParamsValue(tempDate.to);

      // Set new date range parameters (use "start" and "end" instead of "from" and "to" for the search params)
      params.set("start", from);
      params.set("end", to);
      params.set("page", "1"); // Reset page to 1 after the search

      // Update the URL with date range query and reset page
      router.push(`${path}?${params.toString()}`, { scroll: false });

      // Update date state to reflect the selected range
      setDate(tempDate);

      // Close the popover
      setOpen(false);
    }
  };

  const handleReset = () => {
    setTempDate({ from: lastWeek, to: today });
  };

  const handleCancel = () => {
    setTempDate(date);
    setOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button id="date" variant="outline" className="min-w-[250px] justify-center text-left font-normal">
            <CalendarIcon className="mr-2" />
            {tempDate?.from ? (
              tempDate.to ? (
                <>
                  {format(tempDate.from, "dd LLL, y")} - {format(tempDate.to, "dd LLL, y")}
                </>
              ) : (
                format(tempDate.from, "dd LLL, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <Calendar
            initialFocus
            mode="single"
            defaultMonth={today}
            selected={tempDate?.to || tempDate?.from}
            onSelect={handleDateClick}
            numberOfMonths={1}
            modifiers={{
              today: () => !tempDate?.from && !tempDate?.to, // No selection, keep default style
              inRangeStart: (day) => tempDate?.from && isSameDay(day, tempDate.from) ? true : false,
              inRange: (day) => tempDate?.from && tempDate?.to && isBefore(tempDate.from, day) && isBefore(day, tempDate.to) ? true : false,
              highlightedEnd: (day) => tempDate?.to && isSameDay(day, tempDate.to) ? true : false,
            }}
            modifiersClassNames={{
              today: "bg-gray-200 text-gray-900", // Default style if no date selected,otherwise remove style
              inRangeStart: "bg-gray-100 text-gray-900", // Start date (same as range)
              inRange: "bg-gray-100 text-gray-900", // Range
              highlightedEnd: "bg-blue-200 text-blue-900 rounded-md", // End date (highlighted)
            }}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="default" onClick={(handleConfirm)} disabled={!tempDate?.from || !tempDate?.to}>
              Confirm
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
