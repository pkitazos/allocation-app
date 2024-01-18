import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

export interface ProjectData {
  project: {
    id: string;
    title: string;
    capacityLowerBound: number;
    capacityUpperBound: number;
    supervisor: {
      id: string;
      name: string;
    };
  };
  student: {
    id: string;
  };
  studentRanking: number;
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
  {
    id: "studentRank",
    accessorFn: ({ studentRanking }) => studentRanking,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Rank" />
    ),
  },
];
