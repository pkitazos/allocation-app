import { Role, Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { LucideMoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { User } from "next-auth";

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

import { stageCheck } from "@/lib/utils/permissions/stage-check";

export interface SupervisorProjectData {
  id: string;
  title: string;
  supervisorId: string;
}

export function columns(
  user: User,
  role: Role,
  stage: Stage,
  supervisorId: string,
  deleteSupervisor: (id: string) => void,
  deleteAllSupervisors: () => void,
): ColumnDef<SupervisorProjectData>[] {
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
      header: ({ table }) => {
        const allSelected = table.getIsAllRowsSelected();

        if (
          allSelected &&
          (role === Role.ADMIN ||
            (user.id === supervisorId &&
              !stageCheck(stage, Stage.PROJECT_ALLOCATION)))
        ) {
          return (
            <div className="flex justify-center">
              <Button
                className="flex items-center gap-2"
                variant="destructive"
                size="sm"
                onClick={deleteAllSupervisors}
              >
                <Trash2 className="h-4 w-4" />
                <p>Delete All</p>
              </Button>
            </div>
          );
        }
        return <div className="text-xs text-muted-foreground">Actions</div>;
      },
      cell: ({ row: { original: project } }) => {
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
              {(role === Role.ADMIN || user.id === supervisorId) &&
                !stageCheck(stage, Stage.PROJECT_ALLOCATION) && (
                  <DropdownMenuItem>
                    <Button
                      className="flex w-full items-center gap-2"
                      variant="destructive"
                      onClick={() => deleteSupervisor(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <p>Delete</p>
                    </Button>
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
