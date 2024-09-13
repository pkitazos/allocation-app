import { Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  CornerDownRightIcon,
  LucideMoreHorizontal as MoreIcon,
  PenIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";

import { AccessControl } from "@/components/access-control";
import { useInstancePath, useInstanceStage } from "@/components/params-context";
import { TagType } from "@/components/tag/tag-input";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { WithTooltip } from "@/components/ui/tooltip-wrapper";
import {
  YesNoActionContainer,
  YesNoActionTrigger,
} from "@/components/yes-no-action";

import { cn } from "@/lib/utils";
import {
  previousStages,
  stageGte,
  stageLt,
} from "@/lib/utils/permissions/stage-check";
import { SupervisorProjectDto } from "@/lib/validations/dto/project";

export function useSupervisorProjectsColumns({
  deleteProject,
  deleteSelectedProjects,
}: {
  deleteProject: (id: string) => Promise<void>;
  deleteSelectedProjects: (ids: string[]) => Promise<void>;
}): ColumnDef<SupervisorProjectDto>[] {
  const stage = useInstanceStage();
  const instancePath = useInstancePath();

  const selectCol = getSelectColumn<SupervisorProjectDto>();

  const userCols: ColumnDef<SupervisorProjectDto>[] = [
    {
      id: "ID",
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
      id: "Title",
      accessorFn: ({ title }) => title,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({
        row: {
          original: { id, title },
        },
      }) => (
        <Link
          className={cn(
            buttonVariants({ variant: "link" }),
            "inline-block h-max w-60 px-0 text-start",
          )}
          href={`${instancePath}/projects/${id}`}
        >
          {title}
        </Link>
      ),
    },
    {
      id: "Flags",
      accessorFn: (row) => row.flags,
      header: () => <div className="text-center">Flags</div>,
      filterFn: (row, columnId, value) => {
        const ids = value as string[];
        const rowFlags = row.getValue(columnId) as TagType[];
        return rowFlags.some((f) => ids.includes(f.id));
      },
      cell: ({
        row: {
          original: { flags },
        },
      }) => (
        <div className="flex flex-col gap-2">
          {flags.length > 2 ? (
            <>
              <Badge className="w-fit" key={flags[0].id}>
                {flags[0].title}
              </Badge>
              <WithTooltip
                side="right"
                tip={
                  <ul className="flex list-disc flex-col gap-1 p-2 pl-1">
                    {flags.slice(1).map((flag) => (
                      <Badge className="w-fit" key={flag.id}>
                        {flag.title}
                      </Badge>
                    ))}
                  </ul>
                }
              >
                <div className={cn(badgeVariants(), "w-fit font-normal")}>
                  {flags.length - 1}+
                </div>
              </WithTooltip>
            </>
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
      id: "Keywords",
      accessorFn: (row) => row.tags,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Keywords" />
      ),
      filterFn: (row, columnId, value) => {
        const ids = value as string[];
        const rowTags = row.getValue(columnId) as TagType[];
        return rowTags.some((t) => ids.includes(t.id));
      },
      cell: ({
        row: {
          original: { tags },
        },
      }) => (
        <div className="flex flex-col gap-2">
          {tags.length > 2 ? (
            <>
              <Badge variant="outline" className="w-fit" key={tags[0].id}>
                {tags[0].title}
              </Badge>
              <WithTooltip
                side="right"
                tip={
                  <ul className="flex list-disc flex-col gap-1 p-2 pl-1">
                    {tags.slice(1).map((tag) => (
                      <Badge variant="outline" className="w-fit" key={tag.id}>
                        {tag.title}
                      </Badge>
                    ))}
                  </ul>
                }
              >
                <div
                  className={cn(
                    badgeVariants({ variant: "outline" }),
                    "w-fit font-normal",
                  )}
                >
                  {tags.length - 1}+
                </div>
              </WithTooltip>
            </>
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
    {
      accessorFn: (p) => p.preAllocatedStudentId,
      id: "Student",
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-24"
          column={column}
          title="Student"
        />
      ),
      cell: ({
        row: {
          original: { preAllocatedStudentId },
        },
      }) =>
        preAllocatedStudentId && (
          <Link
            className={buttonVariants({ variant: "link" })}
            href={`./students/${preAllocatedStudentId}`}
          >
            {preAllocatedStudentId}
          </Link>
        ),
      filterFn: (row, _, value) => {
        const selectedFilters = value as ("yes" | "no")[]; // selected filters
        const studentId = row.original.preAllocatedStudentId ? "yes" : "no"; // row value
        return selectedFilters.includes(studentId);
      },
    },
  ];

  const actionsCol: ColumnDef<SupervisorProjectDto> = {
    id: "actions",
    header: ({ table }) => {
      const someSelected =
        table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();

      const selectedProjectIds = table
        .getSelectedRowModel()
        .rows.map((e) => e.original.id);

      if (someSelected && stageLt(stage, Stage.PROJECT_ALLOCATION)) {
        return (
          <div className="flex w-14 items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <span className="sr-only">Open menu</span>
                  <MoreIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <YesNoActionContainer
                action={async () =>
                  void deleteSelectedProjects(selectedProjectIds)
                }
                title="Delete Projects?"
                description={
                  selectedProjectIds.length === 1
                    ? `You are about to delete "${selectedProjectIds[0]}". Do you wish to proceed?`
                    : `You are about to delete ${selectedProjectIds.length} projects. Do you wish to proceed?`
                }
              >
                <DropdownMenuContent align="center" side="bottom">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:bg-red-100/40 focus:text-destructive">
                    <YesNoActionTrigger
                      trigger={
                        <button className="flex items-center gap-2">
                          <Trash2Icon className="h-4 w-4" />
                          <span>Delete selected Projects</span>
                        </button>
                      }
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </YesNoActionContainer>
            </DropdownMenu>
          </div>
        );
      }
      return <ActionColumnLabel />;
    },
    cell: ({ row: { original: project }, table }) => {
      async function handleDelete() {
        await deleteProject(project.id).then(() => {
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
            <YesNoActionContainer
              action={handleDelete}
              title="Delete Project?"
              description={`You are about to delete project ${project.id}. Do you wish to proceed?`}
            >
              <DropdownMenuContent side="bottom">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="group/item">
                  <Link
                    className="flex items-center gap-2 text-primary underline-offset-4 group-hover/item:underline hover:underline"
                    href={`../projects/${project.id}`}
                  >
                    <CornerDownRightIcon className="h-4 w-4" />
                    <p className="flex items-center">
                      View &quot;
                      <p className="max-w-40 truncate">{project.title}</p>
                      &quot;
                    </p>
                  </Link>
                </DropdownMenuItem>
                <AccessControl
                  allowedStages={previousStages(Stage.PROJECT_SELECTION)}
                >
                  <DropdownMenuItem className="group/item">
                    <Link
                      className="flex items-center gap-2 text-primary underline-offset-4 group-hover/item:underline hover:underline"
                      href={`${instancePath}/projects/${project.id}/edit`}
                    >
                      <PenIcon className="h-4 w-4" />
                      <span>Edit Project details</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="group/item2 text-destructive focus:bg-red-100/40 focus:text-destructive">
                    <YesNoActionTrigger
                      trigger={
                        <button className="flex items-center gap-2">
                          <Trash2Icon className="h-4 w-4" />
                          <span>Delete Project</span>
                        </button>
                      }
                    />
                  </DropdownMenuItem>
                </AccessControl>
              </DropdownMenuContent>
            </YesNoActionContainer>
          </DropdownMenu>
        </div>
      );
    },
  };

  return stageGte(stage, Stage.PROJECT_ALLOCATION)
    ? [...userCols, actionsCol]
    : [selectCol, ...userCols, actionsCol];
}
