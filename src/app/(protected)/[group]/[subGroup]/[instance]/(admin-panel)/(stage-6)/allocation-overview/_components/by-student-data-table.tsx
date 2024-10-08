"use client";
import DataTable from "@/components/ui/data-table/data-table";

import { AllocationByStudentDto } from "@/lib/validations/allocation/data-table-dto";

import { byStudentColumns } from "./by-student-columns";

export function ByStudentDataTable({
  data,
}: {
  data: AllocationByStudentDto[];
}) {
  return (
    <div className="w-full">
      <DataTable
        searchableColumn={{ id: "Student Name", displayName: "Student Names" }}
        columns={byStudentColumns}
        data={data}
      />
    </div>
  );
}
