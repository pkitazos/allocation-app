"use client";
import { Role, Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  CornerDownRightIcon,
  LucideMoreHorizontal as MoreIon,
  Trash2Icon,
} from "lucide-react";
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
import { getSelectColumn } from "@/components/ui/data-table/select-column";

import { previousStages, stageLte } from "@/lib/utils/permissions/stage-check";

import { ActionColumnLabel } from "@/components/ui/data-table/action-column-label";
import { WithTooltip } from "@/components/ui/tooltip-wrapper";
import { spacesLabels } from "@/content/spaces";

export interface StudentData {
  id: string;
  name: string;
  email: string;
}

export function studentsColumns(
  role: Role,
  stage: Stage,
  deleteStudent: (id: string) => Promise<void>,
  deleteSelectedStudents: (ids: string[]) => Promise<void>,
): ColumnDef<StudentData>[] {
  const selectCol = getSelectColumn<StudentData>();

  const userCols: ColumnDef<StudentData>[] = [
    {
      id: "guid",
      accessorFn: ({ id }) => id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="GUID" canFilter />
      ),
      cell: ({ row: { original: student } }) => (
        <div className="text-left">
          <WithTooltip tip={student.id}>
            <Button variant="ghost" className="cursor-default">
              <div className="w-20 truncate">{student.id}</div>
            </Button>
          </WithTooltip>
        </div>
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
          original: { name, id },
        },
      }) => (
        <Button variant="link" asChild>
          <Link href={`./students/${id}`}>{name}</Link>
        </Button>
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

  const actionsCol: ColumnDef<StudentData> = {
    accessorKey: "actions",
    id: "Actions",
    header: ({ table }) => {
      const someSelected =
        table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();

      const selectedStudentIds = table
        .getSelectedRowModel()
        .rows.map((e) => e.original.id);

      if (
        someSelected &&
        role === Role.ADMIN &&
        stageLte(stage, Stage.PROJECT_SELECTION)
      )
        return (
          <div className="flex w-14 items-center justify-center">
            <WithTooltip
              tip={
                <p className="text-gray-700">
                  Remove selected Students from {spacesLabels.instance.short}
                </p>
              }
              duration={500}
            >
              <Button
                className="flex items-center gap-2"
                variant="destructive"
                size="sm"
                onClick={async () => {
                  await deleteSelectedStudents(selectedStudentIds).then(() => {
                    table.toggleAllRowsSelected(false);
                  });
                }}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </WithTooltip>
          </div>
        );

      return <ActionColumnLabel />;
    },
    cell: ({ row: { original: student }, table }) => {
      async function handleDelete() {
        await deleteStudent(student.id).then(() => {
          table.toggleAllRowsSelected(false);
        });
      }
      return (
        <div className="flex w-14 items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreIon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="group/item">
                <Link
                  className="flex items-center gap-2 text-primary underline-offset-4 group-hover/item:underline hover:underline"
                  href={`./students/${student.id}`}
                >
                  <CornerDownRightIcon className="h-4 w-4" />
                  <span>View Student Details</span>
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
                      Remove Student from {spacesLabels.instance.short}
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
