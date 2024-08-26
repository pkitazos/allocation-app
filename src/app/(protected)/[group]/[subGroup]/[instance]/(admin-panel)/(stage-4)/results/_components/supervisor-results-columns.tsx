import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";

import { SupervisorMatchingDetailsDto } from "@/lib/validations/matching";

export const supervisorResultsColumns: ColumnDef<SupervisorMatchingDetailsDto>[] =
  [
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
        <DataTableColumnHeader column={column} title="Name" canFilter />
      ),
    },
    {
      id: "Target",
      accessorFn: (s) => s.projectTarget,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-28"
          column={column}
          title="Target"
        />
      ),
      cell: ({ row: { original: s } }) => (
        <p className="w-28 text-center">{s.projectTarget}</p>
      ),
    },
    {
      id: "Upper Quota",
      accessorFn: (s) => s.projectUpperQuota,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-28"
          column={column}
          title="Upper Quota"
        />
      ),
      cell: ({ row: { original: s } }) => (
        <p className="w-28 text-center">{s.projectUpperQuota}</p>
      ),
    },
    {
      id: "Allocation Count",
      accessorFn: (s) => s.allocationCount,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="w-28"
          column={column}
          title="Allocation Count"
        />
      ),
      cell: ({ row: { original: s } }) => (
        <p className="w-28 text-center">{s.allocationCount}</p>
      ),
    },
  ];
