import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import DialogModal from "@/components/DialogModal";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/forms/SearchBarForm";
import Table from "@/components/Table";
import { TableCell, TableRow } from "@/components/ui/table";
import NoticeForm from "@/components/forms/NoticeForm";
import { NoticeDataModel } from "@/types/convex-type";
import Loading from "@/components/Loading";
import { paginatedNotices } from "@/services/notice-service";
import { ConvexTimeToDisplayFormat } from "@/utils/date-convertor";
import { ClassroomEnum } from "@/constants/class-enum";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { SignIn } from "@clerk/nextjs";
import DeleteNoticeForm from "@/components/forms/DeleteNoticeForm";
import { Rows3 } from "lucide-react";
import Link from "next/link";

export const NoticeListContent = ({
  pageNum,
  status,
  role,
  notices,
  classroom,
  mode = 'desktop',
}: {
  pageNum: number,
  status: 'loading' | 'unAuthenticated' | 'authenticated',
  role: 'student' | 'teacher',
  classroom: ClassroomEnum,
  notices: NoticeDataModel[],
  mode?: string
}) => {
  // Handle the Loading, unAuthenticated
  if (!notices) return <Loading />;
  if (status === 'unAuthenticated') return <SignIn />;

  // Get total pages
  const totalPages = Math.ceil(notices.length / ITEM_PER_PAGE);

  // Get notice list by page number (big screen (ItemPerPage) or little screen (pageNum*ItemPerPage))
  const noticesPerPage: NoticeDataModel[] = mode !== 'mobile'
    ? (paginatedNotices(notices).get(pageNum)) ?? []
    : (notices.slice(0, pageNum * ITEM_PER_PAGE)) ?? [];

  const renderRow = (item: NoticeDataModel) => {
    return (
      <TableRow
        className="cursor-pointer hover:bg-gray-200
         active:bg-gray-300 rounded-md transition-all duration-200 
         shadow-sm hover:shadow-md text-center"
        key={item._id}
      >
        <TableCell className="font-medium w-3/12 truncate">{item.title}</TableCell>
        <TableCell className="w-6/12 truncate">{item.description}</TableCell>
        <TableCell className="w-2/12">{ConvexTimeToDisplayFormat(item._creationTime)}</TableCell>
        <TableCell className="w-1/12">
          {/* Bind FormModal to buttons*/}
          <div className="flex justify-center gap-2">
            <Link href={`/notice/${item._id}`}>
              <Rows3 color="#7b39ed" />
            </Link>
            {/* Delete button and dialog */}
            {role === 'teacher'
              ? <DialogModal triggerButtonText="Delete">
                <DeleteNoticeForm defaultData={item} />
              </DialogModal> : null}
            {/* Edit button and dialog */}
            {role === 'teacher' ? <DialogModal triggerButtonText="Edit">
              <NoticeForm operationType="edit" classroom={classroom} defaultData={item} />
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
        {role === 'teacher' ? <DialogModal
          triggerButtonText="New notice"
          triggerButtonStyles="w-full md:w-auto"
        >
          <NoticeForm operationType="create" classroom={classroom} />
        </DialogModal> : null}
      </div>
      {/* Table content */}
      <div className="w-full bg-gray-50 p-4 rounded-lg">
        {/* [] to avoid crash */}
        <Table
          columns={columns}
          renderRow={renderRow}
          data={noticesPerPage ?? []} />
        <Pagination currentPage={pageNum} totalPages={totalPages} />
      </div>
    </div>
  )
}

export default NoticeListContent