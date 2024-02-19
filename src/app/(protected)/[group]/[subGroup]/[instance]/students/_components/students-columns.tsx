import { Role, Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { LucideMoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";

import { TagType } from "@/components/tag/tag-input";
import { Badge } from "@/components/ui/badge";
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

export interface StudentData {
  id: string;
  name: string;
  email: string;
  flags: {
    flag: {
      id: string;
      title: string;
    };
  }[];
}

export function studentsColumns(
  role: Role,
  stage: Stage,
  deleteStudent: (id: string) => void,
  deleteAllStudents: () => void,
): ColumnDef<StudentData>[] {
  const selectCol: ColumnDef<StudentData> = {
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

  const userCols: ColumnDef<StudentData>[] = [
    {
      id: "id",
      accessorFn: ({ id }) => id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" canFilter />
      ),
      cell: ({ row: { original: student } }) => (
        <div className="text-left">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="cursor-default">
                  <div className="w-20 truncate"> {student.id}</div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p> {student.id}</p>
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
          original: { name },
        },
      }) => (
        <Button variant="link" className="cursor-default hover:no-underline">
          {name}
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
    {
      id: "flags",
      accessorFn: (row) => row.flags,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Flags" />
      ),
      filterFn: (row, columnId, value) => {
        const ids = value as string[];
        const rowFlags = row.getValue(columnId) as { flag: TagType }[];
        return rowFlags.some((e) => ids.includes(e.flag.id));
      },
      cell: ({
        row: {
          original: { flags },
        },
      }) => (
        <div className="flex flex-col gap-2">
          {flags.length > 2 ? (
            <Badge className="rounded-sm px-1 font-normal">
              {flags.length} selected
            </Badge>
          ) : (
            flags.map(({ flag }) => (
              <Badge className="w-fit" key={flag.id}>
                {flag.title}
              </Badge>
            ))
          )}
        </div>
      ),
    },
  ];
  const actionsCol: ColumnDef<StudentData> = {
    accessorKey: "actions",
    id: "Actions",
    header: ({ table }) => {
      const allSelected = table.getIsAllRowsSelected();

      if (
        allSelected &&
        role === Role.ADMIN &&
        !stageCheck(stage, Stage.PROJECT_ALLOCATION)
      ) {
        return (
          <div className="flex justify-center">
            <Button
              className="flex items-center gap-2"
              variant="destructive"
              size="sm"
              onClick={deleteAllStudents}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }
      return <div className="text-xs text-muted-foreground">Actions</div>;
    },
    cell: ({ row: { original: student } }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <LucideMoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`./students/${student.id}`}>
                <Button variant="link">View Details</Button>
              </Link>
            </DropdownMenuItem>
            {role === Role.ADMIN &&
              !stageCheck(stage, Stage.PROJECT_ALLOCATION) && (
                <DropdownMenuItem>
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => deleteStudent(student.id)}
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
  };

  if (role !== Role.ADMIN) return userCols;

  return stageCheck(stage, Stage.PROJECT_ALLOCATION)
    ? [...userCols, actionsCol]
    : [selectCol, ...userCols, actionsCol];
}
