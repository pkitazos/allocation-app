"use client";

import DataTable from "@/components/ui/data-table/data-table";

import { SearchableColumn } from "@/lib/validations/table";

import { byStudentColumns, StudentData } from "./by-student-columns";

export function ByStudentDataTable({ data }: { data: StudentData[] }) {
  const primaryColumn: SearchableColumn = {
    id: "student ID",
    displayName: "Students IDs",
  };

  return (
    <div className="w-full">
      <DataTable
        searchableColumn={primaryColumn}
        columns={byStudentColumns}
        data={data}
      />
    </div>
  );
}
