import { Project, Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal as MoreIcon, PenIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

import { useInstancePath, useInstanceStage } from "@/components/params-context";
import { Button } from "@/components/ui/button";
import { ActionColumnLabel } from "@/components/ui/data-table/action-column-label";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { getSelectColumn } from "@/components/ui/data-table/select-column";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  stageGt,
  stageGte,
  stageLt,
} from "@/lib/utils/permissions/stage-check";

export type SupervisorProjectData = Pick<
  Project,
  "id" | "title" | "capacityUpperBound"
> & { allocatedStudentName?: string; allocatedStudentId?: string };

export function constructColumns({
  deleteProject,
  deleteSelectedProjects,
}: {
  deleteProject: (id: string) => Promise<void>;
  deleteSelectedProjects: (ids: string[]) => Promise<void>;
}): ColumnDef<SupervisorProjectData>[] {
  const stage = useInstanceStage();
  const instancePath = useInstancePath();

  const selectCol = getSelectColumn<SupervisorProjectData>();

  const userCols: ColumnDef<SupervisorProjectData>[] = [
    {
      id: "id",
      accessorFn: ({ id }) => id,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-16"
          column={column}
          title="ID"
          canFilter
        />
      ),
      cell: ({
        row: {
          original: { id },
        },
      }) => (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="cursor-default">
                  <div className="w-16 truncate">{id}</div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      ),
    },
    {
      id: "title",
      accessorFn: ({ title }) => title,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({
        row: {
          original: { id, title },
        },
      }) => (
        <Button variant="link" asChild>
          <Link className="text-left" href={`projects/${id}`}>
            {title}
          </Link>
        </Button>
      ),
    },
    {
      id: "Allocated Student Name",
      accessorFn: ({ allocatedStudentName }) => allocatedStudentName,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Allocated Student Name" />
      ),
    },
    {
      id: "Allocated Student Matric",
      accessorFn: ({ allocatedStudentId }) => allocatedStudentId,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Allocated Student Matric"
        />
      ),
    },
    {
      id: "Capacity Upper Bound",
      accessorFn: ({ capacityUpperBound }) => capacityUpperBound,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-12"
          column={column}
          title="Upper Bound"
        />
      ),
      cell: ({
        row: {
          original: { capacityUpperBound },
        },
      }) => <div className="w-12 text-center">{capacityUpperBound}</div>,
    },
    {
      accessorKey: "actions",
      id: "Actions",
      header: ({ table }) => {
        const someSelected =
          table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();

        const selectedProjectIds = table
          .getSelectedRowModel()
          .rows.map((e) => e.original.id);

        if (someSelected && stageLt(stage, Stage.PROJECT_ALLOCATION)) {
          return (
            <div className="flex w-24 items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <span className="sr-only">Open menu</span>
                    <MoreIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" side="bottom">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:bg-red-100/40 focus:text-destructive">
                    <button
                      className="flex items-center gap-2"
                      onClick={() => deleteSelectedProjects(selectedProjectIds)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                      <span>Delete Selected Projects</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        }
        return <ActionColumnLabel className="w-24" />;
      },
      cell: ({
        row: {
          original: { id },
        },
      }) => {
        if (stageGte(stage, Stage.PROJECT_ALLOCATION)) return;
        return (
          <div className="flex w-24 items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <span className="sr-only">Open menu</span>
                  <MoreIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" side="bottom">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link
                    className="flex items-center gap-2"
                    href={`${instancePath}/projects/${id}/edit`}
                  >
                    <PenIcon className="h-4 w-4" />
                    <span>Edit Project {id}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:bg-red-100/40 focus:text-destructive">
                  <button
                    className="flex items-center gap-2"
                    onClick={() => deleteProject(id)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span>Delete Project {id}</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  if (stageGt(stage, Stage.PROJECT_SUBMISSION)) return userCols;
  return [selectCol, ...userCols];
}
