import { Role, Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  CornerDownRightIcon,
  LucideMoreHorizontal as MoreIcon,
  Trash2Icon,
} from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AccessControl } from "@/components/access-control";
import { ActionColumnLabel } from "@/components/ui/data-table/action-column-label";
import { getSelectColumn } from "@/components/ui/data-table/select-column";
import { WithTooltip } from "@/components/ui/tooltip-wrapper";
import { spacesLabels } from "@/content/spaces";
import {
  previousStages,
  stageGte,
  stageLte,
} from "@/lib/utils/permissions/stage-check";

export type SupervisorData = {
  id: string;
  name: string;
  email: string;
};

export function supervisorColumns(
  user: User,
  role: Role,
  stage: Stage,
  deleteSupervisor: (id: string) => Promise<void>,
  deleteSelectedSupervisors: (ids: string[]) => Promise<void>,
): ColumnDef<SupervisorData>[] {
  const selectCol = getSelectColumn<SupervisorData>();

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
          <WithTooltip tip={id}>
            <Button variant="ghost" className="cursor-default">
              <div className="w-16 truncate">{id}</div>
            </Button>
          </WithTooltip>
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
      const someSelected =
        table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();

      const selectedSupervisorIds = table
        .getSelectedRowModel()
        .rows.map((e) => e.original.id);

      if (
        someSelected &&
        role === Role.ADMIN &&
        !stageGte(stage, Stage.PROJECT_ALLOCATION)
      )
        return (
          <div className="flex w-14 items-center justify-center">
            <WithTooltip
              tip={
                <p className="text-gray-700">
                  Remove selected Supervisors from {spacesLabels.instance.short}
                </p>
              }
              duration={500}
            >
              <Button
                className="flex items-center gap-2"
                variant="destructive"
                size="sm"
                onClick={() => deleteSelectedSupervisors(selectedSupervisorIds)}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </WithTooltip>
          </div>
        );

      return <ActionColumnLabel />;
    },
    cell: ({ row: { original: supervisor }, table }) => {
      async function handleDelete() {
        await deleteSupervisor(supervisor.id).then(() => {
          table.toggleAllRowsSelected(false);
        });
      }
      return (
        <div className="flex w-14 items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <span className="sr-only">Open menu</span>
                <MoreIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="group/item">
                <Link
                  className="flex items-center gap-2 text-primary underline-offset-4 hover:underline group-hover/item:underline"
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
                    onClick={handleDelete}
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span>
                      Remove Supervisor from {spacesLabels.instance.short}
                    </span>
                  </button>
                </DropdownMenuItem>
              </AccessControl>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  };

  if (role !== Role.ADMIN) return userCols;

  return stageLte(stage, Stage.PROJECT_SELECTION)
    ? [selectCol, ...userCols, actionsCol]
    : [...userCols, actionsCol];
}
