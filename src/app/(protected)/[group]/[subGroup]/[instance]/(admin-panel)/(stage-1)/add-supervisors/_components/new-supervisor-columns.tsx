import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { NewSupervisor } from "@/lib/validations/csv";
import { ColumnDef } from "@tanstack/react-table";
import { X } from "lucide-react";

export const columns: ColumnDef<NewSupervisor>[] = [
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
    id: "projectTarget",
    accessorFn: ({ projectTarget }) => projectTarget,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Target" />
    ),
  },
  {
    id: "projectUpperQuota",
    accessorFn: ({ projectUpperQuota }) => projectUpperQuota,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Upper Quota" />
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
