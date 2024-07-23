import { ColumnDef } from "@tanstack/react-table";

import { buttonVariants } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { WithTooltip } from "@/components/ui/tooltip-wrapper";

import { AllocationCsvData } from "@/lib/validations/allocation-csv-data";

export const columns: ColumnDef<AllocationCsvData>[] = [
  {
    id: "project Internal ID",
    accessorFn: (row) => row.projectInternalId,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Project Internal ID"
        canFilter
      />
    ),
    cell: ({
      row: {
        original: { projectInternalId },
      },
    }) => (
      <div className="flex w-32 items-center justify-center">
        <WithTooltip tip={projectInternalId} duration={500}>
          <p className={buttonVariants({ variant: "ghost" })}>
            {projectInternalId}
          </p>
        </WithTooltip>
      </div>
    ),
  },
  {
    id: "project External ID",
    accessorFn: (row) => row.projectExternalId,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Project External ID"
        canFilter
      />
    ),
    cell: ({
      row: {
        original: { projectExternalId },
      },
    }) => (
      <div className="flex w-32 items-center justify-center">
        <WithTooltip tip={projectExternalId} duration={500}>
          <p className={buttonVariants({ variant: "ghost" })}>
            {projectExternalId}
          </p>
        </WithTooltip>
      </div>
    ),
  },
  {
    id: "student ID",
    accessorFn: (row) => row.studentId,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student ID" canFilter />
    ),
    cell: ({
      row: {
        original: { studentId },
      },
    }) => (
      <div className="flex w-32 items-center justify-center">
        <WithTooltip tip={studentId} duration={500}>
          <p className={buttonVariants({ variant: "ghost" })}>{studentId}</p>
        </WithTooltip>
      </div>
    ),
  },
  {
    id: "project Title",
    accessorFn: (row) => row.projectTitle,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Title" />
    ),
  },
  {
    id: "project Description",
    accessorFn: (row) => row.projectDescription,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Description" />
    ),
  },
  {
    id: "project Special Technical Requirements",
    accessorFn: (row) => row.projectSpecialTechnicalRequirements,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Project Special Technical Requirements"
      />
    ),
  },
  {
    id: "student Ranking",
    accessorFn: (row) => row.studentRanking,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Ranking" />
    ),
    cell: ({
      row: {
        original: { studentRanking },
      },
    }) => <p className="text-center">{studentRanking}</p>,
  },
];
