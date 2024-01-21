"use client";
import DataTable from "@/components/ui/data-table/data-table";
import { SupervisorData, columns } from "./supervisors-columns";

export function SupervisorsDataTable({ data }: { data: SupervisorData[] }) {
  return <DataTable className="w-full" columns={columns} data={data} />;
}
