import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import DialogModal from "@/components/DialogModal";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/forms/SearchBarForm";
import Table from "@/components/Table";
import { TableCell, TableRow } from "@/components/ui/table";
import Loading from "@/components/Loading";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { SignIn } from "@clerk/nextjs";
import { Rows3 } from "lucide-react";
import Link from "next/link";
import { ParkingSpaceDataModel } from "@/types/parking-space.type";
import { arrayConverter } from "@/utils/array.util";
import { addressGenerator } from "@/helper/parking.helper";
import DeleteForm from "@/components/forms/DeleteForm";
import ParkingForm from "@/components/forms/ParkingForm";

export const ParkingListContent = ({
  mode = 'desktop',
  pageNum,
  status,
  role,
  parkings,
}: {
  mode?: string
  pageNum: number,
  status: 'loading' | 'unAuthenticated' | 'authenticated',
  role: 'user' | 'admin',
  parkings: ParkingSpaceDataModel[],
}) => {
  // Handle the Loading, unAuthenticated
  if (!parkings) return <Loading />;
  if (status === 'unAuthenticated') return <SignIn />;

  // Get total pages
  const totalPages = Math.ceil(parkings.length / ITEM_PER_PAGE);

  // Get notice list by page number (big screen (ItemPerPage) or little screen (pageNum*ItemPerPage))
  const parkingsPerPage: ParkingSpaceDataModel[] = mode !== 'mobile'
    ? (arrayConverter(parkings).get(pageNum)) ?? []
    : (parkings.slice(0, pageNum * ITEM_PER_PAGE)) ?? [];

  const renderRow = (item: ParkingSpaceDataModel) => {
    return (
      <TableRow
        className="cursor-pointer hover:bg-gray-200
         active:bg-gray-300 rounded-md transition-all duration-200 
         shadow-sm hover:shadow-md text-center"
        key={item._id}
      >
        <TableCell className="font-medium w-3/12 truncate">{item.name}</TableCell>
        <TableCell className="w-6/12 truncate">
          {addressGenerator(item.city, item.area, item.street, item.unit)}
        </TableCell>
        <TableCell className="w-2/12">{item.availableSlots}</TableCell>
        <TableCell className="w-1/12">
          {/* View button*/}
          <div className="flex justify-center gap-2">
            <Link href={`/admin/parking/${item._id}`}>
              <Rows3 color="#7b39ed" />
            </Link>
            {/* Delete button and dialog */}
            {role === 'admin'
              ? <DialogModal triggerButtonText="Delete">
                <DeleteForm id={item._id} />
              </DialogModal> : null}
            {/* Edit button and dialog */}
            {role === 'admin' ? <DialogModal triggerButtonText="Edit">
              <ParkingForm operationType="edit" defaultData={item} />
            </DialogModal> : null}
          </div>
        </TableCell>
      </TableRow>
    )
  }

  // Column data
  const columns = [
    {
      header: 'Title',
      accessor: 'title',
    },
    {
      header: 'Description',
      accessor: 'description',
    },
    {
      header: 'Time',
      accessor: 'time',
    },
    {
      header: 'Actions',
      accessor: 'action',
    }
  ];

  return (
    <div className="flex flex-col container mx-auto max-w-5xl items-center gap-4 p-2">
      {/* Function bar */}
      <div className="flex flex-col md:flex-row md:justify-between items-end gap-4 w-full">
        <DatePickerWithRange className="w-full md:w-auto" />
        <SearchBar />
        {role === 'admin' ? <DialogModal
          triggerButtonText="New notice"
          triggerButtonStyles="w-full md:w-auto"
        >
          <ParkingForm operationType="create" />
        </DialogModal> : null}
      </div>
      {/* Table content */}
      <div className="w-full bg-gray-50 p-4 rounded-lg">
        {/* [] to avoid crash */}
        <Table
          columns={columns}
          renderRow={renderRow}
          data={parkingsPerPage ?? []} />
        <Pagination currentPage={pageNum} totalPages={totalPages} />
      </div>
    </div>
  )
}

export default ParkingListContent