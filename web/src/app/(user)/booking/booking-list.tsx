import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import DialogModal from "@/components/DialogModal";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/forms/SearchBarForm";
import Table from "@/components/Table";
import { TableCell, TableRow } from "@/components/ui/table";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Rows3 } from "lucide-react";
import Link from "next/link";
import { arrayConverter } from "@/utils/array.util";
import DeleteForm from "@/components/forms/DeleteForm";
import ParkingForm from "@/components/forms/ParkingForm";
import { BookingDataModel } from "@/types/convex.type";
import { convexTimeToDisplayFormat, convexTimeToParkingTime } from "@/utils/date.util";
import BookingForm from "@/components/forms/BookingForm";

export const BookingListContent = ({
  mode,
  page,
  role = "user",
  bookings = [],
}: {
  mode?: string;
  page: number;
  role: string;
  bookings: BookingDataModel[];
}) => {
  // Total pages
  const totalPages = Math.max(1, Math.ceil(bookings.length / ITEM_PER_PAGE));
  // Slice parkings per page

  const bookingsPerPage: BookingDataModel[] =
    mode !== "mobile"
      ? (arrayConverter(bookings)).get(page) ?? []
      : bookings.slice(0, page * ITEM_PER_PAGE) ?? [];

  const renderRow = (item: BookingDataModel) => (
    <TableRow
      className="cursor-pointer hover:bg-gray-200 active:bg-gray-300 rounded-md transition-all duration-200 shadow-sm hover:shadow-md text-center"
      key={item._id}
    >
      <TableCell className="font-medium w-3/12 truncate">{item.parkingName}</TableCell>
      <TableCell className="w-3/12 truncate">
        {convexTimeToParkingTime(item.startTime)} - {convexTimeToParkingTime(item.endTime)}
      </TableCell>
      <TableCell className="w-2/12">{convexTimeToDisplayFormat(item.startTime)}</TableCell>
      <TableCell className="w-1/12">{item.totalCost.toFixed(2)}</TableCell>
      <TableCell className="w-1/12">{item.state}</TableCell>
      <TableCell className="w-2/12">
        <div className="flex justify-center gap-2">
          <Link href={`/booking/${item._id}`}>
            <Rows3 color="#7b39ed" />
          </Link>
          {role === "admin" && (
            <>
              <DialogModal triggerButtonText="Delete">
                <DeleteForm id={item._id} />
              </DialogModal>
              <DialogModal triggerButtonText="Edit">
                <BookingForm operationType="edit" defaultData={item} />
              </DialogModal>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  const columns = [
    { header: "Parking Name", accessor: "parking" },
    { header: "Duration", accessor: "duration" },
    { header: "Date", accessor: "date" },
    { header: "Estimated Cost", accessor: "payment" },
    { header: "State", accessor: "state" },
    { header: "Actions", accessor: "action" },
  ];

  return (
    <div className="flex flex-col container mx-auto max-w-5xl items-center gap-4 p-2">
      <div className="flex flex-col md:flex-row md:justify-between items-end gap-4 w-full">
        <DatePickerWithRange className="w-full md:w-auto" />
        <SearchBar />
        {role === "admin" && (
          <DialogModal triggerButtonText="New notice" triggerButtonStyles="w-full md:w-auto">
            <ParkingForm operationType="create" />
          </DialogModal>
        )}
      </div>
      <div className="w-full bg-gray-50 p-4 rounded-lg">
        <Table columns={columns} renderRow={renderRow} data={bookingsPerPage ?? []} />
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default BookingListContent;
