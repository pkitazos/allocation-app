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
import { Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { LucideMoreHorizontal, Trash2, X } from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";

export interface ProjectTableData {
  user: User & {
    id: string;
  };
  id: string;
  title: string;
  description: string;
  supervisor: {
    user: {
      id: string;
      name: string | null;
    };
  };
}

export function projectColumns(
  user: User,
  role: Role,
  deleteProject: (id: string) => void,
  deleteAllProjects: () => void,
): ColumnDef<ProjectTableData>[] {
  const selectRow: ColumnDef<ProjectTableData> = {
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
  };

  const userCols: ColumnDef<ProjectTableData>[] = [
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" canFilter />
      ),
      cell: ({
        row: {
          original: { id, title },
        },
      }) => (
        <Button variant="link">
          <Link href={`projects/${id}`}>{title}</Link>
        </Button>
      ),
    },
    {
      id: "supervisor",
      accessorFn: (row) => row.supervisor.user.name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Supervisor" />
      ),
    },
    {
      accessorKey: "actions",
      id: "Actions",
      header: ({ table }) => {
        const allSelected = table.getIsAllRowsSelected();

        if (allSelected)
          return (
            <Button variant="ghost" size="icon" onClick={deleteAllProjects}>
              <X className="h-5 w-5" />
            </Button>
          );

        return <div className="text-xs text-gray-500">Actions</div>;
      },
      cell: ({ row }) => {
        const project = row.original;
        const supervisor = row.original.supervisor.user;
        console.log("Project Supervisor --------", supervisor.id);
        console.log("current user --------", user.id);
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <span className="sr-only">Open menu</span>
                <LucideMoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`projects/${project.id}`}>
                  <Button variant="link">View Details</Button>
                </Link>
              </DropdownMenuItem>
              {(role === Role.ADMIN || user.id === supervisor.id) && (
                <DropdownMenuItem>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => deleteProject(project.id)}
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

  return role === Role.ADMIN ? [selectRow, ...userCols] : userCols;
}
