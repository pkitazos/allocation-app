"use client";
import { Role, Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  CornerDownRightIcon,
  LucideMoreHorizontal as MoreIcon,
  Trash2Icon,
} from "lucide-react";
import { User } from "next-auth";
import Link from "next/link";

import { TagType } from "@/components/tag/tag-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AccessControl } from "@/components/access-control";
import { ActionColumnLabel } from "@/components/ui/data-table/action-column-label";
import { getSelectColumn } from "@/components/ui/data-table/select-column";
import { WithTooltip } from "@/components/ui/tooltip-wrapper";
import { previousStages, stageLt } from "@/lib/utils/permissions/stage-check";
import { useInstanceStage } from "@/components/params-context";

export interface ProjectTableData {
  id: string;
  title: string;
  supervisor: {
    id: string;
    name: string;
  };
  flags: {
    id: string;
    title: string;
  }[];
  tags: {
    id: string;
    title: string;
  }[];
}

export function constructColumns({
  user,
  role,
  deleteProject,
  deleteSelectedProjects,
}: {
  user: User;
  role: Role;
  deleteProject: (id: string) => Promise<void>;
  deleteSelectedProjects: (ids: string[]) => Promise<void>;
}): ColumnDef<ProjectTableData>[] {
  const stage = useInstanceStage();

  const selectCol = getSelectColumn<ProjectTableData>();

  const baseCols: ColumnDef<ProjectTableData>[] = [
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({
        row: {
          original: { id, title },
        },
      }) => (
        <Button variant="link">
          <Link href={`./projects/${id}`}>{title}</Link>
        </Button>
      ),
    },
    {
      id: "supervisor",
      accessorFn: (row) => row.supervisor.name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Supervisor" />
      ),
      cell: ({
        row: {
          original: {
            supervisor: { id, name },
          },
        },
      }) => (
        <Button variant="link">
          <Link href={`./supervisors/${id}`}>{name}</Link>
        </Button>
      ),
    },
    {
      id: "flags",
      accessorFn: (row) => row.flags,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Flags" />
      ),
      filterFn: (row, columnId, value) => {
        const ids = value as string[];
        const rowFlags = row.getValue(columnId) as TagType[];
        return rowFlags.some((e) => ids.includes(e.id));
      },
      cell: ({
        row: {
          original: { flags },
        },
      }) => (
        <div className="flex flex-col gap-2">
          {flags.length > 2 ? (
            <Badge className="w-fit font-normal">{flags.length}+</Badge>
          ) : (
            flags.map((flag) => (
              <Badge className="w-fit" key={flag.id}>
                {flag.title}
              </Badge>
            ))
          )}
        </div>
      ),
    },
    {
      id: "tags",
      accessorFn: (row) => row.tags,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Keywords" />
      ),
      filterFn: (row, columnId, value) => {
        const ids = value as string[];
        const rowTags = row.getValue(columnId) as TagType[];
        return rowTags.some((e) => ids.includes(e.id));
      },
      cell: ({
        row: {
          original: { tags },
        },
      }) => (
        <div className="flex flex-col gap-2">
          {tags.length > 2 ? (
            <Badge variant="outline" className="w-fit font-normal">
              {tags.length}+
            </Badge>
          ) : (
            tags.map((tag) => (
              <Badge variant="outline" className="w-fit" key={tag.id}>
                {tag.title}
              </Badge>
            ))
          )}
        </div>
      ),
    },
  ];

  const actionsCol: ColumnDef<ProjectTableData> = {
    accessorKey: "actions",
    id: "Actions",
    header: ({ table }) => {
      const someSelected =
        table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();

      const selectedProjectIds = table
        .getSelectedRowModel()
        .rows.map((e) => e.original.id);

      function handleDeleteSelected() {
        void deleteSelectedProjects(selectedProjectIds);
      }

      if (
        someSelected &&
        role === Role.ADMIN &&
        stageLt(stage, Stage.PROJECT_ALLOCATION)
      )
        return (
          <div className="flex w-14 items-center justify-center">
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
                    onClick={handleDeleteSelected}
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span>Delete Selected Projects</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      return <ActionColumnLabel />;
    },
    cell: ({ row, table }) => {
      const project = row.original;
      const supervisor = row.original.supervisor;

      async function handleDelete() {
        void deleteProject(project.id).then(() => {
          table.toggleAllRowsSelected(false);
        });
      }
      return (
        <div className="flex w-14 items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <span className="sr-only">Open menu</span>
                <MoreIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="group/item">
                <Link
                  className="flex items-center gap-2 text-primary underline-offset-4 group-hover/item:underline hover:underline"
                  href={`./projects/${project.id}`}
                >
                  <CornerDownRightIcon className="h-4 w-4" />
                  <span>View Project details</span>
                </Link>
              </DropdownMenuItem>
              <AccessControl
                allowedRoles={[Role.ADMIN]}
                allowedStages={previousStages(Stage.PROJECT_SUBMISSION)}
                extraConditions={{ RBAC: { OR: supervisor.id === user.id } }}
              >
                <DropdownMenuItem className="group/item2 text-destructive focus:bg-red-100/40 focus:text-destructive">
                  <button
                    className="flex items-center gap-2"
                    onClick={handleDelete}
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span>Delete Project {project.id}</span>
                  </button>
                </DropdownMenuItem>
              </AccessControl>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  };

  if (role === Role.STUDENT) return baseCols;

  if (role === Role.SUPERVISOR) return [...baseCols, actionsCol];

  return stage === Stage.PROJECT_SUBMISSION
    ? [selectCol, ...baseCols, actionsCol]
    : [...baseCols, actionsCol];
}
