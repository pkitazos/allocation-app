"use client";

import DataTable from "@/components/ui/data-table/data-table";

import { byProjectColumns } from "./by-project-columns";
import { AllocationByProjectDto } from "@/lib/validations/allocation/data-table-dto";

export function ByProjectDataTable({
  data,
}: {
  data: AllocationByProjectDto[];
}) {
  return (
    <div className="w-full">
      <DataTable
        searchableColumn={{
          id: "Project Title",
          displayName: "Project Titles",
        }}
        columns={byProjectColumns}
        data={data}
      />
    </div>
  );
}
