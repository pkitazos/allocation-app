"use client";
import DataTable from "@/components/ui/data-table/data-table";
import { ProjectTableData, columns } from "./projects-columns";

export function ClientSection({ data }: { data: ProjectTableData[] }) {
  return (
    <>
      <DataTable className="w-full" columns={columns} data={data} />
    </>
  );
}
