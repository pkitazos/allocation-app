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

export interface StudentData {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const columns: ColumnDef<StudentData>[] = [
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
    id: "name",
    accessorFn: ({ user }) => user.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" canFilter />
    ),
    cell: ({
      row: {
        original: {
          user: { id, name },
        },
      },
    }) => (
      <Button variant="link">
        <Link href={`students/${id}`}>{name}</Link>
      </Button>
    ),
  },
  {
    id: "id",
    accessorFn: ({ user }) => user.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    id: "email",
    accessorFn: ({ user }) => user.email,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "actions",
    id: "Actions",
    header: () => {
      return <div className="text-xs text-gray-500">Actions</div>;
    },
    cell: ({
      row: {
        original: { user },
      },
    }) => {
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
              <a href={`/students/${user.id}`}>
                <Button variant="link">View Details</Button>
              </a>
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
