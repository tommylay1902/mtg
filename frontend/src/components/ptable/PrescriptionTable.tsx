/// <reference types="vite-plugin-svgr/client" />
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AscSort from "@/assets/ascSortArrow.svg?react";
import DscSort from "@/assets/dscSortArrow.svg?react";
import DefaultSort from "@/assets/defaultSort.svg?react";
import {
  generatePrescriptionTemplate,
  Prescription,
} from "@/shared/types/Prescription";
import { stringToUSDate } from "@/shared/util/Date";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface PrescriptionTableProps {
  data: Prescription[] | undefined;
}

const tableHeaders = Object.keys(generatePrescriptionTemplate());

const PrescriptionTable: React.FC<PrescriptionTableProps> = ({ data }) => {
  const [hover, setHover] = useState("");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  // const [resetSelection, setResetSelection] = useState<boolean>(false);
  const columnHelper = createColumnHelper<Prescription>();

  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => {
        console.log(selectedRows);
        return (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value: boolean) => {
              if (value) {
                setSelectedRows(data ? data.map((p) => p.id) : []);
              } else {
                setSelectedRows([]);
              }
              table.toggleAllPageRowsSelected(value);
            }}
          />
        );
      },
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked: boolean) => {
            if (checked) {
              setSelectedRows((prev) => [...prev, row.original.id]);
            } else {
              setSelectedRows((prev) =>
                prev.filter((id) => id !== row.original.id)
              );
            }
            row.getToggleSelectedHandler()(checked);
          }}
        />
      ),
    }),
    ...tableHeaders.map((h) => {
      return columnHelper.accessor(h, {
        cell: (info) => {
          return (h === "started" || h === "ended") && typeof h === "string"
            ? stringToUSDate(`${info.getValue()}`)
            : info.getValue();
        },
        header: () => {
          // sorting[0].id == h && s
          if (sorting.length === 0 || sorting[0].id !== h) {
            return (
              <span>
                <DefaultSort className={"inline-block"} /> {h.toUpperCase()}
              </span>
            );
          }
          return sorting[0].desc ? (
            <span>
              <DscSort className={"inline-block"} />
              {h.toUpperCase()}
            </span>
          ) : (
            <span>
              <AscSort className={"inline-block"} />
              {h.toUpperCase()}
            </span>
          );
        },
      });
    }),
  ];

  const table = useReactTable({
    columns,
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => setSorting(updater),
    state: { sorting },
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              if (header.isPlaceholder || header.id == "id") {
                return null;
              }

              return (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  onMouseEnter={() => setHover(header.id)}
                  onMouseLeave={() => setHover("")}
                  className={`
                    ${hover === header.id ? "text-black" : ""} 
                    ${
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }`}
                >
                  <span>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </span>
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => {
              if (cell.column.id === "id") {
                return null;
              }
              if (cell.column.id === "ended") {
                return cell.getValue() == null ? (
                  <TableCell key={cell.id}>Current</TableCell>
                ) : (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              }

              return (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PrescriptionTable;
