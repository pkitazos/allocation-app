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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { stageCheck } from "@/lib/utils/permissions/stage-check";

export type SupervisorData = {
  id: string;
  name: string;
  email: string;
};

export function supervisorColumns(
  user: User,
  role: Role,
  stage: Stage,
  deleteSupervisor: (id: string) => void,
  deleteAllSupervisors: () => void,
): ColumnDef<SupervisorData>[] {
  const selectCol: ColumnDef<SupervisorData> = {
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

  const userCols: ColumnDef<SupervisorData>[] = [
    {
      id: "id",
      accessorFn: ({ id }) => id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" canFilter />
      ),
      cell: ({
        row: {
          original: { id },
        },
      }) => (
        <div className="text-left">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="cursor-default">
                  <div className="w-16 truncate"> {id}</div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p> {id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      id: "name",
      accessorFn: ({ name }) => name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({
        row: {
          original: { id, name },
        },
      }) => (
        <Button variant="link">
          <Link href={`./supervisors/${id}`}>{name}</Link>
        </Button>
      ),
    },
    {
      id: "email",
      accessorFn: ({ email }) => email,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
  ];

  const actionsCol: ColumnDef<SupervisorData> = {
    id: "actions",
    accessorKey: "actions",
    header: ({ table }) => {
      const allSelected = table.getIsAllRowsSelected();

      if (
        allSelected &&
        role === Role.ADMIN &&
        !stageCheck(stage, Stage.PROJECT_ALLOCATION)
      )
        return (
          <div className="flex justify-center">
            <Button
              className="flex items-center gap-2"
              variant="destructive"
              size="sm"
              onClick={deleteAllSupervisors}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );

      return (
        <div className="flex justify-center text-xs text-gray-500">Actions</div>
      );
    },
    cell: ({ row: { original: supervisor } }) => {
      return (
        <div className="flex justify-center">
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
                <Link href={`./supervisors/${supervisor.id}`}>
                  <Button variant="link">View Details</Button>
                </Link>
              </DropdownMenuItem>
              {role === Role.ADMIN &&
                !stageCheck(stage, Stage.PROJECT_ALLOCATION) && (
                  <DropdownMenuItem>
                    <Button
                      className="flex w-full items-center gap-2"
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteSupervisor(supervisor.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <p>Delete</p>
                    </Button>
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  };

  if (role !== Role.ADMIN) return userCols;

  return stageCheck(stage, Stage.PROJECT_ALLOCATION)
    ? [...userCols, actionsCol]
    : [selectCol, ...userCols, actionsCol];
}
