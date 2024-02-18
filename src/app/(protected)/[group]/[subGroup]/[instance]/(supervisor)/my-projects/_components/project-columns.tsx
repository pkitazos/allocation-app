import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Project } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { X } from "lucide-react";
import Link from "next/link";

export function columns(
  removeRow: (id: string) => void,
  clearTable: () => void,
): ColumnDef<
  Pick<Project, "id" | "title" | "capacityLowerBound" | "capacityUpperBound">
>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "id",
      accessorFn: ({ id }) => id,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-16"
          column={column}
          title="ID"
          canFilter
        />
      ),
      cell: ({
        row: {
          original: { capacityUpperBound },
        },
      }) => <div className="w-16">{capacityUpperBound}</div>,
    },
    {
      id: "title",
      accessorFn: ({ title }) => title,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" canFilter />
      ),
      cell: ({
        row: {
          original: { id, title },
        },
      }) => (
        <Link href={`projects/${id}`}>
          <Button variant="link">{title}</Button>
        </Link>
      ),
    },
    {
      id: "capacityUpperBound",
      accessorFn: ({ capacityUpperBound }) => capacityUpperBound,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-12"
          column={column}
          title="Upper Bound"
        />
      ),
      cell: ({
        row: {
          original: { capacityUpperBound },
        },
      }) => <div className="w-12 text-center">{capacityUpperBound}</div>,
    },
    {
      accessorKey: "actions",
      id: "Actions",
      header: ({ table }) => {
        const allSelected = table.getIsAllRowsSelected();

        if (allSelected)
          return (
            <Button variant="ghost" size="icon" onClick={clearTable}>
              <X className="h-5 w-5" />
            </Button>
          );

        return <div className="w-fit" />;
      },
      cell: ({
        row: {
          original: { id },
        },
      }) => {
        return (
          <Button variant="ghost" size="icon" onClick={() => removeRow(id)}>
            <X className="h-5 w-5" />
          </Button>
        );
      },
    },
  ];
}
