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
import { previousStages, stageGte } from "@/lib/utils/permissions/stage-check";

export interface SupervisorProjectData {
  title: string;
  id: string;
  supervisor: {
    userId: string;
  };
  flagOnProjects: {
    flag: {
      title: string;
      id: string;
    };
  }[];
  tagOnProject: {
    tag: {
      title: string;
      id: string;
    };
  }[];
}

export function supervisorProjectsColumns(
  user: User,
  role: Role,
  stage: Stage,
  supervisorId: string,
  deleteSupervisorProject: (id: string) => Promise<void>,
  deleteSelectedSupervisorProjects: (ids: string[]) => Promise<void>,
): ColumnDef<SupervisorProjectData>[] {
  const selectCol = getSelectColumn<SupervisorProjectData>();

  const userCols: ColumnDef<SupervisorProjectData>[] = [
    {
      id: "id",
      accessorFn: ({ id }) => id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" canFilter />
      ),
      cell: ({ row: { original: project } }) => (
        <div className="text-left">
          <WithTooltip tip={project.id}>
            <Button variant="ghost" className="cursor-default">
              <div className="w-16 truncate">{project.id}</div>
            </Button>
          </WithTooltip>
        </div>
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
        <Button variant="link">
          <Link href={`../projects/${id}`}>{title}</Link>
        </Button>
      ),
    },
    {
      id: "flags",
      accessorFn: (row) => row.flagOnProjects,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Flags" />
      ),
      filterFn: (row, columnId, value) => {
        const ids = value as string[];
        const rowFlags = row.getValue(columnId) as { flag: TagType }[];
        return rowFlags.some((e) => ids.includes(e.flag.id));
      },
      cell: ({
        row: {
          original: { flagOnProjects },
        },
      }) => (
        <div className="flex flex-col gap-2">
          {flagOnProjects.length > 2 ? (
            <Badge className="rounded-sm px-1 font-normal">
              {flagOnProjects.length} selected
            </Badge>
          ) : (
            flagOnProjects.map(({ flag }) => (
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
      accessorFn: (row) => row.tagOnProject,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Keywords" />
      ),
      filterFn: (row, columnId, value) => {
        const ids = value as string[];
        const rowTags = row.getValue(columnId) as { tag: TagType }[];
        return rowTags.some((e) => ids.includes(e.tag.id));
      },
      cell: ({
        row: {
          original: { tagOnProject },
        },
      }) => (
        <div className="flex flex-col gap-2">
          {tagOnProject.length > 2 ? (
            <Badge variant="outline" className="rounded-sm px-1 font-normal">
              {tagOnProject.length} selected
            </Badge>
          ) : (
            tagOnProject.map(({ tag }) => (
              <Badge variant="outline" className="w-fit" key={tag.id}>
                {tag.title}
              </Badge>
            ))
          )}
        </div>
      ),
    },
  ];

  const actionsCol: ColumnDef<SupervisorProjectData> = {
    id: "actions",
    accessorKey: "actions",
    header: ({ table }) => {
      const someSelected =
        table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();

      const selectedProjectIds = table
        .getSelectedRowModel()
        .rows.map((e) => e.original.id);

      if (
        someSelected &&
        (role === Role.ADMIN || user.id === supervisorId) &&
        !stageGte(stage, Stage.PROJECT_ALLOCATION)
      ) {
        return (
          <div className="flex w-14 items-center justify-center">
            <WithTooltip
              tip={<p className="text-gray-700">Delete selected Projects</p>}
              duration={500}
            >
              <Button
                className="flex items-center gap-2"
                variant="destructive"
                size="sm"
                onClick={async () =>
                  await deleteSelectedSupervisorProjects(
                    selectedProjectIds,
                  ).then(() => table.toggleAllRowsSelected(false))
                }
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </WithTooltip>
          </div>
        );
      }
      return <ActionColumnLabel />;
    },
    cell: ({ row: { original: project }, table }) => {
      async function handleDelete() {
        await deleteSupervisorProject(project.id).then(() => {
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
                  href={`../projects/${project.id}`}
                >
                  <CornerDownRightIcon className="h-4 w-4" />
                  <span>View Project Details</span>
                </Link>
              </DropdownMenuItem>
              <AccessControl
                allowedRoles={[Role.ADMIN]}
                allowedStages={previousStages(Stage.PROJECT_SELECTION)}
                extraConditions={{ RBAC: { OR: supervisorId === user.id } }}
              >
                <DropdownMenuItem className="group/item2 text-destructive focus:bg-red-100/40 focus:text-destructive">
                  <button
                    className="flex items-center gap-2"
                    onClick={handleDelete}
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span>Delete Project</span>
                  </button>
                </DropdownMenuItem>
              </AccessControl>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  };

  if (role !== Role.ADMIN && user.id !== supervisorId) return userCols;

  return stageGte(stage, Stage.PROJECT_ALLOCATION)
    ? [...userCols, actionsCol]
    : [selectCol, ...userCols, actionsCol];
}
