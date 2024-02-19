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

export interface ProjectData {
  project: {
    id: string;
    title: string;
    capacityLowerBound: number;
    capacityUpperBound: number;
    supervisor: {
      user: {
        id: string;
        name: string | null;
      };
    };
  };
  studentRanking: number;
  userId: string;
}

export const byProjectColumns: ColumnDef<ProjectData>[] = [
  {
    id: "project ID",
    accessorFn: ({ project }) => project.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project ID" canFilter />
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
    id: "project Title",
    accessorFn: ({ project }) => project.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Title" />
    ),
    cell: ({
      row: {
        original: {
          project: { id, title },
        },
      },
    }) => (
      <div className="w-fit min-w-60">
        <Link href={`./projects/${id}`}>
          <Button variant="link">{title}</Button>
        </Link>
      </div>
    ),
  },
  {
    id: "projectLowerBound",
    accessorFn: ({ project }) => project.capacityLowerBound,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Lower Bound" />
    ),
    cell: ({
      row: {
        original: {
          project: { capacityLowerBound },
        },
      },
    }) => <div className="flex justify-center">{capacityLowerBound}</div>,
  },
  {
    id: "projectUpperBound",
    accessorFn: ({ project }) => project.capacityUpperBound,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Upper Bound" />
    ),
    cell: ({
      row: {
        original: {
          project: { capacityUpperBound },
        },
      },
    }) => <div className="flex justify-center">{capacityUpperBound}</div>,
  },
  {
    id: "supervisorId",
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
    id: "supervisorName",
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
    id: "studentId",
    accessorFn: ({ userId }) => userId,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
    cell: ({
      row: {
        original: { userId },
      },
    }) => (
      <div className="text-left">
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
      </div>
    ),
  },
  {
    id: "studentRank",
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
