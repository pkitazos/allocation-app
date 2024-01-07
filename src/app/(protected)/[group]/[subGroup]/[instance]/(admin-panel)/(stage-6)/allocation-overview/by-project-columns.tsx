import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

export interface ProjectData {
  project: {
    id: string;
    title: string;
    supervisor: {
      name: string;
      id: string;
    };
  };
  student: {
    id: string;
  };
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
  // {
  //   id: "projectCapacity",
  //   accessorKey: "projectCapacity",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Project Capacity" />
  //   ),
  // },
  // {
  //   id: "projectRank",
  //   accessorKey: "projectRank",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Project Rank" />
  //   ),
  // },
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
    id: "studentId",
    accessorFn: ({ student }) => student.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
  },
];
