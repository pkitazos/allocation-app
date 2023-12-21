import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

export interface SupervisorData {
  supervisorId: string;
  supervisorName: string;
  supervisorEmail: string;
  // supervisorTarget: number;
  // supervisorUpperBound: number
  projectId: string;
  // projectTitle: string;
  studentId: string;
}
[];

export const bySupervisorColumns: ColumnDef<SupervisorData>[] = [
  {
    id: "supervisorId",
    accessorKey: "supervisorId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor ID" />
    ),
  },
  {
    id: "supervisorName",
    accessorKey: "supervisorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Name" />
    ),
  },
  {
    id: "supervisorEmail",
    accessorKey: "supervisorEmail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Email" />
    ),
  },
  // {
  //   id: "supervisorTarget",
  //   accessorKey: "supervisorTarget",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Supervisor Target" />
  //   ),
  // },
  // {
  //   id: "supervisorUpperBound",
  //   accessorKey: "supervisorUpperBound",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Supervisor Upper Bound" />
  //   ),
  // },
  {
    id: "projectId",
    accessorKey: "projectId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project ID" />
    ),
  },
  // {
  //   id: "projectTitle",
  //   accessorKey: "projectTitle",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Project Title" />
  //   ),
  // },
  {
    id: "studentId",
    accessorKey: "studentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
  },
];
