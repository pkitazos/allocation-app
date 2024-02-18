"use client";

import DataTable from "@/components/ui/data-table/data-table";

import { byStudentColumns,StudentData } from "./by-student-columns";

export function ByStudentDataTable({ data }: { data: StudentData[] }) {
  return (
    <div className="w-full">
      <DataTable columns={byStudentColumns} data={data} />
    </div>
  );
}
