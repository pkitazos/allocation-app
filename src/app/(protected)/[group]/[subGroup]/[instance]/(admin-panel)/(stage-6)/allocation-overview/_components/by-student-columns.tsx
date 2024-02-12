"use client";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

export interface StudentData {
  student: {
    user: {
      name: string | null;
      id: string;
      email: string | null;
    };
  };
  project: {
    id: string;
    supervisor: {
      user: {
        name: string | null;
      };
    };
  };
  studentRanking: number;
}

export const byStudentColumns: ColumnDef<StudentData>[] = [
  {
    id: "studentId",
    accessorFn: ({ student: { user } }) => user.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
  },
  {
    id: "studentName",
    accessorFn: ({ student: { user } }) => user.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" />
    ),
  },
  {
    id: "studentEmail",
    accessorFn: ({ student: { user } }) => user.email,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Email" />
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
    id: "studentRanking",
    accessorFn: ({ studentRanking }) => studentRanking,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Rank" />
    ),
  },
  {
    id: "supervisorName",
    accessorFn: ({ project }) => project.supervisor.user.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Name" />
    ),
  },
];
