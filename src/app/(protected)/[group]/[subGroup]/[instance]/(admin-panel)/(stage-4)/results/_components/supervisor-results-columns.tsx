import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";

import { SupervisorMatchingDetailsDto } from "@/lib/validations/matching";

export function useSupervisorResultsColumns(): ColumnDef<SupervisorMatchingDetailsDto>[] {
  return [
    {
      id: "GUID",
      accessorFn: (s) => s.supervisorId,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="GUID" canFilter />
      ),
    },
    {
      id: "Name",
      accessorFn: (s) => s.supervisorName,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({
        row: {
          original: { supervisorId, supervisorName },
        },
      }) => (
        <Link
          className={buttonVariants({ variant: "link" })}
          href={`./supervisors/${supervisorId}`}
        >
          {supervisorName}
        </Link>
      ),
    },
    {
      id: "Target",
      accessorFn: (s) => s.projectTarget,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-28"
          column={column}
          title={"Target Considered (Actual)"}
        />
      ),
      cell: ({ row: { original: s } }) => (
        <p className="w-28 text-center">
          {s.projectTarget} ({s.actualTarget})
        </p>
      ),
      sortingFn: (a, b) => a.original.projectTarget - b.original.projectTarget,
    },
    {
      id: "Upper Quota",
      accessorFn: (s) => s.projectUpperQuota,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-28"
          column={column}
          title="Upper Quota Considered (Actual)"
        />
      ),
      cell: ({ row: { original: s } }) => (
        <p className="w-28 text-center">
          {s.projectUpperQuota} ({s.actualUpperQuota})
        </p>
      ),
      sortingFn: (a, b) =>
        a.original.projectUpperQuota - b.original.projectUpperQuota,
    },
    {
      id: "Allocation Count",
      accessorFn: (s) => s.allocationCount,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-28"
          column={column}
          title="Allocation Count (Pre-allocated)"
        />
      ),
      cell: ({ row: { original: s } }) => (
        <p className="w-28 text-center">
          {s.allocationCount} ({s.preAllocatedCount})
        </p>
      ),
      sortingFn: (a, b) =>
        a.original.allocationCount - b.original.allocationCount,
    },
    {
      id: "Target Difference",
      accessorFn: (s) => s.difference,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-28"
          column={column}
          title="Target Difference"
        />
      ),
      cell: ({ row: { original: s } }) => (
        <p className="w-28 text-center">
          {s.difference > 0 ? `+${s.difference}` : s.difference}
        </p>
      ),
    },
  ];
}
