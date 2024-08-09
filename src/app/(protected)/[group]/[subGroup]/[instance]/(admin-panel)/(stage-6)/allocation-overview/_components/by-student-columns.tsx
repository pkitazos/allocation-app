"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { WithTooltip } from "@/components/ui/tooltip-wrapper";

import { cn } from "@/lib/utils";
import { AllocationByStudentDto } from "@/lib/validations/allocation/data-table-dto";

export const byStudentColumns: ColumnDef<AllocationByStudentDto>[] = [
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
    id: "Student Name",
    accessorFn: ({ student }) => student.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" />
    ),
  },
  {
    id: "Student Email",
    accessorFn: ({ student }) => student.email,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Email" />
    ),
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
];
