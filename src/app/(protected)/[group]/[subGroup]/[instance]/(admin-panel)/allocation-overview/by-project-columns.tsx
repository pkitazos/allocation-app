import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

export interface ProjectData {
  projectId: string;
  projectTitle: string;
  // projectCapacity: number;
  // projectRank: number;
  studentId: string;
  supervisorId: string;
  supervisorName: string;
}
[];

export const byProjectColumns: ColumnDef<ProjectData>[] = [
  {
    id: "projectId",
    accessorKey: "projectId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project ID" />
    ),
  },
  {
    id: "projectTitle",
    accessorKey: "projectTitle",
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
    id: "studentId",
    accessorKey: "studentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
  },
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
];
