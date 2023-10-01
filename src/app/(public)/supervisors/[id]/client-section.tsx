"use client";
import DataTable from "@/components/ui/data-table/data-table";
import { SupervisorProjectData, columns } from "./projects-columns";

export function ClientSection({ data }: { data: SupervisorProjectData[] }) {
  return (
    <>
      <DataTable className="w-full" columns={columns} data={data} />
    </>
  );
}
