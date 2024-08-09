"use client";
import { PreferenceType, Stage } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CornerDownRightIcon } from "lucide-react";
import Link from "next/link";

import { useInstanceStage } from "@/components/params-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ActionColumnLabel } from "@/components/ui/data-table/action-column-label";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { getSelectColumn } from "@/components/ui/data-table/select-column";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { WithTooltip } from "@/components/ui/tooltip-wrapper";

import { stageLt } from "@/lib/utils/permissions/stage-check";
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
  changePreference,
  changeSelectedPreferences,
}: {
  changePreference: (
    newType: StudentPreferenceType,
    id: string,
  ) => Promise<void>;
  changeSelectedPreferences: (
    newType: StudentPreferenceType,
    ids: string[],
  ) => Promise<void>;
}): ColumnDef<PreferenceData>[] {
  const stage = useInstanceStage();
  const selectCol = getSelectColumn<PreferenceData>();

  const userCols: ColumnDef<PreferenceData>[] = [
    {
      id: "ID",
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
      id: "Title",
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
      id: "Supervisor",
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
      id: "Type",
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
      id: "Rank",
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

      const rowTypes = table.getRowModel().rows.map((r) => r.original.type);
      const defaultType = rowTypes.reduce(
        (acc, val) => (acc === val ? acc : undefined),
        rowTypes.at(0),
      );

      if (someSelected && stageLt(stage, Stage.PROJECT_ALLOCATION)) {
        return (
          <div className="flex w-full items-center justify-center">
            <StudentPreferenceActionMenu
              defaultType={defaultType}
              changePreference={async (newPreferenceType) =>
                void changeSelectedPreferences(
                  newPreferenceType,
                  selectedProjectIds,
                )
              }
            />
          </div>
        );
      }
      return <ActionColumnLabel className="w-24" />;
    },
    cell: ({
      row: {
        original: { project, type },
      },
    }) => (
      <div className="flex w-full items-center justify-center">
        <StudentPreferenceActionMenu
          defaultType={type}
          changePreference={async (newPreferenceType) =>
            void changePreference(newPreferenceType, project.id)
          }
        >
          <DropdownMenuItem className="group/item">
            <Link
              className="flex items-center gap-2 text-primary underline-offset-4 group-hover/item:underline hover:underline"
              href={`../projects/${project.id}`}
            >
              <CornerDownRightIcon className="h-4 w-4" />
              <span>View Project details</span>
            </Link>
          </DropdownMenuItem>
        </StudentPreferenceActionMenu>
      </div>
    ),
  };

  return [selectCol, ...userCols, actionsCol];
}
