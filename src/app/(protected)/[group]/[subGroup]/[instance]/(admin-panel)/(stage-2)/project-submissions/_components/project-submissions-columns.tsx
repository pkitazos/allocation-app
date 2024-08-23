import { ColumnDef, Table } from "@tanstack/react-table";
import {
  CopyIcon,
  CornerDownRightIcon,
  DownloadIcon,
  MoreHorizontalIcon as MoreIcon,
  PenIcon,
} from "lucide-react";
import Link from "next/link";

import { CircleCheckSolidIcon } from "@/components/icons/circle-check";
import { CircleXIcon } from "@/components/icons/circle-x";
import { Button } from "@/components/ui/button";
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

import { useCsvExport } from "@/lib/utils/csv/use-csv-download";
import { copyToClipboard } from "@/lib/utils/general/copy-to-clipboard";
import { ProjectSubmissionDto } from "@/lib/validations/dto/project";

import { spacesLabels } from "@/content/spaces";

export function useProjectSubmissionColumns(): ColumnDef<ProjectSubmissionDto>[] {
  const selectCol = getSelectColumn<ProjectSubmissionDto>();

  const baseCols: ColumnDef<ProjectSubmissionDto>[] = [
    {
      id: "Name",
      accessorFn: (s) => s.name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      id: "Email",
      accessorFn: (s) => s.email,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      id: "Already Submitted",
      accessorFn: (s) => s.submittedProjectsCount,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-28"
          column={column}
          title="Already Submitted"
        />
      ),
      cell: ({
        row: {
          original: { submittedProjectsCount },
        },
      }) => <p className="w-full text-center">{submittedProjectsCount}</p>,
      footer: ({ table }) => {
        const rows = table.getCoreRowModel().rows;

        const count = rows.reduce(
          (acc, { original: r }) => acc + r.submittedProjectsCount,
          0,
        );
        return (
          <WithTooltip
            tip={
              <p>
                {count} projects have been submitted by {rows.length}{" "}
                supervisors
              </p>
            }
          >
            <p className="w-full text-center">
              Total:{" "}
              <span className="underline decoration-slate-400 decoration-dotted underline-offset-2">
                {count}
              </span>
            </p>
          </WithTooltip>
        );
      },
    },
    {
      id: "Submission Target",
      accessorFn: (s) => s.submissionTarget,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-28"
          column={column}
          title="Submission Target"
        />
      ),
      cell: ({
        row: {
          original: { submissionTarget },
        },
      }) => <p className="w-full text-center">{submissionTarget}</p>,
      footer: ({ table }) => {
        const rows = table.getCoreRowModel().rows;
        const count = rows.reduce(
          (acc, { original: r }) =>
            r.submittedProjectsCount >= r.submissionTarget ? acc + 1 : acc,
          0,
        );
        return (
          <WithTooltip
            tip={
              <p>
                {count} of {rows.length} supervisors have met their submission
                target
              </p>
            }
          >
            <p className="w-full text-center">
              Met Target:{" "}
              <span className="underline decoration-slate-400 decoration-dotted underline-offset-2">
                {count} / {rows.length}
              </span>
            </p>
          </WithTooltip>
        );
      },
    },
    {
      id: "Target Met",
      accessorFn: (s) => s.targetMet,
      header: "Target Met",
      cell: ({
        row: {
          original: { targetMet },
        },
      }) => (
        <div className="flex items-center justify-center">
          {targetMet ? (
            <CircleCheckSolidIcon className="h-4 w-4 fill-green-500" />
          ) : (
            <CircleXIcon className="h-4 w-4 fill-destructive" />
          )}
        </div>
      ),
      filterFn: (row, columnId, value) => {
        const selectedFilters = value as ("yes" | "no")[];
        const rowValue = row.getValue(columnId) as boolean;
        const targetMet = rowValue ? "yes" : "no";
        return selectedFilters.includes(targetMet);
      },
    },
    {
      accessorKey: "actions",
      id: "Actions",
      header: ({ table }) => {
        const someSelected =
          table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();

        if (someSelected)
          return (
            <div className="flex w-14 items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <span className="sr-only">Open menu</span>
                    <MoreIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" side="bottom">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 text-primary">
                    <ExportCSVButton table={table} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );

        return <ActionColumnLabel />;
      },
      cell: ({
        row: {
          original: { userId, name, email },
        },
      }) => (
        <div className="flex w-14 items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <span className="sr-only">Open menu</span>
                <MoreIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="bottom">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="group/item flex items-center gap-2 text-primary underline-offset-4">
                <button
                  className="m-0 flex items-center gap-2 p-1.5 text-sm"
                  onClick={async () => await copyToClipboard(email)}
                >
                  <CopyIcon className="h-4 w-4" />
                  <p>
                    copy{" "}
                    <span className="group-hover/item:underline">{email}</span>
                  </p>
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem className="group/item">
                <Link
                  className="flex items-center gap-2 text-primary underline-offset-4 group-hover/item:underline hover:underline"
                  href={`./supervisors/${userId}`}
                >
                  <CornerDownRightIcon className="h-4 w-4" />
                  <span>View {name} Details</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  className="flex items-center gap-2 text-primary underline-offset-4 group-hover/item:underline hover:underline"
                  href={`./supervisors/${userId}/edit`}
                >
                  <PenIcon className="h-4 w-4" />
                  <span>
                    Edit {name} {spacesLabels.instance.short} details
                  </span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
  return [selectCol, ...baseCols];
}

function ExportCSVButton({ table }: { table: Table<ProjectSubmissionDto> }) {
  const data = table
    .getSelectedRowModel()
    .rows.map(({ original: r }) => [
      r.name,
      r.email,
      r.submittedProjectsCount,
      r.submissionTarget,
    ]);

  const { downloadLinkRef, downloadCsv } = useCsvExport({
    header: ["Name", "Email", "Already Submitted", "Submission Target"],
    rows: data,
    filename: "project-submissions.csv",
  });

  return (
    <>
      <button
        className="m-0 flex items-center gap-2 p-1.5 text-sm"
        onClick={downloadCsv}
      >
        <DownloadIcon className="h-4 w-4" />
        <span>Download selected rows</span>
      </button>
      <a ref={downloadLinkRef} className="hidden" />
    </>
  );
}
