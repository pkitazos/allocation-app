"use client";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { WithTooltip } from "@/components/ui/tooltip-wrapper";

import { MatchingDetailsDto } from "@/lib/validations/matching";

export const detailsColumns: ColumnDef<MatchingDetailsDto>[] = [
  {
    id: "matriculation No.",
    accessorFn: ({ studentId }) => studentId,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Matric" canFilter />
    ),
    cell: ({
      row: {
        original: { studentId },
      },
    }) => <div>{studentId}</div>,
  },
  {
    id: "student name",
    accessorFn: ({ studentName }) => studentName,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" canFilter />
    ),
    cell: ({
      row: {
        original: { studentName },
      },
    }) => <div>{studentName}</div>,
  },
  {
    id: "project ID",
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
    id: "project title",
    accessorFn: ({ projectTitle }) => projectTitle,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Title" canFilter />
    ),
    cell: ({
      row: {
        original: { projectTitle },
      },
    }) => <div>{projectTitle}</div>,
  },
  {
    id: "student rank",
    accessorFn: ({ studentRank }) => studentRank,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Rank" />
    ),
    cell: ({
      row: {
        original: { studentRank },
      },
    }) => <div className="w-full text-center">{studentRank}</div>,
  },
];
