import { Project, Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { stageCheck } from "@/lib/utils/permissions/stage-check";

export function columns(
  stage: Stage,
  removeRow: (id: string) => void,
  clearTable: () => void,
): ColumnDef<
  Pick<
    Project,
    | "id"
    | "title"
    | "capacityLowerBound"
    | "capacityUpperBound"
    | "preAllocatedStudentId"
  >
>[] {
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
        <DataTableColumnHeader
          className="w-16"
          column={column}
          title="ID"
          canFilter
        />
      ),
      cell: ({
        row: {
          original: { id },
        },
      }) => (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="cursor-default">
                  <div className="w-16 truncate">{id}</div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      ),
    },
    {
      id: "title",
      accessorFn: ({ title }) => title,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" canFilter />
      ),
      cell: ({
        row: {
          original: { id, title },
        },
      }) => (
        <Link href={`projects/${id}`}>
          <Button variant="link">{title}</Button>
        </Link>
      ),
    },
    {
      id: "preAllocatedStudentId",
      accessorFn: ({ preAllocatedStudentId }) => preAllocatedStudentId,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pre-allocated Student" />
      ),
    },
    {
      id: "capacityUpperBound",
      accessorFn: ({ capacityUpperBound }) => capacityUpperBound,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-12"
          column={column}
          title="Upper Bound"
        />
      ),
      cell: ({
        row: {
          original: { capacityUpperBound },
        },
      }) => <div className="w-12 text-center">{capacityUpperBound}</div>,
    },
    {
      accessorKey: "actions",
      id: "Actions",
      header: ({ table }) => {
        const allSelected = table.getIsAllRowsSelected();

        if (stageCheck(stage, Stage.PROJECT_ALLOCATION)) return;
        if (allSelected)
          return (
            <Button variant="ghost" size="icon" onClick={clearTable}>
              <X className="h-5 w-5" />
            </Button>
          );

        return <div className="w-fit" />;
      },
      cell: ({
        row: {
          original: { id },
        },
      }) => {
        if (stageCheck(stage, Stage.PROJECT_ALLOCATION)) return;
        return (
          <Button variant="ghost" size="icon" onClick={() => removeRow(id)}>
            <X className="h-5 w-5" />
          </Button>
        );
      },
    },
  ];
}
