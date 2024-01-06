import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

export interface SupervisorData {
  student: {
    id: string;
  };
  project: {
    id: string;
    title: string;
    supervisor: {
      name: string;
      id: string;
      email: string;
    };
  };
}

export const bySupervisorColumns: ColumnDef<SupervisorData>[] = [
  {
    id: "supervisorId",
    accessorFn: ({ project }) => project.supervisor.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor ID" />
    ),
  },
  {
    id: "supervisorName",
    accessorFn: ({ project }) => project.supervisor.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Name" />
    ),
  },
  {
    id: "supervisorEmail",
    accessorFn: ({ project }) => project.supervisor.email,
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
    accessorFn: ({ project }) => project.id,
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
    accessorFn: ({ student }) => student.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
  },
];
