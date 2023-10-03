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
import { ColumnDef } from "@tanstack/react-table";
import { LucideMoreHorizontal } from "lucide-react";
import Link from "next/link";

export interface AllocationTableData {
  projectTitle: string;
  projectId: string;
  studentName: string;
  studentId: string;
  schoolId: string;
}

export const columns: ColumnDef<AllocationTableData>[] = [
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
    accessorKey: "projectTitle",
    id: "projectTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Title" canFilter />
    ),
  },
  {
    accessorKey: "studentName",
    id: "studentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" canFilter />
    ),
  },
  {
    accessorKey: "schoolId",
    id: "schoolId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="School Id" canFilter />
    ),
  },
  {
    accessorKey: "actions",
    id: "Actions",
    header: () => <div className="text-xs text-gray-500">Actions</div>,
    cell: ({ row }) => (
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
            <Link href={`/projects/${row.original.projectId}`}>
              <Button variant="link">View Project</Button>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/students/${row.original.studentId}`}>
              <Button variant="link">View Student</Button>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
