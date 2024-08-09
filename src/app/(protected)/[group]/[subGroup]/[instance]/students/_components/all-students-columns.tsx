"use client";
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

import { previousStages, stageLte } from "@/lib/utils/permissions/stage-check";

export interface StudentData {
  id: string;
  name: string;
  email: string;
}

export function constructColumns({
  role,
  deleteStudent,
  deleteSelectedStudents,
}: {
  role: Role;
  deleteStudent: (id: string) => Promise<void>;
  deleteSelectedStudents: (ids: string[]) => Promise<void>;
}): ColumnDef<StudentData>[] {
  const stage = useInstanceStage();

  const selectCol = getSelectColumn<StudentData>();

  const userCols: ColumnDef<StudentData>[] = [
    {
      id: "GUID",
      accessorFn: ({ id }) => id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="GUID" canFilter />
      ),
      cell: ({ row: { original: student } }) => (
        <WithTooltip
          align="start"
          tip={<div className="max-w-xs">{student.id}</div>}
        >
          <div className="w-40 truncate">{student.id}</div>
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
          original: { name, id },
        },
      }) => (
        <Link
          className={buttonVariants({ variant: "link" })}
          href={`./students/${id}`}
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
                      void deleteSelectedStudents(selectedStudentIds)
                    }
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span>Remove selected Students</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      return <ActionColumnLabel />;
    },
    cell: ({ row: { original: student } }) => (
      <div className="flex w-14 items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreIcon className="h-4 w-4" />
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
                  onClick={async () => void deleteStudent(student.id)}
                >
                  <Trash2Icon className="h-4 w-4" />
                  <span>Remove Student {student.name}</span>
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
