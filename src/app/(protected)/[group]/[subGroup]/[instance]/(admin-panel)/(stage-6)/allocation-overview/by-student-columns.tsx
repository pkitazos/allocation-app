import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

export interface StudentData {
  studentId: string;
  studentName: string;
  studentEmail: string;
  projectId: string;
  // projectRank: number;
  supervisorName: string;
}
[];

export const byStudentColumns: ColumnDef<StudentData>[] = [
  {
    id: "studentId",
    accessorKey: "studentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
  },
  {
    id: "studentName",
    accessorKey: "studentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" />
    ),
  },
  {
    id: "studentEmail",
    accessorKey: "studentEmail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Email" />
    ),
  },
  {
    id: "projectId",
    accessorKey: "projectId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project ID" />
    ),
  },
  // {
  //   id: "projectRank",
  //   accessorKey: "projectRank",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Project Rank" />
  //   ),
  // },
  {
    id: "supervisorName",
    accessorKey: "supervisorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Name" />
    ),
  },
];
