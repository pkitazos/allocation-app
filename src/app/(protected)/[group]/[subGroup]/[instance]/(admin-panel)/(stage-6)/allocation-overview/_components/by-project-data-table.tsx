"use client";

import DataTable from "@/components/ui/data-table/data-table";

import { SearchableColumn } from "@/lib/validations/table";

import { byProjectColumns, ProjectData } from "./by-project-columns";

export function ByProjectDataTable({ data }: { data: ProjectData[] }) {
  const primaryColumn: SearchableColumn = {
    id: "projectTitle",
    displayName: "Project Titles",
  };

  return (
    <div className="w-full">
      <DataTable
        searchableColumn={primaryColumn}
        columns={byProjectColumns}
        data={data}
      />
    </div>
  );
}
