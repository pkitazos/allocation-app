"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { WithTooltip } from "@/components/ui/tooltip-wrapper";

import { cn } from "@/lib/utils";
import { AllocationByProjectDto } from "@/lib/validations/allocation/data-table-dto";

export const byProjectColumns: ColumnDef<AllocationByProjectDto>[] = [
  {
    id: "Project ID",
    accessorFn: ({ project }) => project.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project ID" canFilter />
    ),
    cell: ({
      row: {
        original: { project },
      },
    }) => (
      <div className="text-left">
        <WithTooltip tip={project.id}>
          <Button variant="ghost" className="cursor-default">
            <div className="w-20 truncate">{project.id}</div>
          </Button>
        </WithTooltip>
      </div>
    ),
  },
  {
    id: "Project Title",
    accessorFn: ({ project }) => project.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Title" />
    ),
    cell: ({
      row: {
        original: {
          project: { id, title },
        },
      },
    }) => (
      <WithTooltip tip={<p className="w-96">{title}</p>}>
        <Link
          className={cn(
            buttonVariants({ variant: "link" }),
            "inline-block w-60 truncate px-0 text-start",
          )}
          href={`./projects/${id}`}
        >
          {title}
        </Link>
      </WithTooltip>
    ),
  },
  {
    id: "Project Lower Bound",
    accessorFn: ({ project }) => project.capacityLowerBound,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Lower Bound" />
    ),
    cell: ({
      row: {
        original: {
          project: { capacityLowerBound },
        },
      },
    }) => <div className="flex justify-center">{capacityLowerBound}</div>,
  },
  {
    id: "Project Upper Bound",
    accessorFn: ({ project }) => project.capacityUpperBound,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Upper Bound" />
    ),
    cell: ({
      row: {
        original: {
          project: { capacityUpperBound },
        },
      },
    }) => <div className="flex justify-center">{capacityUpperBound}</div>,
  },
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
    id: "Student Rank",
    accessorFn: ({ student }) => student.ranking,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Rank" />
    ),
    cell: ({
      row: {
        original: { student },
      },
    }) => <div className="flex justify-center">{student.ranking}</div>,
  },
];
