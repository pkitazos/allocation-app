"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { WithTooltip } from "@/components/ui/tooltip-wrapper";

import { MatchingDetailsDto } from "@/lib/validations/matching";

export const studentResultsColumns: ColumnDef<MatchingDetailsDto>[] = [
  {
    id: "GUID",
    accessorFn: ({ studentId }) => studentId,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="GUID" canFilter />
    ),
    cell: ({
      row: {
        original: { studentId },
      },
    }) => <div>{studentId}</div>,
  },
  {
    id: "Student Name",
    accessorFn: ({ studentName }) => studentName,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" canFilter />
    ),
    cell: ({
      row: {
        original: { studentName, studentId },
      },
    }) => (
      <Link
        className={buttonVariants({ variant: "link" })}
        href={`./students/${studentId}`}
      >
        {studentName}
      </Link>
    ),
  },
  {
    id: "Project ID",
    accessorFn: ({ projectId }) => projectId,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project ID" canFilter />
    ),
    cell: ({
      row: {
        original: { projectId },
      },
    }) => (
      <WithTooltip
        align="start"
        tip={<div className="max-w-xs">{projectId}</div>}
      >
        <div className="w-40 truncate">{projectId}</div>
      </WithTooltip>
    ),
  },
  {
    id: "Project title",
    accessorFn: ({ projectTitle }) => projectTitle,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Title" canFilter />
    ),
    cell: ({
      row: {
        original: { projectTitle, projectId },
      },
    }) => (
      <Link
        className={buttonVariants({ variant: "link" })}
        href={`./projects/${projectId}`}
      >
        {projectTitle}
      </Link>
    ),
  },
  {
    id: "Student rank",
    accessorFn: ({ studentRank }) => studentRank,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Rank" />
    ),
    cell: ({
      row: {
        original: { studentRank },
      },
    }) => (
      <div className="w-full text-center">
        {Number.isNaN(studentRank) ? "-" : studentRank}
      </div>
    ),
  },
];
