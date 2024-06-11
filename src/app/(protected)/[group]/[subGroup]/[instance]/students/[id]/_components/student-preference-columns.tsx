import { PreferenceType, Role, Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { LucideMoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { stageCheck } from "@/lib/utils/permissions/stage-check";

import { PreferenceButton } from "../../../projects/[id]/_components/preference-button";

export type PreferenceData = {
  project: {
    id: string;
    title: string;
  };
  supervisor: {
    name: string | null;
    id: string;
  };
  type: PreferenceType;
  rank: number;
};

export function studentPreferenceColumns(
  role: Role,
  stage: Stage,
  changePreference: (preferenceType: PreferenceType, projectId: string) => void,
  changeAllPreferences: () => void,
): ColumnDef<PreferenceData>[] {
  const selectCol: ColumnDef<PreferenceData> = {
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

  const userCols: ColumnDef<PreferenceData>[] = [
    {
      id: "projectId",
      accessorFn: ({ project }) => project.id,
    },
    { id: "projectTitle", accessorFn: ({ project }) => project.title },
    { id: "supervisorId", accessorFn: ({ supervisor }) => supervisor.id },
    { id: "supervisorName", accessorFn: ({ supervisor }) => supervisor.name },
    { id: "type", accessorFn: ({ type }) => type },
    { id: "rank", accessorFn: ({ rank }) => rank },
  ];

  const actionsCol: ColumnDef<PreferenceData> = {
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
              onClick={changeAllPreferences}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      }
      return <div className="text-xs text-muted-foreground">Actions</div>;
    },
    cell: ({
      row: {
        original: { project, type },
      },
    }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <LucideMoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`./projects/${project.id}`}>
                <Button variant="link">View Details</Button>
              </Link>
            </DropdownMenuItem>
            {role === Role.ADMIN &&
              !stageCheck(stage, Stage.PROJECT_ALLOCATION) && (
                <DropdownMenuItem>
                  {/* <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => changePreference(project.id, )}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button> */}
                  <PreferenceButton
                    projectId={project.id}
                    defaultStatus={type}
                  />
                </DropdownMenuItem>
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  if (role !== Role.ADMIN) return userCols;

  return stageCheck(stage, Stage.PROJECT_ALLOCATION)
    ? [...userCols, actionsCol]
    : [selectCol, ...userCols, actionsCol];
}
