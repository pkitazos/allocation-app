"use client";

import DataTable from "@/components/ui/data-table/data-table";

import { SearchableColumn } from "@/lib/validations/table";

import { bySupervisorColumns, SupervisorData } from "./by-supervisor-columns";

export function BySupervisorDataTable({ data }: { data: SupervisorData[] }) {
  const primaryColumn: SearchableColumn = {
    id: "supervisorId",
    displayName: "Supervisor IDs",
  };

  return (
    <div className="w-full">
      <DataTable
        searchableColumn={primaryColumn}
        columns={bySupervisorColumns}
        data={data}
      />
    </div>
  );
}
