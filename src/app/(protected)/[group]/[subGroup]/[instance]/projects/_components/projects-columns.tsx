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

import { stageCheck } from "@/lib/utils/permissions/stage-check";

export interface ProjectTableData {
  user: User;
  description: string;
  id: string;
  title: string;
  supervisor: {
    user: {
      id: string;
      name: string | null;
    };
  };
  flagOnProjects: {
    flag: {
      id: string;
      title: string;
    };
  }[];
  tagOnProject: {
    tag: {
      id: string;
      title: string;
    };
  }[];
}

export function projectColumns(
  user: User,
  role: Role,
  stage: Stage,
  deleteProject: (id: string) => void,
  deleteAllProjects: () => void,
): ColumnDef<ProjectTableData>[] {
  const selectCol: ColumnDef<ProjectTableData> = {
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

  const userCols: ColumnDef<ProjectTableData>[] = [
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
      accessorFn: (row) => row.supervisor.user.name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Supervisor" />
      ),
      cell: ({
        row: {
          original: {
            supervisor: {
              user: { id, name },
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

  const actionsCol: ColumnDef<ProjectTableData> = {
    accessorKey: "actions",
    id: "Actions",
    header: ({ table }) => {
      const allSelected = table.getIsAllRowsSelected();

      if (
        allSelected &&
        role === Role.ADMIN &&
        !stageCheck(stage, Stage.PROJECT_ALLOCATION)
      ) {
        return (
          <div className="flex justify-center">
            <Button
              className="flex items-center gap-2"
              variant="destructive"
              size="sm"
              onClick={deleteAllProjects}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }

      return <div className="text-xs text-gray-500">Actions</div>;
    },
    cell: ({ row }) => {
      const project = row.original;
      const supervisor = row.original.supervisor.user;

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
              <Link href={`./projects/${project.id}`}>
                <Button variant="link">View Details</Button>
              </Link>
            </DropdownMenuItem>
            {(role === Role.ADMIN || user.id === supervisor.id) &&
              !stageCheck(stage, Stage.PROJECT_ALLOCATION) && (
                <DropdownMenuItem>
                  <Button
                    className="flex w-full items-center gap-2"
                    variant="destructive"
                    onClick={() => deleteProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <p>Delete</p>
                  </Button>
                </DropdownMenuItem>
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  if (role === Role.STUDENT) return userCols;

  if (role === Role.SUPERVISOR) return [...userCols, actionsCol];

  return stageCheck(stage, Stage.PROJECT_ALLOCATION)
    ? [...userCols, actionsCol]
    : [selectCol, ...userCols, actionsCol];
}
