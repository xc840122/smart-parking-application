import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Column = {
  header: string;
  accessor: string;
}

const TableView = <T,>({
  columns,
  renderRow,
  data }: {
    columns: Column[],
    renderRow: (item: T) => React.ReactNode,
    data: T[],
  }) => {

  return (
    <Table>
      <TableCaption>Welcome to parking save!</TableCaption>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              className={`text-center, ${column.accessor === 'address' ? 'hidden md:block' : ''}`}
              key={column.accessor}
            >{column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => renderRow(item))}
      </TableBody>
    </Table >)
}

export default TableView;