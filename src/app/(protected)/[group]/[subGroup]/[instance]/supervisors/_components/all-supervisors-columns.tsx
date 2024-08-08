import { Role, Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  CornerDownRightIcon,
  LucideMoreHorizontal as MoreIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";

import { AccessControl } from "@/components/access-control";
import { useInstanceStage } from "@/components/params-context";
import { Button, buttonVariants } from "@/components/ui/button";
import { ActionColumnLabel } from "@/components/ui/data-table/action-column-label";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { getSelectColumn } from "@/components/ui/data-table/select-column";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WithTooltip } from "@/components/ui/tooltip-wrapper";

import {
  previousStages,
  stageLt,
  stageLte,
} from "@/lib/utils/permissions/stage-check";

export type SupervisorData = {
  id: string;
  name: string;
  email: string;
};

export function constructColumns({
  role,
  deleteSupervisor,
  deleteSelectedSupervisors,
}: {
  role: Role;
  deleteSupervisor: (id: string) => Promise<void>;
  deleteSelectedSupervisors: (ids: string[]) => Promise<void>;
}): ColumnDef<SupervisorData>[] {
  const stage = useInstanceStage();

  const selectCol = getSelectColumn<SupervisorData>();

  const userCols: ColumnDef<SupervisorData>[] = [
    {
      id: "GUID",
      accessorFn: ({ id }) => id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="GUID" canFilter />
      ),
      cell: ({ row: { original: supervisor } }) => (
        <WithTooltip
          align="start"
          tip={<div className="max-w-xs">{supervisor.id}</div>}
        >
          <div className="w-40 truncate">{supervisor.id}</div>
        </WithTooltip>
      ),
    },
    {
      id: "Name",
      accessorFn: ({ name }) => name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({
        row: {
          original: { id, name },
        },
      }) => (
        <Link
          className={buttonVariants({ variant: "link" })}
          href={`./supervisors/${id}`}
        >
          {name}
        </Link>
      ),
    },
    {
      id: "Email",
      accessorFn: ({ email }) => email,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
  ];

  const actionsCol: ColumnDef<SupervisorData> = {
    accessorKey: "actions",
    id: "Actions",
    header: ({ table }) => {
      const someSelected =
        table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();

      const selectedSupervisorIds = table
        .getSelectedRowModel()
        .rows.map((e) => e.original.id);

      if (
        someSelected &&
        role === Role.ADMIN &&
        stageLt(stage, Stage.PROJECT_ALLOCATION)
      )
        return (
          <div className="flex w-14 items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <span className="sr-only">Open menu</span>
                  <MoreIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" side="bottom">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:bg-red-100/40 focus:text-destructive">
                  <button
                    className="flex items-center gap-2"
                    onClick={async () =>
                      void deleteSelectedSupervisors(selectedSupervisorIds)
                    }
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span>Remove selected Supervisors</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      return <ActionColumnLabel />;
    },
    cell: ({ row: { original: supervisor } }) => (
      <div className="flex w-14 items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <span className="sr-only">Open menu</span>
              <MoreIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="bottom">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="group/item">
              <Link
                className="flex items-center gap-2 text-primary underline-offset-4 group-hover/item:underline hover:underline"
                href={`./supervisors/${supervisor.id}`}
              >
                <CornerDownRightIcon className="h-4 w-4" />
                <span>View Supervisor Details</span>
              </Link>
            </DropdownMenuItem>
            <AccessControl
              allowedRoles={[Role.ADMIN]}
              allowedStages={previousStages(Stage.PROJECT_SELECTION)}
            >
              <DropdownMenuItem className="group/item2 text-destructive focus:bg-red-100/40 focus:text-destructive">
                <button
                  className="flex items-center gap-2"
                  onClick={async () => void deleteSupervisor(supervisor.id)}
                >
                  <Trash2Icon className="h-4 w-4" />
                  <span>Remove Supervisor {supervisor.name}</span>
                </button>
              </DropdownMenuItem>
            </AccessControl>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  };

  if (role !== Role.ADMIN) return userCols;

  return stageLte(stage, Stage.PROJECT_SELECTION)
    ? [selectCol, ...userCols, actionsCol]
    : [...userCols, actionsCol];
}
