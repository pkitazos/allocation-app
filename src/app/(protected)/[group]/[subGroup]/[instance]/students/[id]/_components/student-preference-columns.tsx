"use client";
import { PreferenceType, Role, Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { ChangePreferenceButton } from "@/components/change-preference-button";
import { useInstanceStage } from "@/components/params-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActionColumnLabel } from "@/components/ui/data-table/action-column-label";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { getSelectColumn } from "@/components/ui/data-table/select-column";
import { WithTooltip } from "@/components/ui/tooltip-wrapper";

import { stageGte } from "@/lib/utils/permissions/stage-check";
import { StudentPreferenceType } from "@/lib/validations/student-preference";

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

export function constructColumns({
  role,
  changePreference,
  changeSelectedPreferences,
}: {
  role: Role;
  changePreference: (
    newPreferenceType: StudentPreferenceType,
    projectId: string,
  ) => Promise<void>;
  changeSelectedPreferences: (
    newPreferenceType: StudentPreferenceType,
    projectIds: string[],
  ) => Promise<void>;
}): ColumnDef<PreferenceData>[] {
  const stage = useInstanceStage();
  const selectCol = getSelectColumn<PreferenceData>();

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
          <WithTooltip tip={project.id}>
            <Button variant="ghost" className="cursor-default">
              <div className="w-20 truncate">{project.id}</div>
            </Button>
          </WithTooltip>
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
      const someSelected =
        table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();

      const selectedProjectIds = table
        .getSelectedRowModel()
        .rows.map((e) => e.original.project.id);

      if (
        someSelected &&
        role === Role.ADMIN &&
        !stageGte(stage, Stage.PROJECT_ALLOCATION)
      ) {
        return (
          <ChangePreferenceButton
            className="w-24 text-xs"
            dropdownLabel="Change Type to:"
            defaultStatus="None"
            changeFunction={async (newPreference) => {
              changeSelectedPreferences(newPreference, selectedProjectIds);
            }}
          />
        );
      }
      return <ActionColumnLabel className="w-24" />;
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
