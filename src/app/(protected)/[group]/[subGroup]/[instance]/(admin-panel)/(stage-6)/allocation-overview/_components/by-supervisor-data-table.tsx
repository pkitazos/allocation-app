"use client";
import DataTable from "@/components/ui/data-table/data-table";

import { AllocationBySupervisorDto } from "@/lib/validations/allocation/data-table-dto";

import { bySupervisorColumns } from "./by-supervisor-columns";

export function BySupervisorDataTable({
  data,
}: {
  data: AllocationBySupervisorDto[];
}) {
  return (
    <div className="w-full">
      <DataTable
        searchableColumn={{
          id: "Supervisor GUID",
          displayName: "Supervisor GUIDs",
        }}
        columns={bySupervisorColumns}
        data={data}
      />
    </div>
  );
}
