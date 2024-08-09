"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { WithTooltip } from "@/components/ui/tooltip-wrapper";

import { cn } from "@/lib/utils";
import { AllocationBySupervisorDto } from "@/lib/validations/allocation/data-table-dto";

export const bySupervisorColumns: ColumnDef<AllocationBySupervisorDto>[] = [
  {
    id: "Supervisor GUID",
    accessorFn: ({ supervisor }) => supervisor.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor GUID" />
    ),
    cell: ({
      row: {
        original: { supervisor },
      },
    }) => (
      <div className="text-left">
        <WithTooltip tip={supervisor.id}>
          <Button variant="ghost" className="cursor-default">
            <div className="w-16 truncate">{supervisor.id}</div>
          </Button>
        </WithTooltip>
      </div>
    ),
  },
  {
    id: "Supervisor Name",
    accessorFn: ({ supervisor }) => supervisor.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Name" />
    ),
    cell: ({
      row: {
        original: {
          supervisor: { id, name },
        },
      },
    }) => (
      <Link
        className={cn(buttonVariants({ variant: "link" }), "text-left")}
        href={`./supervisors/${id}`}
      >
        {name}
      </Link>
    ),
  },
  {
    id: "Supervisor Email",
    accessorFn: ({ supervisor }) => supervisor.email,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Email" />
    ),
  },
  {
    id: "Supervisor Lower Bound",
    accessorFn: ({ supervisor }) => supervisor.allocationLowerBound,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Lower Bound" />
    ),
    cell: ({
      row: {
        original: {
          supervisor: { allocationLowerBound },
        },
      },
    }) => <div className="flex justify-center">{allocationLowerBound}</div>,
  },
  {
    id: "supervisor Target",
    accessorFn: ({ supervisor }) => supervisor.allocationTarget,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Target" />
    ),
    cell: ({
      row: {
        original: {
          supervisor: { allocationTarget },
        },
      },
    }) => <div className="flex justify-center">{allocationTarget}</div>,
  },
  {
    id: "Supervisor Upper bound",
    accessorFn: ({ supervisor }) => supervisor.allocationUpperBound,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Upper bound" />
    ),
    cell: ({
      row: {
        original: {
          supervisor: { allocationUpperBound },
        },
      },
    }) => <div className="flex justify-center">{allocationUpperBound}</div>,
  },
  {
    id: "Project ID",
    accessorFn: ({ project }) => project.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project ID" />
    ),
    cell: ({
      row: {
        original: { project },
      },
    }) => (
      <div className="text-left">
        <WithTooltip tip={project.id}>
          <Button variant="ghost" className="cursor-default">
            <div className="w-16 truncate">{project.id}</div>
          </Button>
        </WithTooltip>
      </div>
    ),
  },
  {
    id: "Student GUID",
    accessorFn: ({ student }) => student.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student GUID" />
    ),
    cell: ({
      row: {
        original: { student },
      },
    }) => (
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
    id: "Student Ranking",
    accessorFn: ({ student }) => student.ranking,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Ranking" />
    ),
    cell: ({
      row: {
        original: { student },
      },
    }) => <div className="flex justify-center">{student.ranking}</div>,
  },
];
