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

export interface StudentData {
  student: {
    user: {
      name: string | null;
      id: string;
      email: string | null;
    };
  };
  project: {
    id: string;
    supervisor: {
      user: {
        id: string;
        name: string | null;
      };
    };
  };
  studentRanking: number;
}

export const byStudentColumns: ColumnDef<StudentData>[] = [
  {
    id: "student ID",
    accessorFn: ({ student: { user } }) => user.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" />
    ),
    cell: ({
      row: {
        original: { student },
      },
    }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="cursor-default">
              <div className="w-20 truncate"> {student.user.id}</div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p> {student.user.id}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    id: "student Name",
    accessorFn: ({ student: { user } }) => user.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Name" />
    ),
  },
  {
    id: "student Email",
    accessorFn: ({ student: { user } }) => user.email,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Email" />
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
];
