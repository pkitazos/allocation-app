"use client";
import DataTable from "@/components/ui/data-table/data-table";
import { StudentData, columns } from "./students-columns";

export function ClientSection({ data }: { data: StudentData[] }) {
  return (
    <>
      <DataTable className="w-full" columns={columns} data={data} />
    </>
  );
}
