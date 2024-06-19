"use client";
import { PreferenceType, Role, Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { ChangePreferenceButton } from "@/components/change-preference-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { stageCheck } from "@/lib/utils/permissions/stage-check";
import { StudentPreferenceType } from "@/lib/validations/student-preference";
import { useRouter } from "next/navigation";
import { StudentPreferenceActionMenu } from "./student-preference-action-menu";

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
  changePreference: (
    newPreferenceType: StudentPreferenceType,
    projectId: string,
  ) => Promise<void>,
  changeAllPreferences: (
    newPreferenceType: StudentPreferenceType,
  ) => Promise<void>,
): ColumnDef<PreferenceData>[] {
  const router = useRouter();

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
      id: "Project ID",
      accessorFn: ({ project }) => project.id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" canFilter />
      ),
      cell: ({
        row: {
          original: { project },
        },
      }) => (
        <div className="text-left">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="cursor-default">
                  <div className="w-20 truncate">{project.id}</div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{project.id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      id: "Project Title",
      accessorFn: ({ project }) => project.title,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({
        row: {
          original: { project },
        },
      }) => (
        <Button variant="link" className="cursor-default" asChild>
          <Link href={`../projects/${project.id}`}>{project.title}</Link>
        </Button>
      ),
    },
    {
      id: "Supervisor Name",
      accessorFn: ({ supervisor }) => supervisor.name,
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
        <Button variant="link" asChild>
          <Link href={`../supervisors/${id}`}>{name}</Link>
        </Button>
      ),
    },
    {
      id: "type",
      accessorFn: ({ type }) => type,
      header: ({ column }) => (
        <DataTableColumnHeader title="Type" column={column} />
      ),
      cell: ({
        row: {
          original: { type },
        },
      }) => {
        return type === PreferenceType.PREFERENCE ? (
          <Badge className="bg-primary text-center font-semibold">
            Preference
          </Badge>
        ) : (
          <Badge className="bg-secondary text-center font-semibold">
            Shortlist
          </Badge>
        );
      },
    },
    {
      id: "rank",
      accessorFn: ({ rank }) => rank,
      header: ({ column }) => (
        <DataTableColumnHeader title="Rank" column={column} />
      ),
      cell: ({
        row: {
          original: { rank },
        },
      }) => <div className="text-center font-semibold">{rank}</div>,
    },
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
          <ChangePreferenceButton
            className="w-24 text-xs"
            dropdownLabel="Change Type to:"
            defaultStatus="None"
            changeFunction={changeAllPreferences}
          />
        );
      }
      return (
        <div className="w-24 text-center text-sm text-muted-foreground">
          Actions
        </div>
      );
    },
    cell: ({
      row: {
        original: { project, type },
      },
    }) => {
      async function handleChangePreference(
        newPreferenceType: StudentPreferenceType,
      ) {
        changePreference(newPreferenceType, project.id);
      }

      return (
        <div className="flex w-full items-center justify-center">
          <StudentPreferenceActionMenu
            defaultType={type}
            projectId={project.id}
            changePreference={handleChangePreference}
          />
        </div>
      );
    },
  };

  return [selectCol, ...userCols, actionsCol];
}
