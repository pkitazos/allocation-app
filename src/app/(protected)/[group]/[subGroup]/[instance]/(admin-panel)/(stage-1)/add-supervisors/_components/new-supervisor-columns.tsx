import { ColumnDef } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";

import { NewSupervisor } from "@/lib/validations/csv";

export function columns(
  removeRow: (idx: number) => void,
  clearTable: () => void,
): ColumnDef<NewSupervisor>[] {
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
      id: "full Name",
      accessorFn: ({ fullName }) => fullName,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Full Name" />
      ),
    },
    {
      id: "university ID",
      accessorFn: ({ schoolId }) => schoolId,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="University ID"
          canFilter
        />
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
      id: "Project Target",
      accessorFn: ({ projectTarget }) => projectTarget,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Target" />
      ),
    },
    {
      id: "Project Upper Quota",
      accessorFn: ({ projectUpperQuota }) => projectUpperQuota,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Upper Quota" />
      ),
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
      cell: ({ row: { index } }) => {
        return (
          <Button variant="ghost" size="icon" onClick={() => removeRow(index)}>
            <X className="h-5 w-5" />
          </Button>
        );
      },
    },
  ];
}
