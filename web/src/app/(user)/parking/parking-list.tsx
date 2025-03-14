import DialogModal from "@/components/DialogModal";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/forms/SearchBarForm";
import Table from "@/components/Table";
import { TableCell, TableRow } from "@/components/ui/table";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Pencil, Rows3 } from "lucide-react";
import Link from "next/link";
import { arrayConverter } from "@/utils/array.util";
import { addressGenerator } from "@/helper/parking.helper";
import DeleteForm from "@/components/forms/DeleteForm";
// import ParkingForm from "@/components/forms/ParkingForm";
import { ParkingSpaceDataModel } from "@/types/convex.type";
import AddressFilter from "../booking/address-filter";
import { Button } from "@/components/ui/button";

export const ParkingListContent = ({
  mode,
  page,
  role = "user",
  parkings,
  cities,
}: {
  mode?: string;
  page: number;
  role: string;
  parkings: ParkingSpaceDataModel[];
  cities: string[];
}) => {
  // Total pages
  const totalPages = Math.max(1, Math.ceil(parkings.length / ITEM_PER_PAGE));
  // Slice parkings per page
  const parkingsPerPage: ParkingSpaceDataModel[] =
    mode !== "mobile"
      ? (arrayConverter(parkings)).get(page) ?? []
      : parkings.slice(0, page * ITEM_PER_PAGE) ?? [];

  const renderRow = (item: ParkingSpaceDataModel) => (
    <TableRow
      className="cursor-pointer hover:bg-gray-200 active:bg-gray-300 rounded-md 
      transition-all duration-200 shadow-sm hover:shadow-md text-center"
      key={item._id}
    >
      <TableCell className="font-medium w-3/12 truncate">{item.name}</TableCell>
      <TableCell className="w-5/12 truncate">
        {addressGenerator(item.city, item.area, item.street, item.unit)}
      </TableCell>
      <TableCell className="w-1/12">{item.availableSlots}/{item.totalSlots}</TableCell>
      <TableCell className="w-1/12">{item.pricePerHour}$/h</TableCell>
      <TableCell className="w-2/12">
        <div className="flex justify-center gap-2">
          <Link href={`/parking/${item._id}`}>
            <Rows3 color="#7b39ed" />
          </Link>
          {role === "admin" && (
            <>
              <DialogModal triggerButtonText="Delete">
                <DeleteForm id={item._id} />
              </DialogModal>
              {/* todo: temporary capture position */}
              <Pencil color="#7b39ed" />
              {/* <DialogModal triggerButtonText="Edit">
                <ParkingForm operationType="edit" defaultData={item} />
              </DialogModal> */}
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Address", accessor: "address" },
    { header: "Slot", accessor: "slot" },
    { header: "Rate", accessor: "rate" },
    { header: "Actions", accessor: "action" },
  ];

  return (
    <div className="flex flex-col container mx-auto max-w-5xl items-center gap-4 p-2">
      <div className="flex flex-col md:flex-row md:justify-between items-end gap-4 w-full">
        <AddressFilter cities={cities} />
        <SearchBar />
        <Button className="w-full md:w-auto">New notice</Button>
        {/* {role === "admin" && (
          <DialogModal triggerButtonText="New notice" triggerButtonStyles="w-full md:w-auto">
            <ParkingForm operationType="create" />
          </DialogModal>
        )} */}
      </div>
      <div className="w-full bg-gray-50 p-4 rounded-lg">
        <Table columns={columns} renderRow={renderRow} data={parkingsPerPage} />
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default ParkingListContent;
