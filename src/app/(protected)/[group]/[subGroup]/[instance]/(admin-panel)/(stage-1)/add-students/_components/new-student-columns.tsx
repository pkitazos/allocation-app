import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { X } from "lucide-react";

import { NewStudent } from "./add-students";

export const columns: ColumnDef<NewStudent>[] = [
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
    id: "fullName",
    accessorFn: ({ fullName }) => fullName,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" canFilter />
    ),
  },
  {
    id: "schoolId",
    accessorFn: ({ schoolId }) => schoolId,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School ID" />
    ),
  },
  {
    id: "email",
    accessorFn: ({ email }) => email,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "actions",
    id: "Actions",
    header: () => <div className="w-fit" />,
    cell: () => {
      // TODO: implement row removal
      return (
        <Button variant="ghost" size="icon">
          <X className="h-5 w-5" />
        </Button>
      );
    },
  },
];
