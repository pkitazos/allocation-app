import { Role, Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { LucideMoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { User } from "next-auth";

import { TagType } from "@/components/tag/tag-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
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

import { previousStages, stageGte } from "@/lib/utils/permissions/stage-check";
import { AccessControl } from "@/components/access-control";

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
  const selectCol: ColumnDef<SupervisorProjectData> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const userCols: ColumnDef<SupervisorProjectData>[] = [
    {
      id: "id",
      accessorFn: ({ id }) => id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" canFilter />
      ),
      cell: ({ row: { original: project } }) => (
        <div className="text-left">
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
        <DataTableColumnHeader column={column} title="Tags" />
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
      const allSelected = table.getIsAllRowsSelected();
      // TODO: fix selection logic and pass selected projectIds to delete function
      if (
        allSelected &&
        (role === Role.ADMIN || user.id === supervisorId) &&
        !stageGte(stage, Stage.PROJECT_ALLOCATION)
      ) {
        return (
          <div className="flex justify-center">
            <Button
              className="flex items-center gap-2"
              variant="destructive"
              size="sm"
              onClick={() => deleteSelectedSupervisorProjects([])}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }
      return <div className="text-xs text-muted-foreground">Actions</div>;
    },
    cell: ({ row: { original: project } }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <span className="sr-only">Open menu</span>
              <LucideMoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`../projects/${project.id}`}>
                <Button variant="link">View Details</Button>
              </Link>
            </DropdownMenuItem>
            <AccessControl
              allowedRoles={[Role.ADMIN]}
              allowedStages={previousStages(Stage.PROJECT_SELECTION)}
              extraConditions={{ RBAC: { OR: supervisorId === user.id } }}
            >
              <DropdownMenuItem>
                <Button
                  className="flex w-full items-center gap-2"
                  variant="destructive"
                  onClick={() => deleteSupervisorProject(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <p>Delete</p>
                </Button>
              </DropdownMenuItem>
            </AccessControl>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  if (role !== Role.ADMIN && user.id !== supervisorId) return userCols;

  return stageGte(stage, Stage.PROJECT_ALLOCATION)
    ? [...userCols, actionsCol]
    : [selectCol, ...userCols, actionsCol];
}
