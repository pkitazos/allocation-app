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

import { YesNoAction } from "@/components/yes-no-action";
import { NewStudent } from "@/lib/validations/add-users/new-user";

export function constructColumns({
  removeStudent,
  removeSelectedStudents,
}: {
  removeStudent: (id: string) => Promise<void>;
  removeSelectedStudents: (ids: string[]) => Promise<void>;
}): ColumnDef<NewStudent>[] {
  const selectCol = getSelectColumn<NewStudent>();

  const userCols: ColumnDef<NewStudent>[] = [
    {
      id: "Full Name",
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
      accessorFn: ({ institutionId: guid }) => guid,
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
      id: "Email",
      accessorFn: ({ email }) => email,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      id: "Student Level",
      accessorFn: ({ level }) => level,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Student Level" />
      ),
      cell: ({
        row: {
          original: { level },
        },
      }) => <div className="text-center">{level}</div>,
    },
    {
      accessorKey: "actions",
      id: "Actions",
      header: ({ table }) => {
        const someSelected =
          table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();

        const selectedStudentIds = table
          .getSelectedRowModel()
          .rows.map((e) => e.original.institutionId);

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
                  <DropdownMenuItem
                    className="text-destructive focus:bg-red-100/40 focus:text-destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <YesNoAction
                      action={async () =>
                        void removeSelectedStudents(selectedStudentIds)
                      }
                      trigger={
                        <button className="flex items-center gap-2">
                          <Trash2Icon className="h-4 w-4" />
                          <span>Remove selected Students</span>
                        </button>
                      }
                      title="Remove Students?"
                      description={
                        selectedStudentIds.length === 1
                          ? `You are about to remove "${table.getRow(selectedStudentIds[0]).original.fullName}" from the student list. Do you wish to proceed?`
                          : `You are about to remove ${selectedStudentIds.length} students from the list. Do you wish to proceed?`
                      }
                    />
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
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
                  <YesNoAction
                    action={() => void removeStudent(institutionId)}
                    trigger={
                      <button className="m-1 flex items-center gap-2">
                        <Trash2Icon className="h-4 w-4" />
                        <span>Remove Student {fullName}</span>
                      </button>
                    }
                    title="Remove Student?"
                    description={`You are about to remove "${fullName}" from the student list. Do you wish to proceed?`}
                  />
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
