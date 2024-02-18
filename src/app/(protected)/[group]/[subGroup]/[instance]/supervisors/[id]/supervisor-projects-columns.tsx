import { ColumnDef } from "@tanstack/react-table";
import { LucideMoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface SupervisorProjectData {
  id: string;
  title: string;
}

export const columns: ColumnDef<SupervisorProjectData>[] = [
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
      <DataTableColumnHeader column={column} title="ID" canFilter />
    ),
  },
  {
    id: "title",
    accessorFn: ({ title }) => title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" canFilter />
    ),
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: () => {
      return <div className="text-xs text-gray-500">Actions</div>;
    },
    cell: ({ row: { original: project } }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <LucideMoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {/* // TODO fix link */}
              <Link href={`${project.id}`}>
                <Button variant="link">View Details</Button>
              </Link>
            </DropdownMenuItem>
            {false && (
              <DropdownMenuItem>
                {/* // TODO: implement delete */}
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => {
                    return;
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
