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
      id: string;
      name: string;
      email: string;
      // * to prevent this from being an array the db needs to be further denormalised
      supervisorInInstance: {
        projectAllocationLowerBound: number;
        projectAllocationTarget: number;
        projectAllocationUpperBound: number;
      }[];
    };
  };
  studentRanking: number;
}
[];

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
  {
    id: "supervisorLowerBound",
    accessorFn: ({ project: { supervisor } }) =>
      supervisor.supervisorInInstance[0].projectAllocationLowerBound,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Lower Bound" />
    ),
  },
  {
    id: "supervisorTarget",
    accessorFn: ({ project: { supervisor } }) =>
      supervisor.supervisorInInstance[0].projectAllocationTarget,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Target" />
    ),
  },
  {
    id: "supervisorUpperBound",
    accessorFn: ({ project: { supervisor } }) =>
      supervisor.supervisorInInstance[0].projectAllocationUpperBound,
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
    accessorFn: ({ student }) => student.id,
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
