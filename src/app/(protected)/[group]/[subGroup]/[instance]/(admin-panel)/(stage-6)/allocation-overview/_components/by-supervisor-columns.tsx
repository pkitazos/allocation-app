"use client";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";

export interface SupervisorData {
  project: {
    id: string;
    title: string;
    supervisor: {
      user: {
        id: string;
        name: string | null;
        email: string | null;
      };
      supervisorInstanceDetails: {
        projectAllocationLowerBound: number;
        projectAllocationTarget: number;
        projectAllocationUpperBound: number;
      }[];
    };
  };
  userId: string;
  studentRanking: number;
}
[];

export const bySupervisorColumns: ColumnDef<SupervisorData>[] = [
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
    id: "supervisorEmail",
    accessorFn: ({ project }) => project.supervisor.user.email,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Email" />
    ),
  },
  {
    id: "supervisorLowerBound",
    accessorFn: ({ project: { supervisor } }) =>
      supervisor.supervisorInstanceDetails[0].projectAllocationLowerBound,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Lower Bound" />
    ),
  },
  {
    id: "supervisorTarget",
    accessorFn: ({ project: { supervisor } }) =>
      supervisor.supervisorInstanceDetails[0].projectAllocationTarget,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Target" />
    ),
  },
  {
    id: "supervisorUpperBound",
    accessorFn: ({ project: { supervisor } }) =>
      supervisor.supervisorInstanceDetails[0].projectAllocationUpperBound,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Upper bound" />
    ),
  },
  {
    id: "projectId",
    accessorFn: ({ project }) => project.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project ID" />
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
    id: "studentRanking",
    accessorFn: ({ studentRanking }) => studentRanking,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Rank" />
    ),
  },
];
