"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    id: "supervisor ID",
    accessorFn: ({ project }) => project.supervisor.user.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor ID" />
    ),
    cell: ({
      row: {
        original: {
          project: {
            supervisor: {
              user: { id },
            },
          },
        },
      },
    }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="cursor-default">
              <div className="w-16 truncate"> {id}</div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p> {id}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "supervisor Name",
    accessorFn: ({ project }) => project.supervisor.user.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Name" />
    ),
    cell: ({
      row: {
        original: {
          project: {
            supervisor: {
              user: { id, name },
            },
          },
        },
      },
    }) => (
      <Button variant="link">
        <Link href={`./supervisors/${id}`}>{name}</Link>
      </Button>
    ),
  },
  {
    id: "supervisor Email",
    accessorFn: ({ project }) => project.supervisor.user.email,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Email" />
    ),
  },
  {
    id: "supervisor Lower Bound",
    accessorFn: ({
      project: {
        supervisor: { supervisorInstanceDetails: details },
      },
    }) => details[0].projectAllocationLowerBound,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Lower Bound" />
    ),
    cell: ({
      row: {
        original: {
          project: {
            supervisor: { supervisorInstanceDetails: details },
          },
        },
      },
    }) => (
      <div className="flex justify-center">
        {details[0].projectAllocationLowerBound}
      </div>
    ),
  },
  {
    id: "supervisor Target",
    accessorFn: ({
      project: {
        supervisor: { supervisorInstanceDetails: details },
      },
    }) => details[0].projectAllocationTarget,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Target" />
    ),
    cell: ({
      row: {
        original: {
          project: {
            supervisor: { supervisorInstanceDetails: details },
          },
        },
      },
    }) => (
      <div className="flex justify-center">
        {details[0].projectAllocationTarget}
      </div>
    ),
  },
  {
    id: "supervisor Upper Bound",
    accessorFn: ({
      project: {
        supervisor: { supervisorInstanceDetails: details },
      },
    }) => details[0].projectAllocationUpperBound,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supervisor Upper bound" />
    ),
    cell: ({
      row: {
        original: {
          project: {
            supervisor: { supervisorInstanceDetails: details },
          },
        },
      },
    }) => (
      <div className="flex justify-center">
        {details[0].projectAllocationUpperBound}
      </div>
    ),
  },
  {
    id: "project ID",
    accessorFn: ({ project }) => project.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project ID" />
    ),
    cell: ({
      row: {
        original: { project },
      },
    }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="cursor-default">
              <div className="w-16 truncate"> {project.id}</div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p> {project.id}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "student ID",
    accessorFn: ({ userId }) => userId,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
    cell: ({
      row: {
        original: { userId },
      },
    }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="cursor-default">
              <div className="w-20 truncate"> {userId}</div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p> {userId}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "student Ranking",
    accessorFn: ({ studentRanking }) => studentRanking,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Rank" />
    ),
    cell: ({
      row: {
        original: { studentRanking },
      },
    }) => <div className="flex justify-center">{studentRanking}</div>,
  },
];
