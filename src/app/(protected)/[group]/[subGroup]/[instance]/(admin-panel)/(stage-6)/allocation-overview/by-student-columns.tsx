import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

export interface StudentData {
  student: {
    name: string;
    id: string;
    email: string;
  };
  project: {
    id: string;
    supervisor: {
      name: string;
    };
  };
  studentRanking: number;
}

export const byStudentColumns: ColumnDef<StudentData>[] = [
  {
    id: "studentId",
    accessorFn: ({ student }) => student.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
  },
  {
    id: "studentName",
    accessorFn: ({ student }) => student.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" />
    ),
  },
  {
    id: "studentEmail",
    accessorFn: ({ student }) => student.email,
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
    accessorFn: ({ project }) => project.supervisor.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Name" />
    ),
  },
];
