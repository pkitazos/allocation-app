"use client";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";

export interface ProjectData {
  project: {
    id: string;
    title: string;
    capacityLowerBound: number;
    capacityUpperBound: number;
    supervisor: {
      user: {
        id: string;
        name: string | null;
      };
    };
  };
  studentRanking: number;
  userId: string;
}

export const byProjectColumns: ColumnDef<ProjectData>[] = [
  {
    id: "projectId",
    accessorFn: ({ project }) => project.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project ID" />
    ),
  },
  {
    id: "projectTitle",
    accessorFn: ({ project }) => project.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Title" />
    ),
  },
  {
    id: "projectLowerBound",
    accessorFn: ({ project }) => project.capacityLowerBound,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Lower Bound" />
    ),
  },
  {
    id: "projectUpperBound",
    accessorFn: ({ project }) => project.capacityUpperBound,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Upper Bound" />
    ),
  },
  {
    id: "supervisorId",
    accessorFn: ({ project }) => project.supervisor.user.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor ID" />
    ),
  },
  {
    id: "supervisorName",
    accessorFn: ({ project }) => project.supervisor.user.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Name" />
    ),
  },
  {
    id: "studentId",
    accessorFn: ({ userId }) => userId,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
  },
  {
    id: "studentRank",
    accessorFn: ({ studentRanking }) => studentRanking,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Rank" />
    ),
  },
];
