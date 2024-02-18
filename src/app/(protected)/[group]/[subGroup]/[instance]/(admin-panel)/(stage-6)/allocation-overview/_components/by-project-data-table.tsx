"use client";

import DataTable from "@/components/ui/data-table/data-table";

import { byProjectColumns,ProjectData } from "./by-project-columns";

export function ByProjectDataTable({ data }: { data: ProjectData[] }) {
  return (
    <div className="w-full">
      <DataTable columns={byProjectColumns} data={data} />
    </div>
  );
}
