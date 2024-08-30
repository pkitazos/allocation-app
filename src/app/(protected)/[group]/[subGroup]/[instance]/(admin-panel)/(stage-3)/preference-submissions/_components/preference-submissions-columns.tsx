import { ColumnDef } from "@tanstack/react-table";
import {
  CopyIcon,
  CornerDownRightIcon,
  MoreHorizontalIcon as MoreIcon,
  PenIcon,
} from "lucide-react";
import Link from "next/link";

import { ExportCSVButton } from "@/components/export-csv";
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

import { copyToClipboard } from "@/lib/utils/general/copy-to-clipboard";
import { PreferenceSubmissionDto } from "@/lib/validations/dto/preference";

export function usePreferenceSubmissionColumns(): ColumnDef<PreferenceSubmissionDto>[] {
  const selectCol = getSelectColumn<PreferenceSubmissionDto>();

  const baseCols: ColumnDef<PreferenceSubmissionDto>[] = [
    {
      id: "GUID",
      accessorFn: (s) => s.id,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="GUID" canFilter />
      ),
    },
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
      id: "Count",
      accessorFn: (s) => s.submissionCount,
      header: ({ column }) => (
        <DataTableColumnHeader className="w-28" column={column} title="Count" />
      ),
      cell: ({
        row: {
          original: { submissionCount },
        },
      }) => <p className="w-full text-center">{submissionCount}</p>,
    },
    {
      id: "Submitted",
      accessorFn: (s) => s.submitted,
      header: "Submitted",
      cell: ({
        row: {
          original: { submitted },
        },
      }) => (
        <div className="flex items-center justify-center">
          {submitted ? (
            <CircleCheckSolidIcon className="h-4 w-4 fill-green-500" />
          ) : (
            <CircleXIcon className="h-4 w-4 fill-destructive" />
          )}
        </div>
      ),
      filterFn: (row, columnId, value) => {
        const selectedFilters = value as ("yes" | "no")[];
        const rowValue = row.getValue(columnId) as boolean;
        const submitted = rowValue ? "yes" : "no";
        return selectedFilters.includes(submitted);
      },
    },
    {
      accessorKey: "actions",
      id: "Actions",
      header: ({ table }) => {
        const someSelected =
          table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected();

        const data = table
          .getSelectedRowModel()
          .rows.map(({ original: r }) => [
            r.id,
            r.name,
            r.email,
            r.submissionCount,
            r.submitted ? 1 : 0,
          ]);

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
                    <ExportCSVButton
                      filename="preference-submissions"
                      text="Download selected rows"
                      header={["GUID", "Name", "Email", "Count", "Submitted"]}
                      data={data}
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );

        return <ActionColumnLabel />;
      },
      cell: ({
        row: {
          original: { id, name, email },
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
              <DropdownMenuLabel>
                Actions
                <span className="ml-2 text-muted-foreground">for {name}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="group/item">
                <Link
                  className="flex items-center gap-2 text-primary underline-offset-4 group-hover/item:underline hover:underline"
                  href={`./students/${id}`}
                >
                  <CornerDownRightIcon className="h-4 w-4" />
                  <span>View student details</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="group/item">
                <Link
                  className="flex items-center gap-2 text-primary underline-offset-4 group-hover/item:underline hover:underline"
                  href={`./students/${id}?edit=true`}
                >
                  <PenIcon className="h-4 w-4" />
                  <span>Edit student details</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="group/item">
                <button
                  className="flex items-center gap-2 text-sm text-primary underline-offset-4 group-hover/item:underline hover:underline"
                  onClick={async () => await copyToClipboard(email)}
                >
                  <CopyIcon className="h-4 w-4" />
                  <span>Copy email</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
  return [selectCol, ...baseCols];
}
