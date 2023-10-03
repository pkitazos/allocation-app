"use client";
import DataTable from "@/components/ui/data-table/data-table";
import { AllocationTableData, columns } from "./allocations-columns";

export function ClientSection({ data }: { data: AllocationTableData[] }) {
  return (
    <>
      <DataTable className="w-full" columns={columns} data={data} />
    </>
  );
}
