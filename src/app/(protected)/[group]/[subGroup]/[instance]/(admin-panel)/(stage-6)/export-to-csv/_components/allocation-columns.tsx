import { ColumnDef } from "@tanstack/react-table";

import { buttonVariants } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { WithTooltip } from "@/components/ui/tooltip-wrapper";

import { AllocationCsvData } from "@/lib/validations/allocation-csv-data";

export const columns: ColumnDef<AllocationCsvData>[] = [
  {
    id: "Project Internal ID",
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
    id: "Student GUID",
    accessorFn: (row) => row.studentId,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student GUID" canFilter />
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
    id: "Student Matric.",
    accessorFn: (row) => row.studentMatric,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Student Matric."
        canFilter
      />
    ),
    cell: ({
      row: {
        original: { studentMatric },
      },
    }) => (
      <div className="flex w-32 items-center justify-center">
        <WithTooltip tip={studentMatric} duration={500}>
          <p className={buttonVariants({ variant: "ghost" })}>
            {studentMatric}
          </p>
        </WithTooltip>
      </div>
    ),
  },
  {
    id: "Student Level",
    accessorFn: (row) => row.studentLevel,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Student Level" />
    ),
    cell: ({
      row: {
        original: { studentLevel },
      },
    }) => <div className="text-center">{studentLevel}</div>,
  },
  {
    id: "Project Title",
    accessorFn: (row) => row.projectTitle,
    header: () => <div className="w-32 py-1">Project Title</div>,
  },
  {
    id: "Project Description",
    accessorFn: (row) => row.projectDescription,
    header: () => <div className="w-60 py-1">Project Description</div>,
  },
  {
    id: "Project Special Technical Requirements",
    accessorFn: (row) => row.projectSpecialTechnicalRequirements,
    header: () => (
      <div className="w-40 py-1">Project Special Technical Requirements</div>
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
