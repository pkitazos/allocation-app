"use client";

import DataTable from "@/components/ui/data-table/data-table";

import { bySupervisorColumns,SupervisorData } from "./by-supervisor-columns";

export function BySupervisorDataTable({ data }: { data: SupervisorData[] }) {
  return (
    <div className="w-full">
      <DataTable columns={bySupervisorColumns} data={data} />
    </div>
  );
}
