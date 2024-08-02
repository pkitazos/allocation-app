"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal as MoreIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
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

import { NewSupervisor } from "@/lib/validations/add-users/new-user";

export function constructColumns({
  removeSupervisor,
  removeSelectedSupervisors,
}: {
  removeSupervisor: (id: string) => Promise<void>;
  removeSelectedSupervisors: (ids: string[]) => Promise<void>;
}): ColumnDef<NewSupervisor>[] {
  const selectCol = getSelectColumn<NewSupervisor>();

  const userCols: ColumnDef<NewSupervisor>[] = [
    {
      id: "full Name",
      accessorFn: ({ fullName }) => fullName,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Full Name" />
      ),
      cell: ({
        row: {
          original: { fullName },
        },
      }) => (
        <WithTooltip
          align="start"
          tip={<div className="max-w-xs">{fullName}</div>}
        >
          <div className="w-40 truncate">{fullName}</div>
        </WithTooltip>
      ),
    },
    {
      id: "GUID",
      accessorFn: ({ institutionId }) => institutionId,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="GUID" canFilter />
      ),
      cell: ({
        row: {
          original: { institutionId: guid },
        },
      }) => (
        <WithTooltip align="start" tip={<div className="max-w-xs">{guid}</div>}>
          <div className="w-32 truncate">{guid}</div>
        </WithTooltip>
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
      cell: ({
        row: {
          original: { projectTarget },
        },
      }) => <div className="text-center">{projectTarget}</div>,
    },
    {
      id: "Project Upper Quota",
      accessorFn: ({ projectUpperQuota }) => projectUpperQuota,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Upper Quota" />
      ),
      cell: ({
        row: {
          original: { projectUpperQuota },
        },
      }) => <div className="text-center">{projectUpperQuota}</div>,
    },
    {
      accessorKey: "actions",
      id: "Actions",
      header: ({ table }) => {
        const someSelected =
          table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();

        const selectedSupervisorIds = table
          .getSelectedRowModel()
          .rows.map((e) => e.original.institutionId);

        function handleRemoveSupervisors() {
          void removeSelectedSupervisors(selectedSupervisorIds);
        }

        if (someSelected)
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
                      onClick={handleRemoveSupervisors}
                    >
                      <Trash2Icon className="h-4 w-4" />
                      <span>Remove Selected Supervisors</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );

        return <ActionColumnLabel />;
      },
      cell: ({
        row: {
          original: { fullName, institutionId },
        },
      }) => {
        function handleRemoveSupervisor() {
          void removeSupervisor(institutionId);
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
              <DropdownMenuContent align="center" side="bottom">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:bg-red-100/40 focus:text-destructive">
                  <button
                    className="flex items-center gap-2"
                    onClick={handleRemoveSupervisor}
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span>Remove Supervisor {fullName}</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return [selectCol, ...userCols];
}
