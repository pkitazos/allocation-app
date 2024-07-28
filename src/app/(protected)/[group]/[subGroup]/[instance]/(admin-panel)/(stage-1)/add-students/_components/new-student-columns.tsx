"use client";
import { Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal as MoreIcon, Trash2Icon } from "lucide-react";

import { useInstanceStage } from "@/components/params-context";
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
      id: "Matriculation No.",
      accessorFn: ({ institutionId: matriculation }) => matriculation,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Matriculation No."
          canFilter
        />
      ),
      cell: ({
        row: {
          original: { institutionId: matriculation },
        },
      }) => (
        <WithTooltip
          align="start"
          tip={<div className="max-w-xs">{matriculation}</div>}
        >
          <div className="w-32 truncate">{matriculation}</div>
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
      id: "level",
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

        function handleRemoveStudents() {
          void removeSelectedStudents(selectedStudentIds);
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
                      onClick={handleRemoveStudents}
                    >
                      <Trash2Icon className="h-4 w-4" />
                      <span>Remove Selected Students</span>
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
          original: { institutionId },
        },
      }) => {
        function handleRemoveStudent() {
          void removeStudent(institutionId);
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
                    onClick={handleRemoveStudent}
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span>Remove Selected Students</span>
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
